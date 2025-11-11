# 🔧 修復 Railway 根目錄問題

## 問題
Railway 正在分析整個 monorepo，而不是只構建 `beside-backend` 目錄。

## 解決方案

### 在 Railway 中設置根目錄

1. **進入服務設置**
   - 點擊 "beside-backend" 服務
   - 點擊 "Settings" 標籤

2. **找到 "Root Directory" 或 "Source" 設置**
   - 在 Settings 中找到 "Root Directory" 或 "Source"
   - 設置為：`beside-backend`

3. **或者設置構建命令**
   - 在 "Build Command" 中設置：
     ```
     cd beside-backend && npm install && npm run build
     ```
   - 在 "Start Command" 中設置：
     ```
     cd beside-backend && npm start
     ```

4. **重新部署**
   - 設置完成後，點擊 "Redeploy"

---

## 或者：創建單獨的倉庫（更推薦）

如果 Railway 設置複雜，可以將 `beside-backend` 作為單獨的 GitHub 倉庫：

1. 在 GitHub 創建新倉庫 `beside-backend`
2. 只推送 `beside-backend` 目錄的內容
3. 在 Railway 連接這個新倉庫

這樣就不會有根目錄問題了。

---

告訴我你選擇哪個方案！



