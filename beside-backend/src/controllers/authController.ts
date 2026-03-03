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
      const { name, gender, birthday, phone, email, password } = req.body;

      if (!name || !gender || !birthday || !email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields (name, gender, birthday, email, password)'
        });
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
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

      let session = authData.session;
      if (!session && authData.user) {
        console.log('⚠️ No session from signup, attempting to sign in...');
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: email,
          password: password
        });
        if (signInError) {
          console.error('❌ Sign in error:', signInError.message);
        } else if (signInData?.session) {
          session = signInData.session;
          console.log('✅ Session obtained from sign in');
        }
      }

      console.log('✅ Auth user created:', authData.user.id);

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
        return res.status(400).json({
          success: false,
          error: userError.message
        });
      }

      console.log('✅ User record created:', userData?.id);

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
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Missing email or password'
        });
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password
      });

      if (error) {
        return res.status(401).json({
          success: false,
          error: error.message
        });
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (userError) {
        console.error('User record not found for auth user:', data.user.id);
      }

      res.json({
        success: true,
        data: {
          user: userData || data.user,
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

      const body = req.body || {};
      const { name, gender, birthday } = body;

      const updates: any = {
        updated_at: new Date().toISOString()
      };

      if (name !== undefined) updates.name = name;
      if (gender !== undefined) updates.gender = gender;
      if (birthday !== undefined) updates.birthday = birthday;

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

    } catch (error: any) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        details: error.message
      });
    }
  }
};
