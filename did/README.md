# DID Integration

Off-chain DID/VC layer compatible with Polygon ID credential shapes, using Ed25519 signatures for local dev and ZK circuit binding from the `proof/` module.

## Features

- Local `did:polygonid:local:*` identities for dev/test
- Issuer signs Verifiable Credentials for age and balance claims (Ed25519 for local dev; upgrade to Polygon ID BJJ in production)
- Verifier checks BJJ signatures and ZK proof binding against circuit verification key hashes

## Prerequisites

- Completed `proof/` setup (verification key JSON files must exist)
- Node.js 18+

## Setup

```bash
npm install
npm run build
```

## Test

```bash
npm test
```

## Schemas

- `schemas/adult-credential.json` — birthdate + ZK circuit binding
- `schemas/balance-credential.json` — threshold + ZK circuit binding

## Usage

```typescript
import { CredentialIssuer, CredentialVerifier } from "did-integration";

const encoder = new TextEncoder();
const issuer = new CredentialIssuer("issuer", encoder.encode("my-seed"));
const vc = await issuer.issue(holderDid, "AdultCredential", { birthdate: 20000115 });

const verifier = new CredentialVerifier();
const result = verifier.verifySignature(issuer.identity, vc);
```

## Network

This module uses **off-chain verification** for MVP. On-chain Polygon ID state publishing is optional and not required for the DApp flow.
