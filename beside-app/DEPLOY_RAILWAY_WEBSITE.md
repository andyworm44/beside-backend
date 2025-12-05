# Beside 官網 Railway 部署指南

這個指南將教你如何將 Beside 官網 (`beside-app`) 部署到 Railway，讓你的後端和官網都在同一個平台上管理。

## 📋 步驟 1：提交代碼到 GitHub

確保你已經將最新的官網代碼推送到 GitHub。

```bash
cd /Users/andyh/beside
git add .
git commit -m "Add website and prepare for Railway deployment"
git push
```

## 📋 步驟 2：在 Railway 創建新服務

1. 登入 [Railway Dashboard](https://railway.app/dashboard)。
2. 點擊你現有的 `beside-backend` 專案（或者創建一個新專案）。
3. 點擊 **"+ New"** 按鈕。
4. 選擇 **"GitHub Repo"**。
5. 選擇你的 `beside` 倉庫（包含 `beside-app` 的那個）。
6. **重要**：點擊剛創建的服務卡片，進入設置。

## 📋 步驟 3：配置服務設置

在該服務的設置頁面中：

### 3.1 設定根目錄 (Root Directory)
1. 點擊 **"Settings"** 標籤。
2. 找到 **"Root Directory"**。
3. 輸入 `/beside-app` 並保存。
   - 這是告訴 Railway 你的前端代碼在哪個資料夾。

### 3.2 設定構建與啟動命令
Railway 通常會自動檢測，但建議確認一下：
1. **Build Command**: `npm run build`
   - 如果自動檢測失敗，可以手動輸入。
2. **Start Command**: `npm start`

### 3.3 生成網域
1. 點擊 **"Settings"** 標籤。
2. 找到 **"Networking"** 區塊。
3. 點擊 **"Generate Domain"**。
   - Railway 會給你一個類似 `beside-app-production.up.railway.app` 的網址。
   - 你也可以點擊 "Custom Domain" 綁定自己的網域（如果你買了的話）。

### 3.4 設定連接埠 (Port)
1. 點擊 **"Variables"** 標籤。
2. 添加一個新變數：`PORT`，值設為 `3000`。
   - 雖然 Railway 通常會自動處理，但明確設定更保險。

## 📋 步驟 4：等待部署

1. 回到專案視圖，你應該會看到服務正在構建（Building）。
2. 等待幾分鐘，直到變成綠色的 "Active"。
3. 點擊生成的網址，你的官網應該就上線了！

## ✅ 部署後檢查
- 測試首頁是否正常顯示。
- 點擊 "隱私權政策" 和 "使用者條款" 確保連結正確。
- 點擊 "體驗 Demo" 確保 App 模擬器能運作。

---

**常見問題：**
- **Build 失敗？** 檢查 Logs，看是否是 Node.js 版本問題。可以在 Settings 中設定 Node 版本。
- **頁面 404？** 確保 Root Directory 設定正確為 `/beside-app`。

