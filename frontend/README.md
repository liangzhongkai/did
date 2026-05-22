# L2 DApp Frontend

React + viem/wagmi interface for generating Groth16 proofs in-browser and submitting them to `CredentialVerifier` on Scroll Sepolia.

## Prerequisites

- Completed `circuits/` build and `proof/` setup
- MetaMask with Scroll Sepolia network

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

`predev` copies WASM/zkey assets from sibling modules into `public/zk/`.

## Deploy Contracts

From `../proof/`:

```bash
# local
npx hardhat run scripts/deploy.js

# Scroll Sepolia (set PRIVATE_KEY and SCROLL_SEPOLIA_RPC in proof/.env)
npx hardhat run scripts/deploy.js --network scrollSepolia
```

Copy the `credentialVerifier` address into `frontend/.env`:

```
VITE_CREDENTIAL_VERIFIER=0x...
```

## Test

```bash
npm test
```

## Flow

1. Connect MetaMask and switch to Scroll Sepolia
2. Enter private inputs (birthdate or balance) and public inputs (year or threshold)
3. Click **Generate Proof & Submit** — snarkjs runs locally, then viem sends the tx

## Optional DID

The `did/` module can issue off-chain VCs linked to the same circuits. Integrating VC display in the UI is optional for MVP.
