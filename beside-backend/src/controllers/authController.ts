import { Request, Response } from 'express';
import { supabase, supabaseAdmin } from '../utils/supabase';
import { ApiResponse, User } from '../types';

export const authController = {
  // 註冊
  register: async (req: Request, res: Response) => {
    try {
      const { name, gender, birthday, phone } = req.body;

      if (!name || !gender || !birthday) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields'
        });
      }

      // 使用 Supabase Auth 註冊 (使用 email 而不是 phone)
      const email = phone ? `${phone}@beside.app` : `${name}@beside.app`;
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: 'default_password' // 實際應用中需要更安全的處理
      });

      if (authError) {
        return res.status(400).json({
          success: false,
          error: authError.message
        });
      }

      // 創建用戶資料 (使用 admin client 繞過 RLS)
      const { data: userData, error: userError } = await supabaseAdmin
        .from('users')
        .insert({
          id: authData.user?.id,
          name,
          gender,
          birthday,
          phone
        })
        .select()
        .single();

      if (userError) {
        return res.status(400).json({
          success: false,
          error: userError.message
        });
      }

      res.status(201).json({
        success: true,
        data: userData,
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

      const { data: userData, error: userError } = await supabase
        .from('users')
        .update({
          name,
          gender,
          birthday,
          updated_at: new Date().toISOString()
        })
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
