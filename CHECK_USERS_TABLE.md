# 檢查 Users 表的步驟

## 🔍 可能的原因

### 1. RLS (Row Level Security) 策略阻止查看

Supabase 的 RLS 策略可能只允許用戶查看自己的資料。讓我們添加一個策略允許查看所有用戶（開發環境）。

### 2. 查看方式不正確

確保你在查看正確的表和項目。

---

## ✅ 解決方案

### 步驟 1：確認在正確的 Supabase 項目

1. 前往 https://supabase.com/dashboard
2. 確認選擇的項目 URL 是：`prnulzhvntngzpebbayf.supabase.co`

### 步驟 2：使用 Service Role Key 查看（繞過 RLS）

在 Supabase Dashboard：

1. 點擊 **SQL Editor**
2. 點擊 **New query**
3. 貼上以下 SQL：

```sql
-- 查看所有用戶（使用 service role，繞過 RLS）
SELECT * FROM users ORDER BY created_at DESC LIMIT 10;
```

4. 點擊 **Run**

如果這樣能看到記錄，表示 RLS 策略阻止了 Table Editor 的查看。

### 步驟 3：修改 RLS 策略允許查看所有用戶（開發環境）

在 SQL Editor 執行：

```sql
-- 允許所有人查看用戶資料（僅開發環境）
DROP POLICY IF EXISTS "Anyone can view users" ON users;
CREATE POLICY "Anyone can view users" ON users
  FOR SELECT USING (true);

-- 允許使用 service role 插入用戶（如果還沒有）
DROP POLICY IF EXISTS "Service role can insert users" ON users;
-- 注意：service role 會自動繞過 RLS，所以不需要這個策略
```

---

## 🔧 或者：使用 API 直接查詢

你也可以用這個 API 查詢：

```bash
curl http://localhost:3001/api/v1/auth/me
```

（需要先登入獲取 token）

---

## 📝 檢查後端日誌

後端終端機現在應該會顯示詳細日誌，包括：
- ✅ Auth user created: <user_id>
- ✅ User record created: <user_id>
- 或 ❌ 錯誤訊息

請查看後端終端機，看看是否有這些日誌訊息。

