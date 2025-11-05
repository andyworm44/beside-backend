# 使用 Node.js 20 作為基礎映像
FROM node:20-alpine

# 設置工作目錄
WORKDIR /app

# 複製 package 文件（從 beside-backend 目錄）
COPY beside-backend/package*.json ./

# 安裝所有依賴（包括 devDependencies，因為需要 TypeScript 來構建）
RUN npm install

# 複製源代碼（從 beside-backend 目錄）
COPY beside-backend/ ./

# 構建 TypeScript
RUN npm run build

# 暴露端口（Railway 會自動設置）
EXPOSE 3001

# 設置環境變數
ENV NODE_ENV=production

# 啟動應用
CMD ["npm", "start"]

