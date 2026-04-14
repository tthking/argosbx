FROM node:alpine

# 安装项目运行所需的系统工具
RUN apk add --no-cache \
    bash \
    curl \
    wget \
    coreutils \
    sed \
    gawk \
    procps \
    iproute2 \
    ca-certificates \
    tzdata

# 设置工作目录
WORKDIR /app/container/nodejs

# 复制依赖定义并安装
COPY container/nodejs/package.json ./
RUN npm install

# 复制 Node 控制面板源码及启动脚本
COPY container/nodejs/index.js container/nodejs/start.sh ./

# 复制根目录的生成器页面供本地回退使用 (对应 index.js 中的 ../../index.html 路径)
COPY index.html ../../

# 赋予执行权限
RUN chmod +x start.sh

# 声明容器端口（与 index.js 中的 PORT 变量一致，默认为 3000）
EXPOSE 3000

# 启动 Node 服务
CMD ["node", "index.js"]
