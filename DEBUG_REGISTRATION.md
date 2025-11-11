# 除錯註冊問題

## 🔍 檢查步驟

### 1. 確認後端正在運行

在終端機執行：
```bash
curl http://localhost:3001/health
```

應該返回 `{"status":"OK",...}`

### 2. 檢查 App 是否能連接到後端

**如果是模擬器：**
- `localhost:3001` 應該可以正常工作

**如果是實體設備：**
- 需要改用電腦的 IP 地址
- 找到電腦 IP：
  ```bash
  # macOS/Linux
  ifconfig | grep "inet " | grep -v 127.0.0.1
  
  # Windows
  ipconfig
  ```
- 修改 `beside-mobile/src/services/api.ts`：
  ```typescript
  const API_BASE_URL = 'http://<你的IP>:3001/api/v1';
  ```

### 3. 查看 App 的控制台日誌

在 App 中註冊時，查看：
- React Native Debugger
- 或 Expo Dev Tools 的 Console

應該會看到：
- `🔄 Starting registration with data: ...`
- `📡 API Request: ...`
- `📥 API Response: ...` 或 `❌ API Error: ...`

### 4. 查看後端日誌

在後端終端機中應該看到：
- `📝 Register request received: ...`
- `✅ Auth user created: ...`
- `✅ User record created: ...`

### 5. 測試註冊

在 App 中重新註冊，然後告訴我：
1. App 控制台顯示了什麼？
2. 後端終端機顯示了什麼？
3. 是否有錯誤訊息？






