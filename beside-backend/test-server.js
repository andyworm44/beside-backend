const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:8081",
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'beside-backend'
  });
});

// Test environment variables
app.get('/env-test', (req, res) => {
  res.json({
    SUPABASE_URL: process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
    PORT: process.env.PORT || '3001',
    NODE_ENV: process.env.NODE_ENV || 'development'
  });
});

// Test Supabase connection
app.get('/test-supabase', async (req, res) => {
  try {
    const { createClient } = require('@supabase/supabase-js');
    
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return res.status(500).json({
        success: false,
        error: 'Missing Supabase environment variables'
      });
    }
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Test connection by querying users table
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
        details: 'Failed to connect to Supabase'
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
      error: error.message,
      details: 'Supabase connection failed'
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📱 CORS enabled for: ${process.env.CORS_ORIGIN || "http://localhost:8081"}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Env test: http://localhost:${PORT}/env-test`);
});
