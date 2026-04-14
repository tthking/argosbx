# CodeMap 项目全景图 (CODE_MAP)

## 📌 1. 项目概览与类型 (Survey)
- **技术栈**：Rust (`rust-cli/`) 作为底层核心解析引擎；Markdown / Bash (`ccplugin/`) 构成 AI Agent 交互插件（如针对 Claude Desktop 的插件体系）。
- **主要目的**：通过底层 AST（抽象语法树）分析工具构建项目的代码图谱，并通过 AI 友好的方式（Markdown prompts / Hooks）帮助 LLM 高效加载上下文和查询依赖关系，实现“图谱优先”的工作流。

## 📍 2. 核心端点与入口 (Trace)
- **AI 交互入口 (Skills & Commands)**：
  - `ccplugin/skills/codemap/SKILL.md`：核心 Skill 定义，负责分发和路由用户意图（如扫码、查询、提词注入）。
  - `ccplugin/commands/prompts.md`：规范注入命令，提取代码片段信息后注入到项目根目录下的规范文件。
- **底层分析引擎入口 (Rust CLI)**：
  - `rust-cli/Cargo.toml` 及 `rust-cli/src/`：底层负责解析源码为 JSON 格式的大纲图谱（`.codemap/graph.json`）并计算相关性。
- **自动化勾子 (Hooks)**：
  - `ccplugin/hooks/hooks.json` & `ccplugin/hooks/scripts/detect-codemap.sh`：定义了在 AI 会话启动 (`SessionStart`) 时自动执行的环境检测。

## 🗺️ 3. 架构依赖与数据流向图 (Map)

```mermaid
graph TD
    User([User / AI Agent]) --> |Trigger| SessionStart
    SessionStart -->|hooks.json| DetectScript[detect-codemap.sh]
    DetectScript -->|Check| Env(Environment / PATH)
    DetectScript -.->|Find| RustBIN[codegraph Binary]
    
    User --> |Intent / Query| Skill[SKILL.md]
    Skill --> |Route| CmdScan[/codemap:scan]
    Skill --> |Route| CmdLoad[/codemap:load]
    Skill --> |Route| CmdQuery[/codemap:query]
    Skill --> |Route| CmdPrompts[/codemap:prompts]
    
    CmdScan --> RustBIN
    RustBIN --> |Parse AST| Graph[/.codemap/graph.json]
    CmdLoad --> Graph
    CmdQuery --> Graph
    
    CmdPrompts --> |Extract info| Graph
    CmdPrompts --> |Inject Markdown| CLAUDE(CLAUDE.md)
```

## 🛠️ 4. 关键文件简述
1. **`detect-codemap.sh`**：检测环境变量或构建目录中是否存在 `codegraph` 二进制程序，并在终端初始阶段（会话开启时）自动提醒当前项目的代码图谱（`.codemap`）是否建立或过期。
2. **`prompts.md`**：检测当用户请求注入规范时，提取 `.codemap/slices/_overview.json` 的动态统计信息（如：总文件数、语言、模块分布等），拼接生成 Markdown 标准要求，最后幂等插入或更新到目标项目的 `CLAUDE.md` 内中，进而实现**自动化注入与规范落地**。
3. **`rust-cli` 目录**：用于高性能预处理工程源码，生成可以极大压缩 LLM Token 消耗的代码图谱元数据。
