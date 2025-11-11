# 一步一步測試指南

## 📋 第一步：檢查 Supabase 帳號和項目

### 1.1 檢查是否有 Supabase 帳號

1. 打開瀏覽器，前往 https://supabase.com
2. 如果你已經有帳號：
   - 點擊右上角「Sign In」登入
   - 進入你的 Dashboard

3. 如果還沒有帳號：
   - 點擊右上角「Sign Up」註冊
   - 可以用 GitHub 帳號快速註冊

### 1.2 創建新項目（如果還沒有）

1. 在 Supabase Dashboard 中，點擊「New Project」
2. 填寫項目資訊：
   - **Name**: `beside-app`（或任何你喜歡的名稱）
   - **Database Password**: 記下這個密碼（很重要！）
   - **Region**: 選擇離你最近的區域（例如 Southeast Asia）
3. 點擊「Create new project」
4. 等待項目創建完成（約需 1-2 分鐘）

### 1.3 獲取 Supabase 配置資訊

項目創建完成後：

1. 點擊左側選單的 **Settings**（齒輪圖標）
2. 點擊 **API**
3. 你會看到：
   - **Project URL** - 複製這個網址
   - **anon public** key - 複製這個 key
   - **service_role** key - 複製這個 key（⚠️ 注意：這個 key 要保密！）

4. **把這三個值記下來，下一步會用到**

---

## 📝 第二步：配置後端環境變數

### 2.1 打開終端機（Terminal）

- **macOS**: 按 `Cmd + Space`，輸入「Terminal」並按 Enter
- **Windows**: 按 `Win + R`，輸入 `cmd` 並按 Enter

### 2.2 進入後端目錄

```bash
cd /Users/andyh/beside/beside-backend
```

### 2.3 檢查是否已有 .env 文件

```bash
ls -la | grep .env
```

如果沒有看到 `.env`，繼續下一步。如果已經有，跳過 2.4。

### 2.4 創建 .env 文件

```bash
cp env.example .env
```

### 2.5 編輯 .env 文件

打開 `.env` 文件（可以用任何文字編輯器，例如 VS Code、nano、vim）：

```bash
# 如果用 VS Code
code .env

# 或者用 nano（較簡單）
nano .env
```

### 2.6 填入 Supabase 配置

將你在第一步獲取的三個值填入 `.env` 文件：

```env
# Supabase Configuration
SUPABASE_URL=你剛才複製的 Project URL
SUPABASE_ANON_KEY=你剛才複製的 anon public key
SUPABASE_SERVICE_ROLE_KEY=你剛才複製的 service_role key

# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Secret（可以隨便填一個字串）
JWT_SECRET=my_super_secret_jwt_key_12345

# CORS Configuration（如果是用模擬器測試，保持這個就好）
CORS_ORIGIN=http://localhost:8081
```

**範例：**
```env
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY3ODk5MDAwMCwiZXhwIjoxOTk0NTY2MDAwfQ.example
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjc4OTkwMDAwLCJleHAiOjE5OTQ1NjYwMDB9.example
```

**保存文件：**
- 如果用的是 nano：按 `Ctrl + X`，然後按 `Y`，最後按 `Enter`
- 如果用的是 VS Code：按 `Cmd + S`（Mac）或 `Ctrl + S`（Windows）

---

## 🗄️ 第三步：設置資料庫結構

### 3.1 打開 Supabase SQL Editor

1. 在 Supabase Dashboard 左側選單，點擊 **SQL Editor**
2. 點擊 **New query**

### 3.2 複製 SQL 文件內容

打開終端機，顯示 SQL 文件內容：

```bash
cat /Users/andyh/beside/beside-backend/database/schema.sql
```

**或者** 直接用文字編輯器打開：
```bash
code /Users/andyh/beside/beside-backend/database/schema.sql
```

### 3.3 執行 SQL

1. **複製整個 `schema.sql` 文件的內容**（全選並複製）
2. 在 Supabase SQL Editor 中，**貼上所有內容**
3. 點擊右下角的 **Run** 按鈕（或按 `Cmd/Ctrl + Enter`）
4. 等待執行完成

### 3.4 確認表已創建

1. 在 Supabase Dashboard 左側選單，點擊 **Table Editor**
2. 你應該看到以下表：
   - ✅ `users`
   - ✅ `lonely_signals`
   - ✅ `signal_responses`
   - ✅ `user_locations`

如果看不到這些表，回到 3.3 檢查 SQL 執行是否有錯誤。

---

## 🚀 第四步：安裝依賴並啟動後端

### 4.1 安裝後端依賴

在終端機中（確保在 `beside-backend` 目錄）：

```bash
cd /Users/andyh/beside/beside-backend
npm install
```

這會安裝所有需要的套件，可能需要 1-2 分鐘。

### 4.2 檢查是否有 TypeScript 編譯錯誤

```bash
npm run build
```

如果沒有錯誤訊息，繼續下一步。如果有錯誤，告訴我錯誤內容。

### 4.3 啟動後端服務器

```bash
npm run dev
```

**你應該會看到類似這樣的訊息：**
```
🚀 Server running on port 3001
📱 CORS enabled for: http://localhost:8081
🔗 Health check: http://localhost:3001/health
🔧 Supabase Config: { url: '✅ Set', anonKey: '✅ Set', serviceKey: '✅ Set' }
```

