# 構建測試版本指南

## 📋 前置準備

### 1. 安裝 EAS CLI

```bash
npm install -g eas-cli
```

### 2. 登入 Expo 帳號

```bash
eas login
```

### 3. 配置項目

```bash
cd beside-mobile
eas build:configure
```

這會創建 `eas.json` 配置文件（如果還沒有）。

---

## 🔧 配置環境變數

### 1. 設置測試服務器地址

編輯 `beside-mobile/app.config.js`，修改 `extra.apiUrl`：

```javascript
extra: {
  apiUrl: process.env.API_URL || "https://your-test-server.com/api/v1",
  // ...
}
```

或者創建 `.env` 文件（需要安裝 `dotenv`）：

```bash
cp .env.example .env
```

然後編輯 `.env`：
```
API_URL=https://your-test-server.com/api/v1
```

### 2. 確保後端服務器運行

測試版本需要連接到實際的後端服務器，而不是 `localhost`。

**選項 A：使用本地網絡 IP**
- 找到你的電腦在局域網中的 IP 地址（例如：`192.168.1.100`）
- 在 `app.config.js` 中設置：`apiUrl: "http://192.168.1.100:3001/api/v1"`
- 確保手機和電腦在同一個 Wi-Fi 網絡

**選項 B：部署到測試服務器**
- 將後端部署到雲服務器（如 Heroku、Railway、Vercel）
- 在 `app.config.js` 中設置測試服務器的 URL

---

## 📱 構建 Android 測試版本

### 方法 1：使用 EAS Build（推薦）

```bash
cd beside-mobile
eas build --platform android --profile preview
```

這會：
1. 上傳你的代碼到 Expo 的構建服務器
2. 構建 APK 文件
3. 提供下載鏈接

### 方法 2：本地構建（需要 Android Studio）

```bash
cd beside-mobile
npx expo prebuild
npx expo run:android
```

這會在 `android/app/build/outputs/apk/` 目錄生成 APK 文件。

---

## 🍎 構建 iOS 測試版本

### 使用 EAS Build

```bash
cd beside-mobile
eas build --platform ios --profile preview
```

**注意**：iOS 構建需要：
- Apple Developer 帳號（$99/年）
- 在 `eas.json` 中配置證書和配置描述文件

### 本地構建（需要 Xcode）

```bash
cd beside-mobile
npx expo prebuild
npx expo run:ios
```

---

## 🚀 快速構建命令

已在 `package.json` 中添加了快捷命令：

```bash
# 構建 Android 測試版本
npm run build:android

# 構建 iOS 測試版本
npm run build:ios

# 構建所有平台
npm run build:all
```

---

## 📦 分發測試版本

### Android APK

1. 構建完成後，EAS 會提供下載鏈接
2. 將 APK 文件分享給測試人員
3. 測試人員需要允許「未知來源」安裝（在 Android 設置中）

### iOS

1. 構建完成後，使用 TestFlight 分發
2. 或使用 Ad Hoc 分發（需要註冊設備 UDID）

---

## 🔍 測試檢查清單

構建完成後，請測試以下功能：

- [ ] 註冊新用戶
- [ ] 登入
- [ ] 發送焦慮信號
- [ ] 查看附近的信號
- [ ] 回應信號
- [ ] 查看收到的回應
- [ ] 查看統計數據
- [ ] 所有 API 請求都能正常連接到後端

---

## ⚠️ 常見問題

### 1. API 連接失敗

**問題**：App 無法連接到後端

**解決方案**：
- 檢查 `app.config.js` 中的 `API_URL` 是否正確
- 確保後端服務器正在運行
- 檢查防火牆設置
- 確保手機和服務器在同一個網絡（如果使用局域網 IP）

### 2. 構建失敗

**問題**：EAS Build 失敗

**解決方案**：
- 檢查 `eas.json` 配置是否正確
- 查看構建日誌中的錯誤訊息
- 確保所有依賴都已正確安裝

### 3. 安裝失敗（Android）

**問題**：無法安裝 APK

**解決方案**：
- 在 Android 設置中允許「未知來源」安裝
- 檢查 APK 是否為簽名版本（EAS Build 會自動簽名）

---

## 📝 下一步

構建完成後，你可以：

1. **分發給測試人員**：分享 APK 或 TestFlight 鏈接
2. **收集反饋**：記錄用戶反饋和 bug
3. **修復問題**：根據反饋修復 bug
4. **準備生產版本**：當測試穩定後，構建生產版本

---

## 🎯 測試服務器部署（可選）

如果你需要部署後端到測試服務器：

### 使用 Railway

1. 前往 [Railway](https://railway.app)
2. 創建新項目
3. 連接 GitHub 倉庫
4. 設置環境變數（參考 `beside-backend/env.example`）
5. 部署

### 使用 Heroku

1. 安裝 Heroku CLI
2. 登入：`heroku login`
3. 創建應用：`heroku create beside-test-backend`
4. 設置環境變數
5. 部署：`git push heroku main`

---

**祝構建順利！** 🚀




