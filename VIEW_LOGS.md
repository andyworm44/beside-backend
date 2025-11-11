# 如何查看 App 控制台日誌

## 🖥️ 方法 1：終端機輸出（最簡單）

當你運行 `npm start` 時，所有 `console.log` 都會顯示在終端機中。

### 檢查步驟：

1. **找到運行 App 的終端機視窗**
   ```bash
   cd /Users/andyh/beside/beside-mobile
   npm start
   ```

2. **在那個終端機中查看日誌**
   - 所有 `console.log()` 的輸出都會顯示在這裡
   - 包括：`🔄`、`📡`、`📥`、`✅`、`❌` 等圖標

3. **測試註冊時，應該會看到：**
   ```
   🔄 Starting registration with data: { name: '...', gender: '...', birthday: '...' }
   📡 API Request: { method: 'POST', url: '...', body: {...} }
   📥 API Response: { url: '...', status: 201, data: {...} }
   ✅ Registration successful, setting user: {...}
   ```

---

## 🌐 方法 2：Expo Dev Tools（瀏覽器）

1. 啟動 App：`npm start`
2. 在終端機按 `m` 打開開發菜單
3. 或直接在瀏覽器打開：http://localhost:19000
4. 點擊 **Logs** 標籤頁
5. 查看所有日誌輸出

---

## 📱 方法 3：開發者菜單（手機上）

### iOS 模擬器：
1. 在模擬器中按 `Cmd + D`
2. 選擇 "Debug Remote JS"
3. 會打開 Chrome DevTools

### Android 模擬器：
1. 在模擬器中按 `Cmd + M`（Mac）或 `Ctrl + M`（Windows）
2. 選擇 "Debug"
3. 會打開 Chrome DevTools

### 實體設備：
1. 搖晃手機
2. 選擇 "Debug Remote JS"
3. 會打開 Chrome DevTools（需要手機和電腦在同一個網路）

---

## 🔍 現在請做：

1. **確認 App 正在運行**
   - 應該有一個終端機視窗運行著 `npm start`

2. **在那個終端機視窗中，重新註冊一個帳號**

3. **查看終端機輸出，告訴我看到什麼：**
   - 有看到 `🔄 Starting registration` 嗎？
   - 有看到 `📡 API Request` 嗎？
   - 有看到 `❌ API Error` 嗎？
   - 有任何錯誤訊息嗎？

4. **同時查看後端終端機**
   - 在運行 `npm run dev` 的終端機中
   - 應該會看到 `📝 Register request received`

---

## 💡 提示

如果終端機中看不到任何日誌，可能是：
- App 沒有真正運行
- 日誌被過濾了
- 有錯誤但沒有顯示

告訴我你在終端機中看到了什麼，我會幫你解決！






