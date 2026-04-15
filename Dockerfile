FROM node:20-bullseye-slim

# 设置工作目录
WORKDIR /app

# 安装核心依赖
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    bash \
    ca-certificates \
    procps \
    iproute2 \
    locales \
    && sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen \
    && locale-gen \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 设置环境变量支持 UTF-8
ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US:en
ENV LC_ALL=en_US.UTF-8

# 复制项目代码
COPY . .

# 授权脚本执行
RUN chmod +x container/nodejs/start.sh

# 暴露管理面板端口
EXPOSE 3000

# 运行应用
CMD ["node", "container/nodejs/index.js"]
