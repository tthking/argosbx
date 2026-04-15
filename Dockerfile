FROM node:20-bullseye-slim

# 设置工作目录
WORKDIR /app

# 安装系统级依赖
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    bash \
    ca-certificates \
    procps \
    iproute2 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 预安装所需的 Node.js 模块，避免启动时 npm install 导致 502 超时
RUN npm install ws

# 复制项目代码
COPY . .

# 确保数据目录存在
RUN mkdir -p /root/agsbx/

# 环境变量设置
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8

# 授权
RUN chmod +x container/nodejs/start.sh

# 暴露端口
EXPOSE 3000

# 运行应用
CMD ["node", "container/nodejs/index.js"]
