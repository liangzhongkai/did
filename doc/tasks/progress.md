# 总体进度

- [x] 模块 1：ZK 电路 (zk-circuit)
- [x] 模块 2：证明生成与链上验证 (proof-verification)
- [x] 模块 3：DID 集成 (did-integration)
- [x] 模块 4：L2 DApp 交互 (l2-dapp)

## 测试状态

| 模块 | 命令 | 状态 |
|------|------|------|
| circuits | `cd circuits && npm test` | 10 passing |
| proof | `cd proof && npm test` | 7 passing |
| did | `cd did && npm test` | 5 passing |
| frontend | `cd frontend && npm test` | 1 passing |

## 部署

- 本地 Hardhat 部署脚本：`proof/scripts/deploy.js`
- Scroll Sepolia：`cd proof && npm run deploy:scroll`（需配置 `PRIVATE_KEY`）
- 前端配置：`frontend/.env` 中设置 `VITE_CREDENTIAL_VERIFIER`
