import { Request, Response } from 'express';
import { supabase, supabaseAdmin } from '../utils/supabase';
import { ApiResponse, User } from '../types';

export const authController = {
  // 註冊
  register: async (req: Request, res: Response) => {
    try {
      console.log('📝 Register request received:', {
        body: req.body,
        headers: req.headers['content-type'],
      });
      const { name, gender, birthday, phone } = req.body;

      if (!name || !gender || !birthday) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields'
        });
      }

      // 使用 Supabase Auth 註冊 (使用 email 而不是 phone)
      // 生成一個有效的 email 格式
      let email: string;
      if (phone && phone.includes('@')) {
        // 如果 phone 已經是 email 格式，直接使用
        email = phone;
      } else if (phone) {
        // 將電話號碼轉換為標準 email 格式
        email = `${phone.replace(/[^0-9]/g, '')}@beside.app`;
      } else {
        // 使用 name + 時間戳生成唯一 email
        const timestamp = Date.now();
        email = `user_${timestamp}_${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@beside.app`;
      }
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: 'default_password', // 實際應用中需要更安全的處理
        options: {
          emailRedirectTo: undefined, // 開發環境不需要 email 驗證
          data: {
            name: name,
            phone: phone
          }
        }
      });

      if (authError) {
        console.error('❌ Auth signup error:', authError);
        return res.status(400).json({
          success: false,
          error: authError.message
        });
      }

      if (!authData.user || !authData.user.id) {
        console.error('❌ Auth user not created:', authData);
        return res.status(400).json({
          success: false,
          error: 'User authentication failed'
        });
      }

      // 如果註冊後沒有 session（可能因為 email 確認），嘗試自動登入獲取 session
      let session = authData.session;
      if (!session && authData.user) {
        console.log('⚠️ No session from signup, attempting to sign in...');
        console.log('⚠️ Email used:', email);
        console.log('⚠️ User ID:', authData.user.id);
        
        // 嘗試使用新的 supabase client 實例登入（確保是乾淨的狀態）
        const { createClient } = await import('@supabase/supabase-js');
        const tempSupabase = createClient(
          process.env.SUPABASE_URL!,
          process.env.SUPABASE_ANON_KEY!
        );
        
        const { data: signInData, error: signInError } = await tempSupabase.auth.signInWithPassword({
          email: email,
          password: 'default_password'
        });
        
        if (signInError) {
          console.error('❌ Sign in error:', signInError.message);
          console.error('❌ Sign in error details:', JSON.stringify(signInError, null, 2));
        }
        if (!signInError && signInData?.session) {
          session = signInData.session;
          console.log('✅ Session obtained from sign in:', signInData.session.access_token.substring(0, 20) + '...');
        } else {
          console.error('❌ Failed to get session from sign in');
          console.error('❌ signInData:', signInData ? 'Got data but no session' : 'No data');
        }
      }
      
      console.log('📋 Final session status:', session ? `✅ Present (${session.access_token.substring(0, 20)}...)` : '❌ Missing');

      console.log('✅ Auth user created:', authData.user.id);

      // 創建用戶資料 (使用 admin client 繞過 RLS)
      const { data: userData, error: userError } = await supabaseAdmin
        .from('users')
        .insert({
          id: authData.user.id,
          name,
          gender,
          birthday,
          phone
        })
        .select()
        .single();

      if (userError) {
        console.error('❌ User insert error:', userError);
        console.error('❌ Attempted to insert:', {
          id: authData.user.id,
          name,
          gender,
          birthday,
          phone
        });
        return res.status(400).json({
          success: false,
          error: userError.message
        });
      }

      console.log('✅ User record created:', userData?.id);

      // 返回用戶資料和 session
      res.status(201).json({
        success: true,
        data: {
          user: userData,
          session: session
        },
        message: 'User registered successfully'
      });

    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  // 登入
  login: async (req: Request, res: Response) => {
    try {
      const { phone, password } = req.body;

      // 將 phone 轉換為 email 格式
      const email = phone ? `${phone}@beside.app` : phone;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return res.status(401).json({
          success: false,
          error: error.message
        });
      }

      res.json({
        success: true,
        data: {
          user: data.user,
          session: data.session
        },
        message: 'Login successful'
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  // 登出
  logout: async (req: Request, res: Response) => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }

      res.json({
        success: true,
        message: 'Logout successful'
      });

    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  // 獲取用戶資料
  getProfile: async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'No token provided'
        });
      }

      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid token'
        });
      }

      // 獲取用戶詳細資料
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        data: userData
      });

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  // 更新用戶資料
  updateProfile: async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'No token provided'
        });
      }

      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid token'
        });
      }

      const { name, gender, birthday } = req.body;

      // 建構更新物件，只包含有提供的欄位
      const updates: any = {
        updated_at: new Date().toISOString()
      };
      
      if (name !== undefined) updates.name = name;
      if (gender !== undefined) updates.gender = gender;
      if (birthday !== undefined) updates.birthday = birthday;

      // 使用 admin client 繞過 RLS
      const { data: userData, error: userError } = await supabaseAdmin
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (userError) {
        return res.status(400).json({
          success: false,
          error: userError.message
        });
      }

      res.json({
        success: true,
        data: userData,
        message: 'Profile updated successfully'
      });

    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
};
