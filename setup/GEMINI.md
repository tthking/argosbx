# AI 回复规则（强制中文）
- Always respond in 简体中文，禁止使用任何英文（代码片段除外）。
- 解释性文字、注释、说明全部用中文，代码保持原语言。
- 回答风格：通俗易懂，符合中文表达习惯，避免直译式生硬表述。
- 若用户输入英文，回复仍优先用中文，仅必要时补充英文对照。

# CodeMap 技能调用规则 (Native AST Engine)
- **适用场景**：当进入一个陌生的仓库、处理跨文件逻辑、排查复杂异常或规划新功能时，应自动激活原生底层的 CodeMap AST 引擎技能。
- **核心逻辑**：
  1. **引擎硬核扫描**：放弃使用基于大模型盲扫猜结构的 list_dir，必须使用 `run_command` 直接调用原生引擎执行：`$env:USERPROFILE\.codemap\bin\codegraph.exe scan .`（或对应 linux 里的 `~/.codemap/bin/codegraph scan .`），以序列化代码的真实结构到 `.codemap/`。
  2. **精读加载模块**：扫描完成后，直接精准读取 `.codemap/slices/_overview.json` 文件以提取真正的入口与依赖层级。
  3. **调用链追踪**：当需要找寻代码符号或是修改跨文件变量时，先使用工具调用：`$env:USERPROFILE\.codemap\bin\codegraph.exe query <符号名>` 实现调用网络关联审查。
  4. **地图持久化**：在 `brain` 或 `artifacts` 目录下创建一个 `CODE_MAP.md` 文件（作为 Artifact），将引擎给出的节点依赖转化为 Mermaid 架构表达，并随时间更新。
- **输出要求**：每次调用该核心技能前，请确认 `.codemap` 项目产物，摒弃依靠语言推测的行为。每次都必须展示通过引擎解析出来的清晰业务链路。
