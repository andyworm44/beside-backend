# 🚀 快速部署到 Railway

## 第一步：創建 GitHub 倉庫

### 1. 前往 GitHub
- 打開 https://github.com/new
- 倉庫名稱：`beside-backend`
- **不要**勾選 "Initialize this repository with a README"
- 點擊 "Create repository"

### 2. 複製倉庫 URL
GitHub 會顯示類似這樣的 URL：
```
https://github.com/你的用戶名/beside-backend.git
```

---

## 第二步：推送代碼到 GitHub

在終端執行：

```bash
cd /Users/andyh/beside/beside-backend

# 添加 GitHub remote
git remote add origin https://github.com/你的用戶名/beside-backend.git

# 提交所有更改
git add .
git commit -m "準備部署到 Railway"

# 推送到 GitHub
git push -u origin main
```

**如果遇到問題**：
- 如果分支名不是 `main`，可能是 `master`，改成：
  ```bash
  git push -u origin master
  ```

---

## 第三步：連接 Railway

### 1. 登入 Railway
- 前往 https://railway.app
- 點擊 "Login"
- 選擇 "Continue with GitHub"
- 授權 Railway 訪問你的 GitHub

### 2. 創建新項目
- 點擊 "New Project"
- 選擇 "Deploy from GitHub repo"
- 搜索 `beside-backend`
- 選擇你的倉庫
- Railway 會自動開始部署

---

## 第四步：配置環境變數

### 1. 打開環境變數設置
- 在 Railway 項目中，點擊你的服務
- 點擊 "Variables" 標籤
- 點擊 "Raw Editor"（更簡單）

### 2. 添加環境變數

從你的本地 `.env` 文件複製這些值，貼到 Railway 的環境變數：

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
- 每個變數一行，格式：`KEY=value`
- `CORS_ORIGIN=*` 允許所有來源
- 確保 `NODE_ENV=production`

### 3. 保存並等待重新部署

Railway 會自動重新部署。

---

## 第五步：獲取 URL

### 1. 查看部署狀態
- 等待部署完成（通常 2-5 分鐘）
- 在 Railway 項目中，點擊 "Settings"
- 找到 "Networking" 部分

### 2. 複製 URL

Railway 會顯示類似這樣的 URL：
```
https://beside-backend-production.up.railway.app
```

**API 端點**：
```
https://beside-backend-production.up.railway.app/api/v1
```

---

## 第六步：測試

在瀏覽器打開：
```
https://你的-railway-url.up.railway.app/health
```

應該看到：
```json
{
  "status": "OK",
  ...
}
```

---

## 第七步：告訴我 URL

部署完成後，把 Railway URL 告訴我，我會幫你更新手機 App 的配置！

---

## ❓ 需要幫助？

如果遇到問題，告訴我：
1. 哪一步出錯了？
2. 錯誤訊息是什麼？



