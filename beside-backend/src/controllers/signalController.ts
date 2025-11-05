import { Request, Response } from 'express';
import { supabase, supabaseAdmin } from '../utils/supabase';
import { ApiResponse, LonelySignal, CreateSignalRequest, RespondToSignalRequest } from '../types';

// 從生日（YYYY-MM-DD 格式）計算年齡
const calculateAge = (birthday: string): string => {
  const birthDate = new Date(birthday);
  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  // 如果還沒到生日，年齡減1
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return `${age}歲`;
};

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

      // 位置資訊是可選的，如果沒有提供則使用 null
      const body = req.body || {};
      const { latitude, longitude } = body as CreateSignalRequest;
      
      console.log('📡 Create signal request body:', body);

      // 獲取用戶資料（使用 admin client 繞過 RLS）
      const { data: userData, error: userError } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError || !userData) {
        console.error('❌ User not found in database:', user.id, userError);
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // 計算年齡
      const age = calculateAge(userData.birthday);

      // 創建寂寞信號（使用 admin client 繞過 RLS）
      const { data: signal, error: signalError } = await supabaseAdmin
        .from('lonely_signals')
        .insert({
          user_id: user.id,
          user_name: userData.name,
          user_gender: userData.gender,
          user_age: age, // 顯示計算出的年紀（如：25歲）
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

      // 取消信號（使用 admin client 繞過 RLS）
      const { error } = await supabaseAdmin
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

      // 獲取用戶資料（使用 admin client 繞過 RLS）
      const { data: userData, error: userError } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError || !userData) {
        console.error('❌ User not found in database:', user.id, userError);
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // 計算年齡
      const age = calculateAge(userData.birthday);

      // 創建回應（使用 admin client 繞過 RLS）
      const { data: response, error: responseError } = await supabaseAdmin
        .from('signal_responses')
        .insert({
          signal_id: id,
          responder_id: user.id,
          responder_name: userData.name,
          responder_gender: userData.gender,
          responder_age: age, // 顯示計算出的年紀（如：25歲）
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

      // 取消原信號（因為已經有人回應了，使用 admin client 繞過 RLS）
      const { error: updateError } = await supabaseAdmin
        .from('lonely_signals')
        .update({ is_active: false })
        .eq('id', id);
      
      if (updateError) {
        console.error('❌ 更新信號狀態失敗:', updateError);
      } else {
        console.log('✅ 信號已標記為非活躍:', id);
      }

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

  // 獲取統計數據
  getStatistics: async (req: Request, res: Response) => {
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

      // 獲取用戶的所有信號（使用 admin client 繞過 RLS）
      const { data: signals, error } = await supabaseAdmin
        .from('lonely_signals')
        .select('created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }

      // 獲取用戶收到的回應數量
      const { data: mySignalsForResponses } = await supabaseAdmin
        .from('lonely_signals')
        .select('id')
        .eq('user_id', user.id);

      const signalIds = mySignalsForResponses?.map(s => s.id) || [];
      let responseCount = 0;
      if (signalIds.length > 0) {
        const { data: responses } = await supabaseAdmin
          .from('signal_responses')
          .select('id')
          .in('signal_id', signalIds);
        responseCount = responses?.length || 0;
      }

      // 獲取用戶回應他人的次數
      const { data: myResponses } = await supabaseAdmin
        .from('signal_responses')
        .select('id')
        .eq('responder_id', user.id);
      const accompanyCount = myResponses?.length || 0;

      res.json({
        success: true,
        data: {
          signals: signals || [],
          totalSignalsSent: signals?.length || 0,
          totalResponsesReceived: responseCount,
          totalAccompanied: accompanyCount,
        }
      });

    } catch (error) {
      console.error('Get statistics error:', error);
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

      // 使用 admin client 繞過 RLS，查詢所有回應我發出的訊號的回應
      // 先獲取所有我發出的訊號 ID
      const { data: mySignals, error: signalsError } = await supabaseAdmin
        .from('lonely_signals')
        .select('id')
        .eq('user_id', user.id);

      if (signalsError) {
        return res.status(500).json({
          success: false,
          error: signalsError.message
        });
      }

      const signalIds = mySignals?.map(s => s.id) || [];

      if (signalIds.length === 0) {
        return res.json({
          success: true,
          data: []
        });
      }

      // 查詢所有回應這些訊號的回應，只返回最新的一個
      const { data: responses, error } = await supabaseAdmin
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
        .in('signal_id', signalIds)
        .order('created_at', { ascending: false })
        .limit(1);

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
