import { Request, Response } from 'express';
import { supabase } from '../utils/supabase';
import { ApiResponse, LonelySignal, CreateSignalRequest, RespondToSignalRequest } from '../types';

export const signalController = {
  // 獲取附近的寂寞信號
  getNearbySignals: async (req: Request, res: Response) => {
    try {
      const { latitude, longitude, radius = 5 } = req.query; // 預設5公里範圍

      if (!latitude || !longitude) {
        return res.status(400).json({
          success: false,
          error: 'Latitude and longitude are required'
        });
      }

      // 這裡可以實現基於位置的查詢
      // 暫時返回所有信號（實際應用中需要地理位置查詢）
      const { data: signals, error } = await supabase
        .from('lonely_signals')
        .select(`
          *,
          users!lonely_signals_user_id_fkey (
            name,
            gender,
            birthday
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }

      res.json({
        success: true,
        data: signals || []
      });

    } catch (error) {
      console.error('Get nearby signals error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  // 發送寂寞信號
  createSignal: async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'No token provided'
        });
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser(token);

      if (authError || !user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid token'
        });
      }

      const { latitude, longitude } = req.body as CreateSignalRequest;

      // 獲取用戶資料
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

      // 創建寂寞信號
      const { data: signal, error: signalError } = await supabase
        .from('lonely_signals')
        .insert({
          user_id: user.id,
          user_name: userData.name,
          user_gender: userData.gender,
          user_age: userData.birthday, // 這裡需要計算年齡
          latitude,
          longitude,
          is_active: true
        })
        .select()
        .single();

      if (signalError) {
        return res.status(400).json({
          success: false,
          error: signalError.message
        });
      }

      res.status(201).json({
        success: true,
        data: signal,
        message: 'Signal created successfully'
      });

    } catch (error) {
      console.error('Create signal error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  // 取消寂寞信號
  cancelSignal: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'No token provided'
        });
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser(token);

      if (authError || !user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid token'
        });
      }

      // 取消信號
      const { error } = await supabase
        .from('lonely_signals')
        .update({ is_active: false })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }

      res.json({
        success: true,
        message: 'Signal cancelled successfully'
      });

    } catch (error) {
      console.error('Cancel signal error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  // 回應寂寞信號
  respondToSignal: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const message = (req.body && req.body.message) || '我陪你';
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'No token provided'
        });
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser(token);

      if (authError || !user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid token'
        });
      }

      // 獲取用戶資料
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

      // 創建回應
      const { data: response, error: responseError } = await supabase
        .from('signal_responses')
        .insert({
          signal_id: id,
          responder_id: user.id,
          responder_name: userData.name,
          responder_gender: userData.gender,
          responder_age: userData.birthday,
          message
        })
        .select()
        .single();

      if (responseError) {
        return res.status(400).json({
          success: false,
          error: responseError.message
        });
      }

      // 取消原信號（因為已經有人回應了）
      await supabase
        .from('lonely_signals')
        .update({ is_active: false })
        .eq('id', id);

      res.status(201).json({
        success: true,
        data: response,
        message: 'Response sent successfully'
      });

    } catch (error) {
      console.error('Respond to signal error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  // 獲取我的信號
  getMySignals: async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'No token provided'
        });
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser(token);

      if (authError || !user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid token'
        });
      }

      const { data: signals, error } = await supabase
        .from('lonely_signals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }

      res.json({
        success: true,
        data: signals || []
      });

    } catch (error) {
      console.error('Get my signals error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  // 獲取收到的回應
  getMyResponses: async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'No token provided'
        });
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser(token);

      if (authError || !user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid token'
        });
      }

      const { data: responses, error } = await supabase
        .from('signal_responses')
        .select(`
          *,
          lonely_signals!signal_responses_signal_id_fkey (
            user_id,
            user_name,
            user_gender,
            user_age
          )
        `)
        .eq('lonely_signals.user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }

      res.json({
        success: true,
        data: responses || []
      });

    } catch (error) {
      console.error('Get my responses error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
};
