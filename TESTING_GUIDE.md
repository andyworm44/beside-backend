# 測試指南 - 註冊、發送訊號、接收訊號

## 📋 前置準備

### 1. 設置 Supabase

1. 前往 [Supabase](https://supabase.com) 創建項目（如果還沒有）
2. 獲取以下資訊：
   - Project URL
   - Anon Key
   - Service Role Key

### 2. 配置後端環境變數

```bash
cd beside-backend
cp env.example .env
```

編輯 `.env` 文件，填入 Supabase 配置：

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

PORT=3001
NODE_ENV=development

CORS_ORIGIN=http://localhost:8081
```

### 3. 設置資料庫

1. 在 Supabase Dashboard 中，打開 SQL Editor
2. 執行 `database/schema.sql` 文件中的所有 SQL 語句
3. 確認所有表都已創建成功

### 4. 啟動後端服務

```bash
cd beside-backend
npm install
npm run dev
```

後端應該在 `http://localhost:3001` 運行。

### 5. 檢查後端健康狀態

```bash
curl http://localhost:3001/health
```

應該返回：
```json
{
  "status": "OK",
  "timestamp": "...",
  "service": "beside-backend"
}
```

## 🧪 測試步驟

### 步驟 1: 測試註冊

1. 在 Mobile App 中，進入註冊頁面
2. 填入以下資訊：
   - 姓名：測試用戶1
   - 性別：選擇性別
   - 生日：選擇日期
   - 電話：（可選）
3. 點擊註冊

**預期結果：**
- 註冊成功
- 自動登入
- 跳轉到首頁

**檢查資料庫：**
- 在 Supabase Dashboard → Table Editor → `users` 表
- 應該看到新創建的用戶記錄

### 步驟 2: 測試發送訊號

1. 在首頁點擊或長按愛心
2. 等待信號發送成功

**預期結果：**
- 顯示「你的信號已發出」
- 在控制台看到成功日誌

**檢查資料庫：**
- 在 Supabase Dashboard → Table Editor → `lonely_signals` 表
- 應該看到新創建的信號記錄，`is_active` 為 `true`

### 步驟 3: 測試查看附近訊號

1. 進入「列表」頁面
2. 應該看到附近的其他訊號

**預期結果：**
- 顯示附近的其他用戶發送的訊號
- 每個訊號顯示用戶資訊和距離

### 步驟 4: 測試回應訊號

1. 在列表頁面選擇一個訊號
2. 點擊「我陪你」或回應按鈕

**預期結果：**
- 回應成功
- 該訊號從列表中消失（因為已有人回應）

**檢查資料庫：**
- 在 Supabase Dashboard → Table Editor → `signal_responses` 表
- 應該看到新創建的回應記錄
- 在 `lonely_signals` 表中，對應訊號的 `is_active` 應該變成 `false`

### 步驟 5: 測試查看收到的回應

1. 用另一個帳號註冊（或使用測試帳號）
2. 發送一個訊號
3. 用第一個帳號回應這個訊號
4. 在第二個帳號中查看「收到回應」頁面

**預期結果：**
- 顯示收到的回應列表
- 每個回應顯示回應者資訊和訊息

## 🔍 除錯檢查清單

如果測試失敗，請檢查：

### 後端問題

1. **後端是否運行？**
   ```bash
   curl http://localhost:3001/health
   ```

2. **環境變數是否正確？**
   - 檢查 `beside-backend/.env` 文件
   - 確認 Supabase URL 和 Keys 都正確

3. **資料庫連接是否正常？**
   - 檢查後端控制台是否有 Supabase 連接錯誤
   - 在 Supabase Dashboard 檢查項目狀態

4. **資料庫表是否存在？**
   - 確認已執行 `schema.sql`
   - 在 Supabase Dashboard 檢查表是否存在

### 前端問題

1. **API 連接是否正常？**
   - 檢查 `beside-mobile/src/services/api.ts` 中的 `API_BASE_URL`
   - 確認是 `http://localhost:3001/api/v1`（模擬器）或你的電腦 IP（實體設備）

2. **認證 Token 是否正確傳遞？**
   - 檢查 Network 請求中是否包含 `Authorization: Bearer <token>` header

3. **CORS 設置是否正確？**
   - 確認後端 `.env` 中的 `CORS_ORIGIN` 與你的前端地址匹配

## 📱 在實體設備上測試

如果使用實體設備（不是模擬器），需要：

1. 找到你電腦的 IP 地址：
   ```bash
   # macOS/Linux
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```

2. 更新 Mobile App 的 API URL：
   - 編輯 `beside-mobile/src/services/api.ts`
   - 將 `http://localhost:3001` 改為 `http://<你的IP>:3001`

3. 更新後端 CORS 設置：
   - 編輯 `beside-backend/.env`
   - 將 `CORS_ORIGIN` 設為你的設備可以訪問的地址

## 🐛 常見問題

### 問題 1: 註冊失敗 - "Invalid token"
**解決方案：** 確認 Supabase Service Role Key 正確設置

### 問題 2: 發送訊號失敗 - "User not found"
**解決方案：** 
- 確認用戶已成功註冊
- 檢查 `users` 表中是否有該用戶記錄
- 確認 RLS (Row Level Security) 策略正確設置

### 問題 3: 無法看到附近訊號
**解決方案：**
- 確認資料庫中有 `is_active = true` 的訊號
- 檢查 RLS 策略是否允許查看訊號
- 確認 API 請求格式正確

### 問題 4: 回應訊號後訊號仍在列表中
**解決方案：**
- 檢查 `signal_responses` 表是否有新記錄
- 確認 `lonely_signals` 表中的 `is_active` 是否更新為 `false`
- 檢查前端是否正確刷新列表

## ✅ 測試完成檢查

當所有測試通過時，你應該能夠：

- ✅ 註冊新用戶並自動登入
- ✅ 發送焦慮訊號並在資料庫中看到記錄
- ✅ 查看附近的訊號列表
- ✅ 回應其他用戶的訊號
- ✅ 查看收到的回應
- ✅ 取消自己的訊號

如果所有項目都通過，恭喜！你的後端整合已經完成。🎉

