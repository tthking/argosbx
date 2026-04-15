# Argosbx Docker 部署后续优化计划

## 🎯 核心目标
解决 Docker 部署中的“三大顽疾”：内核启动稳定性、WARP 状态不可见、多端字符乱码。

## 📋 待处理问题清单 (TODO)

### 1. 内核运行状态监控 (Priority: High)
- [ ] **症状**：日志显示 `Sing-box/Xray：未启用`，即使节点输出正常。
- [ ] **优化点**：
    - 精准化 `argosbxstatus` 检测逻辑，适配基于 `debian` 的进程自检。
    - 在 Node.js 面板中增加实时状态图标（🟢/🔴）。

### 2. WARP 状态可视化 (Priority: High)
- [ ] **症状**：无法从 Docker 日志中确认 WARP 账户是否注册成功或 IP 是否已切换。
- [ ] **优化点**：
    - 在 `/api/deploy` 执行完毕后，强制执行一次 `warp-cli status` 或脚本内的 `warpsx` 检测并回传给前端。
    - 独立出 WARP 配置日志，方便用户排查。

### 3. 全局语言环境校准 (Priority: Medium)
- [ ] **症状**：Web 管理界面偶尔出现中文显示为 `????`。
- [ ] **优化点**：
    - 在 Node.js 响应头中强制注入 `Content-Type: text/html; charset=utf-8`。
    - 检查前端模板中的 JavaScript 脚本注入是否完全通过 Base64 安全转义。

### 4. 订阅链接高可用优化 (Priority: Medium)
- [ ] **症状**：访问 `/uuid/sub` 时出现加载过久或 404。
- [ ] **优化点**：
    - 建立磁盘缓存机制，不再每次都去实时扫描磁盘文件，提高并发响应。
    - 增加“配置未就绪”的友好提示页面。

## 🛠️ 已实施的改进 (已记录)
- [x] 物理隔离管理端口 (3000) 与订阅出口端口 (12589)。
- [x] 切换 Debian Bullseye 基础镜像，解决 Linux 内核兼容性。
- [x] 配置 Base64 安全回传，防止历史设置导致 502。

---
> [!NOTE]
> 本文件已由 Antigravity 自动同步至 GitHub。
