# 修復 Session 問題

## 🔍 問題分析

從後端日誌看到：
- `⚠️ No session from signup` - 註冊時沒有 session
- `⚠️ No session from signup, attempting to sign in...` - 嘗試自動登入
- 但**沒有看到** `✅ Session obtained from sign in` - 自動登入失敗

## ✅ 解決方案

### 方案 1：關閉 Supabase Email 確認（推薦）

1. 前往 Supabase Dashboard
2. 選擇你的項目
3. 進入 **Authentication** → **Settings**
4. 找到 **"Enable email confirmations"**
5. **關閉它**（切換為 Off）
6. 點擊 **Save**

這樣註冊後會立即返回 session，不需要 email 確認。

### 方案 2：使用 Supabase Admin API 生成 Session Token

如果方案 1 不行，可以嘗試使用 service role key 生成 session（僅開發環境）。

---

## 🧪 測試步驟

關閉 email 確認後：

1. **重新註冊一個新帳號**
2. **查看後端日誌**，應該會看到：
   ```
   ✅ Auth user created: ...
   📋 Final session status: ✅ Present (eyJhbGciOiJIUzI1NiIs...)
   ```
3. **查看 App 終端機**，應該會看到：
   ```
   ✅ Auth token set: eyJhbGciOiJIUzI1NiIs...
   ```
4. **測試發送訊號**，應該會成功

---

## 📝 請告訴我：

1. **Supabase Dashboard 中，email 確認是開啟還是關閉的？**
2. **關閉 email 確認後，重新註冊，後端日誌顯示了什麼？**






