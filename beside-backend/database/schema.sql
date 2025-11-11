-- Beside App Database Schema
-- 焦慮陪伴 App 數據庫結構

-- 啟用必要的擴展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 用戶表
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  birthday DATE NOT NULL,
  phone VARCHAR(20) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 焦慮信號表
CREATE TABLE IF NOT EXISTS lonely_signals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_name VARCHAR(100) NOT NULL,
  user_gender VARCHAR(10) NOT NULL,
  user_age VARCHAR(20) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 信號回應表
CREATE TABLE IF NOT EXISTS signal_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  signal_id UUID NOT NULL REFERENCES lonely_signals(id) ON DELETE CASCADE,
  responder_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  responder_name VARCHAR(100) NOT NULL,
  responder_gender VARCHAR(10) NOT NULL,
  responder_age VARCHAR(20) NOT NULL,
  message TEXT DEFAULT '我陪你',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用戶位置表
CREATE TABLE IF NOT EXISTS user_locations (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  accuracy DECIMAL(8, 2),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 創建索引以提高查詢性能
CREATE INDEX IF NOT EXISTS idx_lonely_signals_active ON lonely_signals(is_active);
CREATE INDEX IF NOT EXISTS idx_lonely_signals_user_id ON lonely_signals(user_id);
CREATE INDEX IF NOT EXISTS idx_lonely_signals_location ON lonely_signals(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_lonely_signals_created_at ON lonely_signals(created_at);

CREATE INDEX IF NOT EXISTS idx_signal_responses_signal_id ON signal_responses(signal_id);
CREATE INDEX IF NOT EXISTS idx_signal_responses_responder_id ON signal_responses(responder_id);
CREATE INDEX IF NOT EXISTS idx_signal_responses_created_at ON signal_responses(created_at);

CREATE INDEX IF NOT EXISTS idx_user_locations_user_id ON user_locations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_locations_coords ON user_locations(latitude, longitude);

-- 創建更新時間的觸發器函數（如果不存在）
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 為 users 表添加觸發器（如果不存在）
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 為 lonely_signals 表添加觸發器（如果不存在）
DROP TRIGGER IF EXISTS update_lonely_signals_updated_at ON lonely_signals;
CREATE TRIGGER update_lonely_signals_updated_at 
    BEFORE UPDATE ON lonely_signals 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 為 user_locations 表添加觸發器（如果不存在）
DROP TRIGGER IF EXISTS update_user_locations_updated_at ON user_locations;
CREATE TRIGGER update_user_locations_updated_at 
    BEFORE UPDATE ON user_locations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 插入一些測試數據（如果不存在）
INSERT INTO users (id, name, gender, birthday, phone) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', '小明', 'male', '1995-01-15', '+886912345678'),
  ('550e8400-e29b-41d4-a716-446655440002', '小美', 'female', '1998-03-22', '+886912345679'),
  ('550e8400-e29b-41d4-a716-446655440003', '阿華', 'male', '1992-07-08', '+886912345680'),
  ('550e8400-e29b-41d4-a716-446655440004', '小芳', 'female', '1996-11-30', '+886912345681')
ON CONFLICT (id) DO NOTHING;

-- 插入一些測試的焦慮信號
INSERT INTO lonely_signals (user_id, user_name, user_gender, user_age, latitude, longitude, is_active) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', '小明', 'male', '25歲', 25.0330, 121.5654, true),
  ('550e8400-e29b-41d4-a716-446655440002', '小美', 'female', '22歲', 25.0340, 121.5664, true),
  ('550e8400-e29b-41d4-a716-446655440003', '阿華', 'male', '28歲', 25.0350, 121.5674, true)
ON CONFLICT DO NOTHING;

-- 插入一些測試的用戶位置
INSERT INTO user_locations (user_id, latitude, longitude, accuracy) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 25.0330, 121.5654, 10.0),
  ('550e8400-e29b-41d4-a716-446655440002', 25.0340, 121.5664, 15.0),
  ('550e8400-e29b-41d4-a716-446655440003', 25.0350, 121.5674, 20.0),
  ('550e8400-e29b-41d4-a716-446655440004', 25.0360, 121.5684, 25.0)
ON CONFLICT (user_id) DO UPDATE SET
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  accuracy = EXCLUDED.accuracy,
  updated_at = NOW();

-- 設置 Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE lonely_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE signal_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;

-- 創建 RLS 策略（如果不存在）
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON users;
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 焦慮信號策略（如果不存在）
DROP POLICY IF EXISTS "Anyone can view active signals" ON lonely_signals;
CREATE POLICY "Anyone can view active signals" ON lonely_signals
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Users can create own signals" ON lonely_signals;
CREATE POLICY "Users can create own signals" ON lonely_signals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own signals" ON lonely_signals;
CREATE POLICY "Users can update own signals" ON lonely_signals
  FOR UPDATE USING (auth.uid() = user_id);

-- 信號回應策略（如果不存在）
DROP POLICY IF EXISTS "Users can view responses to their signals" ON signal_responses;
CREATE POLICY "Users can view responses to their signals" ON signal_responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM lonely_signals 
      WHERE lonely_signals.id = signal_responses.signal_id 
      AND lonely_signals.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create responses" ON signal_responses;
CREATE POLICY "Users can create responses" ON signal_responses
  FOR INSERT WITH CHECK (auth.uid() = responder_id);

-- 用戶位置策略（如果不存在）
DROP POLICY IF EXISTS "Users can view nearby locations" ON user_locations;
CREATE POLICY "Users can view nearby locations" ON user_locations
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own location" ON user_locations;
CREATE POLICY "Users can update own location" ON user_locations
  FOR ALL USING (auth.uid() = user_id);

-- 創建視圖：附近的焦慮信號
CREATE OR REPLACE VIEW nearby_signals AS
SELECT 
  ls.id,
  ls.user_id,
  ls.user_name,
  ls.user_gender,
  ls.user_age,
  ls.latitude,
  ls.longitude,
  ls.created_at,
  COUNT(sr.id) as response_count
FROM lonely_signals ls
LEFT JOIN signal_responses sr ON ls.id = sr.signal_id
WHERE ls.is_active = true
GROUP BY ls.id, ls.user_id, ls.user_name, ls.user_gender, ls.user_age, ls.latitude, ls.longitude, ls.created_at
ORDER BY ls.created_at DESC;

-- 創建視圖：用戶收到的回應
CREATE OR REPLACE VIEW user_responses AS
SELECT 
  sr.id,
  sr.signal_id,
  sr.responder_id,
  sr.responder_name,
  sr.responder_gender,
  sr.responder_age,
  sr.message,
  sr.created_at,
  ls.user_id as signal_owner_id
FROM signal_responses sr
JOIN lonely_signals ls ON sr.signal_id = ls.id
WHERE ls.is_active = false;

COMMENT ON TABLE users IS '用戶資料表';
COMMENT ON TABLE lonely_signals IS '焦慮信號表';
COMMENT ON TABLE signal_responses IS '信號回應表';
COMMENT ON TABLE user_locations IS '用戶位置表';
COMMENT ON VIEW nearby_signals IS '附近焦慮信號視圖';
COMMENT ON VIEW user_responses IS '用戶收到回應視圖';
