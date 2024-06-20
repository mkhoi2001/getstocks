# Sử dụng node.js image có sẵn
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json và package-lock.json vào thư mục làm việc
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy tất cả các file trong thư mục hiện tại vào thư mục làm việc
COPY . .

# Command để chạy ứng dụng
CMD ["npm", "run", "dev"]