# 🚀 Supabase 設置指南

## 第一步：創建 Supabase 項目

### 1. 前往 Supabase
- 打開 https://supabase.com
- 點擊 "Start your project"
- 使用 GitHub 登入

### 2. 創建新項目
- 點擊 "New Project"
- 選擇組織（或創建新組織）
- 項目設置：
  - **項目名稱**：`beside-app`
  - **數據庫密碼**：設置一個強密碼（記住這個密碼！）
  - **地區**：選擇離你最近的（推薦 `Northeast Asia (Singapore)`）
- 點擊 "Create new project"

### 3. 等待項目創建
- 項目創建需要 1-2 分鐘
- 等待完成後點擊 "Go to dashboard"

## 第二步：獲取項目配置

### 1. 獲取 API 配置
在項目儀表板中：
- 前往 **Settings** → **API**
- 複製以下信息：
  - **Project URL**（例如：`https://your-project.supabase.co`）
  - **anon public** key（很長的字符串）
  - **service_role** key（很長的字符串，用於服務端操作）

### 2. 配置環境變量
編輯 `.env` 文件，填入你的配置：

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Secret (生成一個隨機字符串)
JWT_SECRET=your_jwt_secret_key_here

# CORS Configuration
CORS_ORIGIN=http://localhost:8081
```

## 第三步：設置數據庫

### 1. 打開 SQL 編輯器
- 在 Supabase 儀表板中
- 前往 **SQL Editor**
- 點擊 "New query"

### 2. 執行數據庫腳本
- 複製 `database/schema.sql` 文件的內容
- 貼到 SQL 編輯器中
- 點擊 "Run" 執行

### 3. 驗證表創建
- 前往 **Table Editor**
- 確認以下表已創建：
  - `users` - 用戶表
  - `lonely_signals` - 焦慮信號表
  - `signal_responses` - 信號回應表
  - `user_locations` - 用戶位置表

## 第四步：測試連接

### 1. 啟動後端服務
```bash
npm run dev
```

### 2. 測試健康檢查
```bash
curl http://localhost:3001/health
```

應該返回：
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "beside-backend"
}
```

### 3. 測試 Supabase 連接
```bash
curl http://localhost:3001/api/v1/auth/me
```

## 第五步：設置認證

### 1. 啟用手機認證
- 前往 **Authentication** → **Settings**
- 在 "Phone" 部分：
  - 啟用 "Enable phone confirmations"
  - 設置 "Phone confirmation template"

### 2. 配置認證設置
- **Site URL**：`http://localhost:8081`
- **Redirect URLs**：`http://localhost:8081/**`

## 第六步：設置實時功能

### 1. 啟用實時功能
- 前往 **Database** → **Replication**
- 啟用以下表的實時功能：
  - `lonely_signals`
  - `signal_responses`
  - `user_locations`

### 2. 設置 RLS 策略
數據庫腳本已經包含了 Row Level Security 策略，但你可以根據需要調整。

## 第七步：測試完整流程

### 1. 註冊用戶
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "測試用戶",
    "gender": "male",
    "birthday": "1995-01-01",
    "phone": "+886912345678"
  }'
```

### 2. 發送焦慮信號
```bash
curl -X POST http://localhost:3001/api/v1/signals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "latitude": 25.0330,
    "longitude": 121.5654
  }'
```

### 3. 獲取附近信號
```bash
curl "http://localhost:3001/api/v1/signals/nearby?latitude=25.0330&longitude=121.5654"
```

## 🔧 故障排除

### 常見問題

1. **連接失敗**
   - 檢查 SUPABASE_URL 是否正確
   - 檢查 API keys 是否正確
   - 檢查網絡連接

2. **認證失敗**
   - 檢查 JWT_SECRET 是否設置
   - 檢查 Supabase 認證設置

3. **數據庫錯誤**
   - 檢查 SQL 腳本是否正確執行
   - 檢查表結構是否正確

4. **CORS 錯誤**
   - 檢查 CORS_ORIGIN 設置
   - 檢查前端 URL 是否正確

### 調試技巧

1. **查看日誌**
   ```bash
   npm run dev
   ```

2. **檢查 Supabase 日誌**
   - 前往 Supabase 儀表板
   - 查看 **Logs** 部分

3. **測試 API**
   - 使用 Postman 或 curl
   - 檢查響應狀態碼

## 📱 下一步

設置完成後，你可以：
1. 修改前端連接後端 API
2. 測試完整的用戶流程
3. 部署到生產環境

## 🆘 需要幫助？

如果遇到問題：
1. 檢查 Supabase 文檔
2. 查看控制台錯誤信息
3. 確認所有環境變量設置正確