**⚠️ 保持這個終端機視窗開啟！** 後端服務器需要一直運行。

### 4.4 測試後端是否正常運行

**打開另一個終端機視窗**（不要關閉第一個），執行：

```bash
curl http://localhost:3001/health
```

**應該會看到：**
```json
{
  "status": "OK",
  "timestamp": "2024-01-XX...",
  "service": "beside-backend"
}
```

如果看到這個回應，恭喜！後端已經正常運行了！🎉

---

## 📱 第五步：測試註冊功能

### 5.1 啟動 Mobile App

在另一個終端機視窗：

```bash
cd /Users/andyh/beside/beside-mobile
npm start
```

或者如果你用的是 Expo：
```bash
npx expo start
```

### 5.2 在 App 中測試註冊

1. 打開你的手機 App（或模擬器）
2. 進入註冊頁面
3. 填入資訊：
   - **姓名**: 測試用戶
   - **性別**: 選擇任一性別
   - **生日**: 選擇一個日期
   - **電話**: 可選填
4. 點擊註冊按鈕

### 5.3 檢查註冊是否成功

**在後端終端機視窗中**，你應該會看到：
```
Register request received
Register successful
```

**在 Supabase Dashboard 中：**
1. 點擊 **Table Editor**
2. 點擊 `users` 表
3. 你應該看到新創建的用戶記錄！

如果註冊失敗，查看後端終端機的錯誤訊息，告訴我發生了什麼。

---

## 📡 第六步：測試發送訊號

### 6.1 在 App 中發送訊號

1. 確保你已經註冊並登入（註冊成功後應該自動登入）
2. 進入首頁
3. **點擊或長按愛心**發送焦慮訊號

### 6.2 檢查訊號是否發送成功

**在後端終端機中**，應該看到：
```
Create signal request received
Signal created successfully
```

**在 Supabase Dashboard 中：**
1. 點擊 **Table Editor**
2. 點擊 `lonely_signals` 表
3. 你應該看到新創建的訊號記錄！
4. 確認 `is_active` 欄位是 `true`

如果發送失敗，檢查：
- 是否已經註冊並登入？
- 後端終端機是否有錯誤訊息？

---

## 👥 第七步：測試查看附近訊號

### 7.1 在 App 中查看列表

1. 進入「列表」頁面（通常在底部導航）
2. 應該會顯示附近的訊號

**注意：** 如果資料庫中沒有其他訊號，列表可能是空的。這是正常的！

### 7.2 手動添加測試訊號（可選）

如果你想測試看到其他訊號，可以在 Supabase Dashboard 手動添加：

1. 進入 **Table Editor** → `lonely_signals`
2. 點擊 **Insert** → **Insert row**
3. 填入：
   - `user_id`: 選擇 `users` 表中的一個用戶 ID
   - `user_name`: 任何名字
   - `user_gender`: male / female / other
   - `user_age`: 例如 "25歲"
   - `latitude`: 25.0330
   - `longitude`: 121.5654
   - `is_active`: true
4. 點擊 **Save**
5. 回到 App 的列表頁面，應該能看到這個訊號

---

## 💬 第八步：測試回應訊號

### 8.1 註冊第二個測試帳號

1. 在 App 中登出（如果已登入）
2. 註冊一個新帳號（使用不同的名字）
3. 登入這個新帳號

### 8.2 查看並回應訊號

1. 進入列表頁面
2. 應該看到第一個帳號發送的訊號
3. 點擊一個訊號
4. 點擊「我陪你」或回應按鈕

### 8.3 檢查回應是否成功

**在 Supabase Dashboard 中：**
1. 點擊 **Table Editor** → `signal_responses` 表
2. 應該看到新創建的回應記錄！
3. 回到 `lonely_signals` 表
4. 對應訊號的 `is_active` 應該變成 `false`（因為已經有人回應了）

---

## ✅ 完成檢查清單

當你完成所有步驟後，應該能夠：

- ✅ 註冊新用戶並在資料庫中看到記錄
- ✅ 發送焦慮訊號並在資料庫中看到記錄
- ✅ 查看附近的訊號列表
- ✅ 回應其他用戶的訊號
- ✅ 在資料庫中看到回應記錄

---

## 🐛 如果遇到問題

### 問題 1: 後端無法啟動
**檢查：**
- `.env` 文件是否正確配置？
- Supabase URL 和 Keys 是否正確？
- 是否有錯誤訊息？複製錯誤訊息給我

### 問題 2: 註冊失敗
**檢查：**
- 後端終端機是否有錯誤訊息？
- Supabase 配置是否正確？
- `users` 表是否已創建？

### 問題 3: 發送訊號失敗
**檢查：**
- 是否已經註冊並登入？
- 後端終端機是否有錯誤訊息？
- `lonely_signals` 表是否已創建？

### 問題 4: 看不到附近訊號
**檢查：**
- 資料庫中是否有 `is_active = true` 的訊號？
- API 請求是否成功？（檢查後端終端機）
- 列表頁面是否有錯誤訊息？

---

## 📞 需要幫助？

如果遇到任何問題，請告訴我：
1. 你執行到哪一步？
2. 看到了什麼錯誤訊息？
3. 後端終端機顯示了什麼？

我會幫你解決！😊

