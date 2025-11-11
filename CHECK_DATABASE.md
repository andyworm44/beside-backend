# 檢查資料庫設置

## 🔍 步驟：檢查 Supabase 資料庫表是否已創建

### 方法 1：在 Supabase Dashboard 檢查

1. 前往 https://supabase.com/dashboard
2. 選擇你的項目（URL: prnulzhvntngzpebbayf.supabase.co）
3. 點擊左側選單的 **Table Editor**
4. 檢查是否有以下表：
   - ✅ `users`
   - ✅ `lonely_signals`
   - ✅ `signal_responses`
   - ✅ `user_locations`

### 如果沒有這些表，執行 SQL：

1. 在 Supabase Dashboard，點擊 **SQL Editor**
2. 點擊 **New query**
3. 複製並貼上 `/Users/andyh/beside/beside-backend/database/schema.sql` 的完整內容
4. 點擊 **Run**（或按 Cmd/Ctrl + Enter）

### 檢查是否成功：

執行後，回到 **Table Editor**，應該能看到：
- `users` 表（可能已有測試數據）
- `lonely_signals` 表（可能已有測試數據）
- `signal_responses` 表
- `user_locations` 表（可能已有測試數據）

---

## ✅ 確認後告訴我

如果表已經存在，告訴我「表已存在」，我們繼續下一步。

如果需要執行 SQL，執行完後告訴我「SQL 已執行」，我們繼續下一步。

