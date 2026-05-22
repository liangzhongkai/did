# ZK Circuits

Circom circuits for privacy-preserving age and balance proofs.

## Circuits

| Circuit | Private Inputs | Public Inputs | Public Output |
|---------|---------------|---------------|---------------|
| `IsAdult` | `birthdate` (YYYYMMDD) | `currentYear` | `is_adult` (0/1) |
| `IsBalanceAbove` | `balance` | `threshold` | `above` (0/1) |

## Prerequisites

- [Circom](https://docs.circom.io/getting-started/installation/) 2.x
- Node.js 18+

## Setup

```bash
npm install
```

## Build

Compile both circuits to R1CS and WASM:

```bash
npm run build
```

Outputs land in `build/is_adult/` and `build/is_balance_above/`.

## Test

```bash
npm test
```

Tests use `circom_tester` and cover adult/minor boundaries and balance comparison edge cases.

## Signal Reference

### IsAdult

- `birthdate`: integer `YYYYMMDD`, e.g. `20000115`
- `currentYear`: e.g. `2026`
- `is_adult`: `1` if `currentYear - floor(birthdate/10000) >= 18`

### IsBalanceAbove

- `balance`: private integer
- `threshold`: public integer
- `above`: `1` if `balance > threshold`
