# Antigravity × CodeMap 全局整合部署指南 (跨平台版)

本指南针对如何在任意新的计算单元（涵盖 Windows, macOS, Linux）上，将原生 AST 分析引擎 CodeMap 无缝嵌入 Antigravity，以打破传统文件遍历机制，实现自动化的全景工程解析。

## 📍 1. 引擎二进制部署（Engine Deployment）

第一步是为新电脑环境准备好原生的底层扫描可执行文件 `codegraph`。

### 部署路径规范
无论是什么操作系统，均强烈规范将其挂载到用户主目录下的特定全局隐藏文件夹中。这能将引擎执行与单项目周期解绑：
- **macOS / Linux**: `~/.codemap/bin/codegraph`的无后缀格式。
- **Windows**: `C:\Users\<登录用户名>\.codemap\bin\codegraph.exe`

### 获取与初始化方式
如需从零部署，可通过以下途径：
1. **源码直接编译 (推荐开发环境使用)**：
   需预置 Rust 环境（Cargo）：
   ```bash
   git clone https://github.com/tthking/CodeMap
   cd CodeMap/rust-cli
   cargo build --release
   
   # [macOS / Linux 分发]
   mkdir -p ~/.codemap/bin
   cp target/release/codegraph ~/.codemap/bin/
   chmod +x ~/.codemap/bin/codegraph
   ```
2. **直接免编译安装**：可在此套件的 GitHub Release 中对应提取如 `aarch64-macos`、`x86_64-linux` 文件至规范目录，完成配置。

---

## 📍 2. Antigravity 记忆晶体注入（Skill Binding）

底层引擎就位后，下一步是强行重写 Antigravity 的系统识别行为树。
要在目标电脑上的 Antigravity 持久记忆规则目录（即：`~/.gemini/` 或 `%USERPROFILE%\.gemini\` 内）部署核心指示。您可以创建或覆写 `GEMINI.md` 或 `SKILL_CODEMAP.md`。

将以下高优先级的 Markdown 代码块原文，**一字不落地粘贴至设置文件中**：

```markdown
# CodeMap 技能强约束调用规则 (Native AST Engine)

- **适用场景**：进入一个陌生代码库、调试极度跨文件复杂逻辑异常或构思架构拓展时，作为系统第一优先级别被激活。
- **核心操作流**：
  1. **禁止盲目的 ls/list 猜代码**：立刻调用原生本机终端（`run_command`），基于 Cwd 进行 AST 无损盲扫。
     - 若底层系统判断为 macOS/Linux 平台，执行：`~/.codemap/bin/codegraph scan .`
     - 若底层系统判断为 Windows 平台，执行：`& $env:USERPROFILE\.codemap\bin\codegraph.exe scan .`
  2. **提炼极简层级模型**：等待命令完结，且确保被扫描仓库内部出现 `.codemap` 后，读取切面统计文件 `.codemap/slices/_overview.json` 获取精确的方法集与模块数量。
  3. **追查依赖链（高级 query）**：当用户下达探查函数的指令，绝不能再用正则搜索模式；直接使用引擎深追调用网：
     - Mac/Linux: `~/.codemap/bin/codegraph query <你要追踪的变量结构>`
  4. **全景产物落盘可视化**：初次入驻项目时，借由以上产生的数据，自动将业务架构渲染为 Mermaid 实体，存放到当前 `artifacts` 下命名为 `CODE_MAP.md` 以供随时刷新回溯。
- **限制红线**：操作前认清系统环境并使用正确的斜杠和文件后缀；绝不支持基于推测的虚假引用文件捏造。
```

---

## 📍 3. 实施限制与部署边界条件（Constraints）

在其他平台如 macOS 迁移或运行时，请务必保证：
1. **工作目录严格对焦 (CWD Binding)**：
    使用 Antigravity 下达执行指令前，一定要确保终端工作目录设定于用户给定的代码工程第一层根部。不可飘移路径。
2. **多态兼容设计**：
    注入规则文本（第 2 步块代码）时，明确标示出了 `Linux/macOS` 与 `Windows` 的不同指令。Antigravity 内置强大的跨平台心智模型，只要您复制正确，AI 它会自动检查用户的操作系统环境变量（通过类似于 `uname` 或环境上下文读取），并聪慧地在 Mac 上拔除 `.exe`。
3. **安全模式保护**：
    编译好后务必确保 `chmod +x` 的赋予，由于该插件无网络侵入，它可被设置为最高自动化 `SafeToAutoRun` 执行。
