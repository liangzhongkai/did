# 需求文档：L2 身份与隐私凭证系统

## 目标

构建一个去中心化身份与隐私凭证系统，使用零知识证明（ZK）技术，允许用户在不暴露具体信息（如完整生日、银行流水）的前提下，向 DApp 证明“我已成年”或“我的资产大于 X”。系统最终需在 Layer 2 测试网上可交互。

## 项目范围与核心功能

- 使用 Circom 编写 IsAdult 等隐私保护电路。
- 完成 Groth16 可信设置，生成证明与验证密钥。
- 在模拟链上环境（如 Remix VM）中编写 Solidity 验证合约并验证证明。
- 集成去中心化身份（DID）系统（如 Polygon ID），将 ZK 验证条件与可验证凭证（VC）关联。
- 在 Scroll 或 Polygon zkEVM 测试网上部署验证合约，并提供简单前端界面供用户生成证明并交互。

## 已知技术选型（待确认）

- ZK 框架：Circom + snarkjs
- 证明系统：Groth16
- DID 方案：Polygon ID（基于 Iden3 协议）
- 部署网络：Scroll 测试网 或 Polygon zkEVM 测试网
- 前端：框架待定（React？） + ethers.js / viem

## 待澄清问题

1. “资产大于 X”的具体输入是什么？例如用户输入银行余额与阈值，电路证明余额 > 阈值而不暴露余额本身；是否需要一个可信资产数据源（如预言机或银行签名）？
2. 生日输入格式是什么？是用户自行输入生日，然后电路计算年龄并与当前年份比较（需要将当前时间作为公开输入？）？还是签发 VC 时由签发方提供“成年”属性？
3. DID 集成的深度：是否要求从零实现 DID 文档创建、VC 签发与验证，还是使用 Polygon ID 提供的 Issuer/Verifier SDK 即可？测试网上的 DID 方法是哪种（did:polygonid）？
4. 前端需要具备哪些功能？仅需连接钱包、生成证明、调用合约？还是需要展示 DID 信息、管理凭证？
5. 测试要求：pytest 用于测试 Python 脚本？Circom 电路测试用 circom-helper 还是专门的 JavaScript/TypeScript 测试框架？Solidity 测试用 Hardhat/Foundry？
6. 交付物除了代码外，是否需要部署脚本、文档？
7. 所有步骤需要在本地完成还是可以依赖云服务（如 Infura、Alchemy）？本地可信设置阶段是否只进行开发用 mock 设置？
