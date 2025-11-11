-- 清空所有數據（保留表結構）
-- Clear all data while keeping table structure

-- 清空信號回應表
DELETE FROM signal_responses;

-- 清空焦慮信號表
DELETE FROM lonely_signals;

-- 清空用戶位置表
DELETE FROM user_locations;

-- 清空用戶表（注意：這會刪除所有用戶，包括Supabase Auth中的用戶需要手動處理）
DELETE FROM users;

-- 重置序列（如果有使用序列）
-- 注意：UUID主鍵不需要重置序列

-- 確認清空結果
SELECT 'Users cleared' as status, COUNT(*) as count FROM users
UNION ALL
SELECT 'Lonely signals cleared', COUNT(*) FROM lonely_signals
UNION ALL
SELECT 'Signal responses cleared', COUNT(*) FROM signal_responses
UNION ALL
SELECT 'User locations cleared', COUNT(*) FROM user_locations;




