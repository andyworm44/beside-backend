import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:8081",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🔧 Supabase Config:', {
  url: supabaseUrl ? '✅ Set' : '❌ Missing',
  anonKey: supabaseAnonKey ? '✅ Set' : '❌ Missing'
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'beside-backend'
  });
});

// Test Supabase connection
app.get('/test-supabase', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
    
    res.json({
      success: true,
      message: 'Supabase connection successful',
      data: data,
      tables: ['users', 'lonely_signals', 'signal_responses', 'user_locations']
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// API Routes
const API_PREFIX = '/api/v1';

// 獲取附近的寂寞信號
app.get(`${API_PREFIX}/signals/nearby`, async (req, res) => {
  try {
    const { latitude, longitude, radius = 5 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required'
      });
    }

    // 查詢寂寞信號
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
});

// 發送寂寞信號
app.post(`${API_PREFIX}/signals`, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    // 暫時使用模擬用戶 ID
    const userId = '550e8400-e29b-41d4-a716-446655440001';
    
    // 獲取用戶資料
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
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
        user_id: userId,
        user_name: userData.name,
        user_gender: userData.gender,
        user_age: userData.birthday,
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
});

// 回應寂寞信號
app.post(`${API_PREFIX}/signals/:id/respond`, async (req, res) => {
  try {
    const { id } = req.params;
    const { message = '我陪你' } = req.body;
    
    // 暫時使用模擬回應者 ID
    const responderId = '550e8400-e29b-41d4-a716-446655440002';
    
    // 獲取回應者資料
    const { data: responderData, error: responderError } = await supabase
      .from('users')
      .select('*')
      .eq('id', responderId)
      .single();

    if (responderError || !responderData) {
      return res.status(404).json({
        success: false,
        error: 'Responder not found'
      });
    }

    // 創建回應
    const { data: response, error: responseError } = await supabase
      .from('signal_responses')
      .insert({
        signal_id: id,
        responder_id: responderId,
        responder_name: responderData.name,
        responder_gender: responderData.gender,
        responder_age: responderData.birthday,
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

    // 取消原信號
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
});

// 獲取收到的回應
app.get(`${API_PREFIX}/signals/responses`, async (req, res) => {
  try {
    // 暫時使用模擬用戶 ID
    const userId = '550e8400-e29b-41d4-a716-446655440001';
    
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
      .eq('lonely_signals.user_id', userId)
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
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Working server running on port ${PORT}`);
  console.log(`📱 CORS enabled for: ${process.env.CORS_ORIGIN || "http://localhost:8081"}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API base: http://localhost:${PORT}${API_PREFIX}`);
});
