# L2 Identity & Privacy Credential System

Zero-knowledge proof system for proving **age ≥ 18** or **balance > threshold** without revealing private data, with optional DID credentials and a Scroll Sepolia DApp.

## Architecture

```
circuits/  →  proof/  →  did/  →  frontend/
 (Circom)    (snarkjs+     (VC)     (React+
             Hardhat)              viem)
```

## Quick Start

### 1. Install all modules

```bash
cd circuits && npm install && cd ..
cd proof && npm install && cd ..
cd did && npm install && cd ..
cd frontend && npm install --legacy-peer-deps && cd ..
```

### 2. Build circuits & run trusted setup

```bash
npm run setup
```

This compiles Circom circuits, runs a **dev-only** Groth16 ceremony, exports Solidity verifiers, and writes example proofs.

### 3. Run all tests

```bash
npm test
```

### 4. Start the DApp

```bash
# Deploy locally (optional)
cd proof && npx hardhat run scripts/deploy.js

# Deploy to Scroll Sepolia
# Set PRIVATE_KEY in proof/.env, then:
cd proof && npm run deploy:scroll

# Configure frontend
cd frontend
cp .env.example .env
# Set VITE_CREDENTIAL_VERIFIER=<deployed address>

npm run dev
```

Open http://localhost:5173, connect MetaMask on Scroll Sepolia, generate a proof, and submit to the verifier contract.

## Modules

| Module | Path | Description |
|--------|------|-------------|
| ZK Circuits | [`circuits/`](circuits/) | `IsAdult`, `IsBalanceAbove` Circom circuits |
| Proof & Verify | [`proof/`](proof/) | Groth16 setup, snarkjs scripts, Hardhat verifiers |
| DID Integration | [`did/`](did/) | Off-chain VC issuance/verification linked to ZK circuits |
| L2 DApp | [`frontend/`](frontend/) | React UI, in-browser proof generation, contract calls |

## Design Decisions (confirmed defaults)

- **Birthday**: private `YYYYMMDD`; **current year** public
- **Balance**: private balance; public threshold; proves `balance > threshold`
- **Trusted setup**: local dev PTAU (pot 14), not production-safe
- **Verifier**: snarkjs-exported Groth16 contracts with hardcoded vk
- **DID**: off-chain VC verification (optional for MVP)
- **Network**: Scroll Sepolia
- **Frontend**: React + viem/wagmi, browser-side snarkjs

## Documentation

- [Proposal](doc/proposal.md)
- [Detailed Design](doc/detailed-design.md)
- [Progress](doc/tasks/progress.md)
