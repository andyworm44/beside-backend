# 🔧 Railway 手動設置指南

如果自動部署仍然失敗，請在 Railway 中手動設置：

## 步驟 1：設置構建器

1. 在 Railway 項目中，點擊你的服務（beside-backend）
2. 點擊 "Settings" 標籤
3. 找到 "Build" 部分
4. 選擇 "Dockerfile" 作為構建器
   - 或者選擇 "Nixpacks" 並確保它檢測到 Node.js

## 步驟 2：手動設置構建命令（如果使用 Nixpacks）

如果選擇 Nixpacks：

1. 在 "Settings" → "Build"
2. **Build Command**：
   ```
   npm install && npm run build
   ```
3. **Start Command**：
   ```
   npm start
   ```

## 步驟 3：檢查環境變數

確保設置了以下環境變數：

```
SUPABASE_URL=你的_supabase_url
SUPABASE_ANON_KEY=你的_anon_key
SUPABASE_SERVICE_ROLE_KEY=你的_service_role_key
JWT_SECRET=你的_jwt_secret
NODE_ENV=production
CORS_ORIGIN=*
```

**注意**：不要設置 `PORT`，Railway 會自動分配。

## 步驟 4：重新部署

設置完成後，點擊 "Redeploy" 按鈕。

---

## 🔍 如果還是失敗

查看 "Build Logs" 標籤，找出具體錯誤訊息，然後告訴我。



