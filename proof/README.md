# Proof Generation & On-Chain Verification

Groth16 trusted setup, proof generation scripts, and Solidity verifiers for the ZK circuits.

## Prerequisites

- Node.js 18+
- Built circuits in `../circuits/build/`

## Setup

```bash
npm install
npm run setup
```

This runs a **development-only** Powers of Tau ceremony (pot 14), generates proving/verification keys, exports Solidity verifiers to `contracts/`, and writes example proofs to `examples/`.

## Generate Proofs

```bash
npm run generate:is-adult
npm run generate:is-balance-above
```

Or with custom input:

```bash
node scripts/generateProof.js is_adult my-input.json
```

## Test

```bash
npm test
```

Hardhat tests deploy snarkjs-exported verifiers and the `CredentialVerifier` wrapper, then verify valid and invalid proofs.

## Outputs

| Path | Description |
|------|-------------|
| `keys/` | PTAU, zkey, verification key JSON |
| `contracts/IsAdultVerifier.sol` | snarkjs Groth16 verifier |
| `contracts/IsBalanceAboveVerifier.sol` | snarkjs Groth16 verifier |
| `contracts/CredentialVerifier.sol` | DApp-facing wrapper |
| `examples/<circuit>/proof.json` | Sample proof |
| `examples/<circuit>/public.json` | Public signals |
| `examples/<circuit>/calldata.txt` | Solidity calldata |

## ABI Export

After `npm run compile`, ABIs are in `artifacts/contracts/`.
