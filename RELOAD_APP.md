# 重新載入 App 以使用新代碼

## 🔄 方法 1：在 Expo 終端機中重新載入

在運行 `npm start` 的終端機中：

1. **按 `r` 鍵** - 重新載入 App
2. 或按 `R` 鍵（大寫）- 重新載入並清除緩存

## 🔄 方法 2：在 App 中重新載入

### iOS 模擬器：
- 按 `Cmd + R` 重新載入
- 或在終端機按 `r`

### Android 模擬器：
- 按 `Cmd + M` 然後選擇 "Reload"
- 或在終端機按 `r`

### 實體設備：
- 搖晃手機打開開發者菜單
- 選擇 "Reload"

## 🔄 方法 3：完全重啟

1. 在終端機按 `Ctrl + C` 停止 App
2. 重新啟動：
   ```bash
   cd /Users/andyh/beside/beside-mobile
   npm start
   ```

---

## ✅ 重新載入後，應該會看到：

當你重新註冊時，終端機應該會顯示：

```
🔄 Starting registration with data: { name: '...', gender: '...', birthday: '...' }
📡 API Request: { method: 'POST', url: 'http://localhost:3001/api/v1/auth/register', body: {...} }
📥 API Response: { url: '...', status: 201, data: {...} }
✅ Registration successful, setting user: {...}
```

**如果沒有看到這些訊息**，表示還是舊的代碼在運行。

---

## 🎯 請執行：

1. **重新載入 App**（在終端機按 `r`）
2. **重新註冊一個新帳號**
3. **告訴我終端機中顯示了什麼**：
   - 有看到 `🔄`、`📡`、`📥` 嗎？
   - 還是只看到舊的 "用戶註冊成功"？






