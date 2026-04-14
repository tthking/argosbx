# CodeMap 核心技能指令 (Global Integration for Antigravity)

当进入一个陌生的仓库、处理跨文件逻辑、排查复杂异常或规划新功能时，请自动激活 CodeMap 工作流。
本项目已全局采用 [CodeMap (codegraph)](https://github.com/tthking/CodeMap) 底层引擎进行真正的 AST 级别代码分析，请使用以下准则：

## 第一阶段：自动扫描与图谱构建 (Auto Scan)
1. 优先使用 `list_dir` 检测代码根目录是否存在 `.codemap` 数据存储目录。
2. 若不存在，请**无条件使用 `run_command` 工具运行本地引擎进行全量硬扫描**，从而产生真实的文件节点快照：
   `$env:USERPROFILE\.codemap\bin\codegraph.exe scan .` (或适合在 linux 里的路径 `~/.codemap/bin/codegraph scan .`)。
3. 执行后验证 `.codemap/graph.json` 是否已产生。

## 第二阶段：加载预处理结构 (Load Context)
1. 严禁盲目读取庞大源码，使用 `view_file` 读取引擎已预判的统计文件 `.codemap/slices/_overview.json`。
2. 提取并理解其中的系统模块划分、文件计数、函数集合与依赖入口。

## 第三阶段：精确符号追踪 (Query Map)
1. 遇到具体特定函数、类和结构体的修改任务时，执行精准的查询命令：
   `$env:USERPROFILE\.codemap\bin\codegraph.exe query <你的符号> `
2. 根据执行结果读取其引用的具体代码上下文行号与所在文件。

## 第四阶段：成果落盘机制
- 在当前会话的 `artifacts` 中保留或刷新一个 `CODE_MAP.md` 文档。
- 该文档必须采用 Mermaid 图形渲染项目的真实依赖链条和您的修改计划锚点。
