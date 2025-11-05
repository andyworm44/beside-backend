# 使用 Node.js 20 作為基礎映像
FROM node:20-alpine

# 設置工作目錄
WORKDIR /app

# 複製 package 文件
COPY package*.json ./

# 安裝依賴
RUN npm ci --only=production

# 複製源代碼
COPY . .

# 構建 TypeScript
RUN npm run build

# 暴露端口（Railway 會自動設置）
EXPOSE 3001

# 啟動應用
CMD ["npm", "start"]

