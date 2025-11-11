-- 修復 RLS 策略，允許在開發環境查看所有用戶
-- 在 Supabase SQL Editor 中執行此文件

-- 允許所有人查看用戶資料（僅開發環境使用）
DROP POLICY IF EXISTS "Anyone can view users" ON users;
CREATE POLICY "Anyone can view users" ON users
  FOR SELECT USING (true);

-- 驗證：查詢所有用戶
SELECT id, name, gender, birthday, created_at 
FROM users 
ORDER BY created_at DESC 
LIMIT 10;

