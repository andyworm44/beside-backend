# 修復註冊問題

## 🔍 問題分析

錯誤訊息：`"Unable to validate email address: invalid format"`

原因是 Supabase 不接受 `name@beside.app` 這種格式的 email。

## ✅ 解決方案

有兩種方式可以解決：

### 方案 1：修改 email 格式（推薦用於測試）

讓 email 格式更標準，例如：`testuser123@example.com`

### 方案 2：關閉 Supabase Email 驗證（僅開發環境）

在 Supabase Dashboard：
1. 進入 **Authentication** → **Settings**
2. 關閉 **"Enable email confirmations"**（開發環境可以關閉）
3. 或調整 **"Email templates"** 設置

## 📝 需要修改的代碼

我會修改註冊邏輯，使用更標準的 email 格式，或者生成隨機 email。

