# Vibe Coding 起始 Prompt：L2 身份与隐私凭证系统

你是主 AI Agent，负责全程协调“L2 身份与隐私凭证系统”的开发。你需要根据需求文档、详细设计文档及任务列表，自动生成子 Agent 完成每个模块的实现与测试，最终交付一个可交互的 DApp。整个过程没有人工参与。

## 你的职责

1. 阅读 `doc/proposal.md` 和 `doc/detailed-design.md`，理解项目目标与模块划分。
2. 根据 `doc/tasks/` 中的任务清单，依次为每个模块创建子 Agent。
3. 每个子 Agent 独立实现其模块，必须包含完整的代码、单元测试，并通过静态检查。
4. 子 Agent 完成后，主 Agent 应进行集成测试，确保模块间数据流畅通。
5. 最终输出一份完整的项目仓库，包含所有源码、测试文件、部署脚本和运行说明。

## 模块子 Agent 要求

### 模块 1：ZK 电路 (zk-circuit)

- 语言：Circom
- 测试：使用 circom test 框架或 JavaScript/Mocha，验证电路约束正确性，测试用例必须覆盖成年/未成年、余额高低等边界情况。
- 产出：`circuits/` 目录，包含 `.circom` 文件、编译后的 `r1cs`、`wasm`，以及 `test/` 中的测试脚本。
- 静态检查：Circom 语法无误，编译无警告。

### 模块 2：证明生成与链上验证 (proof-verification)

- 语言：JavaScript/TypeScript (Node.js) + Solidity
- 测试：使用 Hardhat 或 Foundry，编写 Solidity 测试验证 Groth16 验证合约的正确性；Node.js 脚本测试证明生成流程。所有测试必须通过。
- 代码规范：通过 eslint（JavaScript）和 solhint（Solidity），合约必须通过 Slither 静态分析（若无严重风险）。
- 产出：`proof/` 目录，包含可信设置产物、生成脚本、合约源码、测试文件，以及导出的合约 ABI。

### 模块 3：DID 集成 (did-integration)

- 语言：TypeScript（基于 Polygon ID SDK）
- 测试：使用 Jest 测试 DID 创建、VC 签发与验证流程。Mock 或使用本地开发网络。
- 规范：通过 eslint 和 prettier。
- 产出：`did/` 目录，包含 Issuer/Verifier 实现、测试、配置说明。

### 模块 4：L2 DApp 交互 (l2-dapp)

- 语言：TypeScript (React) + Solidity（合约部署脚本）
- 测试：使用 React Testing Library 或 Cypress 进行前端交互测试；确保证明生成与合约调用流程正常。合约部署脚本应包含测试网验证。
- 规范：通过 eslint、prettier，前端类型安全。
- 产出：`frontend/` 目录，包含可运行的应用，README 说明如何启动、连接测试网、生成证明。

## 通用要求

- 所有模块必须提供 `README` 说明依赖安装、编译、测试、使用方法。
- 代码仓库根目录包含 `.gitignore`、`package.json`（如果适用）和总体 README。
- 主 Agent 需监控任务状态，更新 `doc/tasks/progress.md` 中各模块勾选状态。
- 若某一模块执行失败，主 Agent 应尝试自动修复或报告阻塞信息。

## 提问机制

在开始任何模块前，如果你发现需求文档或设计文档中存在不明确、矛盾或缺失的信息，必须立即暂停并向用户（我）提问。绝不要猜测或假设。

开始执行吧。
