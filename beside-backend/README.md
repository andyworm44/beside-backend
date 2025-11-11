# Beside Backend

焦慮陪伴 App 的後端服務，使用 Node.js + Express + Supabase + WebSocket 實現。

## 🚀 技術棧

- **Node.js** + **TypeScript**
- **Express.js** - Web 框架
- **Supabase** - 數據庫和認證
- **Socket.IO** - 實時通信
- **PostgreSQL** - 數據庫

## 📁 項目結構

```
src/
├── app.ts                 # 主應用入口
├── controllers/          # 控制器
│   ├── authController.ts
│   ├── signalController.ts
│   └── userController.ts
├── routes/               # 路由
│   ├── index.ts
│   ├── auth.ts
│   ├── signals.ts
│   └── users.ts
├── utils/                # 工具
│   ├── supabase.ts
│   └── socket.ts
└── types/                # 類型定義
    └── index.ts
```

## 🛠️ 安裝和運行

### 1. 安裝依賴
```bash
npm install
```

### 2. 環境配置
複製 `env.example` 為 `.env` 並填入配置：

```bash
cp env.example .env
```

### 3. Supabase 設置
1. 前往 [Supabase](https://supabase.com) 創建項目
2. 獲取 URL 和 API Key
3. 在 `.env` 中填入 Supabase 配置

### 4. 數據庫設置
在 Supabase SQL 編輯器中執行以下 SQL：

```sql
-- 用戶表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  birthday DATE NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 焦慮信號表
CREATE TABLE lonely_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user_name VARCHAR(100) NOT NULL,
  user_gender VARCHAR(10) NOT NULL,
  user_age VARCHAR(20) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 信號回應表
CREATE TABLE signal_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id UUID REFERENCES lonely_signals(id) ON DELETE CASCADE,
  responder_id UUID REFERENCES users(id) ON DELETE CASCADE,
  responder_name VARCHAR(100) NOT NULL,
  responder_gender VARCHAR(10) NOT NULL,
  responder_age VARCHAR(20) NOT NULL,
  message TEXT DEFAULT '我陪你',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用戶位置表
CREATE TABLE user_locations (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  accuracy DECIMAL(8, 2),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_lonely_signals_active ON lonely_signals(is_active);
CREATE INDEX idx_lonely_signals_location ON lonely_signals(latitude, longitude);
CREATE INDEX idx_signal_responses_signal_id ON signal_responses(signal_id);
CREATE INDEX idx_user_locations_user_id ON user_locations(user_id);
```

### 5. 運行開發服務器
```bash
npm run dev
```

### 6. 構建生產版本
```bash
npm run build
npm start
```

## 📡 API 端點

### 認證 (Auth)
- `POST /api/v1/auth/register` - 註冊
- `POST /api/v1/auth/login` - 登入
- `POST /api/v1/auth/logout` - 登出
- `GET /api/v1/auth/me` - 獲取用戶資料
- `PUT /api/v1/auth/profile` - 更新用戶資料

### 焦慮信號 (Signals)
- `GET /api/v1/signals/nearby` - 獲取附近信號
- `POST /api/v1/signals` - 發送信號
- `DELETE /api/v1/signals/:id` - 取消信號
- `POST /api/v1/signals/:id/respond` - 回應信號
- `GET /api/v1/signals/my` - 獲取我的信號
- `GET /api/v1/signals/responses` - 獲取收到的回應

### 用戶 (Users)
- `GET /api/v1/users/profile` - 獲取用戶資料
- `PUT /api/v1/users/profile` - 更新用戶資料
- `PUT /api/v1/users/location` - 更新位置
- `GET /api/v1/users/nearby` - 獲取附近用戶

## 🔌 WebSocket 事件

### 客戶端發送
- `user:join` - 用戶加入
- `location:update` - 更新位置
- `signal:send` - 發送信號
- `signal:respond` - 回應信號

### 服務器發送
- `user:online` - 用戶上線
- `user:offline` - 用戶下線
- `location:updated` - 位置更新
- `signal:new` - 新信號
- `signal:responded` - 信號被回應
- `signal:removed` - 信號被移除

## 🚀 部署

### 使用 Railway
1. 連接 GitHub 倉庫
2. 設置環境變量
3. 自動部署

### 使用 Heroku
1. 創建 Heroku 應用
2. 設置環境變量
3. 部署

### 使用 Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

## 🔧 開發工具

- **Postman** - API 測試
- **Supabase Dashboard** - 數據庫管理
- **Socket.IO Client** - WebSocket 測試

## 📝 注意事項

1. 確保 Supabase 項目設置正確
2. 環境變量必須正確配置
3. 數據庫表結構必須與代碼一致
4. WebSocket 連接需要正確的 CORS 設置

## 🤝 貢獻

1. Fork 項目
2. 創建功能分支
3. 提交更改
4. 推送到分支
5. 創建 Pull Request
