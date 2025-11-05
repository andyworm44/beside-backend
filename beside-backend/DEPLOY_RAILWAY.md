# 🚂 部署到 Railway 完整指南

## 📋 步驟 1：將代碼推送到 GitHub

### 1.1 檢查是否已有 GitHub 倉庫

```bash
cd /Users/andyh/beside/beside-backend
git remote -v
```

### 1.2 如果還沒有 GitHub 倉庫

**選項 A：創建新的 GitHub 倉庫**

1. 前往 https://github.com/new
2. 倉庫名稱：`beside-backend`
3. **不要**勾選 "Initialize this repository with a README"
4. 點擊 "Create repository"

**選項 B：如果已經有 GitHub 倉庫**

直接使用現有的倉庫 URL。

### 1.3 連接並推送代碼

```bash
cd /Users/andyh/beside/beside-backend

# 如果還沒有 remote
git remote add origin https://github.com/你的用戶名/beside-backend.git

# 或者如果已經有 remote，更新它
# git remote set-url origin https://github.com/你的用戶名/beside-backend.git

# 提交所有更改
git add .
git commit -m "準備部署到 Railway"

# 推送到 GitHub
git push -u origin main
```

---

## 📋 步驟 2：在 Railway 創建項目

### 2.1 登入 Railway

1. 前往 https://railway.app
2. 點擊 "Login"
3. 選擇 "Continue with GitHub"
4. 授權 Railway 訪問你的 GitHub 倉庫

### 2.2 創建新項目

1. 點擊 "New Project"
2. 選擇 "Deploy from GitHub repo"
3. 在搜索框中輸入 `beside-backend`
4. 選擇你的 `beside-backend` 倉庫
5. Railway 會自動開始部署

---

## 📋 步驟 3：配置環境變數

### 3.1 打開環境變數設置

1. 在 Railway 項目中，點擊你的服務（Service）
2. 點擊 "Variables" 標籤
3. 點擊 "New Variable"

### 3.2 添加以下環境變數

從你的本地 `.env` 文件複製這些值：

```bash
SUPABASE_URL=你的_supabase_url
SUPABASE_ANON_KEY=你的_anon_key
SUPABASE_SERVICE_ROLE_KEY=你的_service_role_key
JWT_SECRET=你的_jwt_secret
PORT=3001
NODE_ENV=production
CORS_ORIGIN=*
```

**重要**：
- `CORS_ORIGIN` 設置為 `*` 允許所有來源（或設置為你的 app URL）
- 確保 `NODE_ENV=production`
- `PORT` 可以留空，Railway 會自動設置

### 3.3 添加構建配置（如果需要）

Railway 通常會自動檢測 Node.js 項目，但你可以手腳設置：

1. 點擊 "Settings" 標籤
2. 確認 "Build Command" 是：`npm install && npm run build`
3. 確認 "Start Command" 是：`npm start`

---

## 📋 步驟 4：獲取部署 URL

### 4.1 查看部署狀態

1. 等待部署完成（通常 2-5 分鐘）
2. 在 Railway 項目中，點擊 "Settings"
3. 找到 "Domains" 或 "Networking" 部分

### 4.2 獲取 URL

Railway 會自動生成一個 URL，例如：
```
https://beside-backend-production.up.railway.app
```

**API 端點**：
```
https://beside-backend-production.up.railway.app/api/v1
```

---

## 📋 步驟 5：測試部署

### 5.1 測試健康檢查

在瀏覽器中打開：
```
https://你的-railway-url.up.railway.app/health
```

應該返回：
```json
{
  "status": "OK",
  "timestamp": "...",
  "service": "beside-backend"
}
```

### 5.2 測試 API

```bash
curl https://你的-railway-url.up.railway.app/api/v1/health
```

---

## 📋 步驟 6：更新手機 App 配置

### 6.1 更新 `eas.json`

編輯 `/Users/andyh/beside/beside-mobile/eas.json`：

找到 `preview-testflight` profile，更新 `API_URL`：

```json
"preview-testflight": {
  "distribution": "store",
  "ios": {
    "simulator": false,
    "buildConfiguration": "Release"
  },
  "env": {
    "API_URL": "https://你的-railway-url.up.railway.app/api/v1"
  }
}
```

### 6.2 重新構建

```bash
cd /Users/andyh/beside/beside-mobile
eas build --platform ios --profile preview-testflight
```

---

## ✅ 完成！

部署完成後：
1. ✅ Railway 會自動部署每次 GitHub push
2. ✅ 你的後端現在在雲端運行
3. ✅ TestFlight 的 app 可以訪問了

---

## 🔧 故障排除

### 問題 1：部署失敗

**檢查**：
- 環境變數是否正確設置
- `package.json` 中是否有 `start` 腳本
- 查看 Railway 的 "Deploy Logs"

### 問題 2：API 返回 404

**檢查**：
- URL 是否正確（包含 `/api/v1`）
- 健康檢查端點：`/health`（不需要 `/api/v1`）

### 問題 3：CORS 錯誤

**檢查**：
- `CORS_ORIGIN` 環境變數是否設置
- 嘗試設置為 `*`（僅用於測試）

---

**需要幫助？** 告訴我你的 Railway URL，我幫你更新配置！

