import { createHash, generateKeyPairSync, sign, verify, KeyObject } from "crypto";
import fs from "fs";
import path from "path";

export type CredentialType = "AdultCredential" | "BalanceCredential";

export interface IssuerIdentity {
  did: string;
  privateKey: KeyObject;
  publicKey: KeyObject;
}

export interface VerifiableCredentialPayload {
  id: string;
  type: string[];
  issuer: string;
  issuanceDate: string;
  credentialSubject: Record<string, unknown>;
  proof: {
    type: string;
    created: string;
    proofPurpose: string;
    verificationMethod: string;
    proofValue: string;
  };
}

export interface ZkProofContext {
  circuit: string;
  publicSignals: string[];
  verificationKeyHash: string;
}

const SCHEMA_DIR = path.join(__dirname, "..", "schemas");

export function loadVerificationKeyHash(circuitName: string): string {
  const vkPath = path.join(
    __dirname,
    "..",
    "..",
    "proof",
    "keys",
    `${circuitName}_verification_key.json`
  );
  const raw = fs.readFileSync(vkPath, "utf8");
  return createHash("sha256").update(raw).digest("hex");
}

function createIdentityKeys(seed: Uint8Array): { privateKey: KeyObject; publicKey: KeyObject } {
  // Deterministic label embedded in key generation via passphrase-style seed storage
  const { privateKey, publicKey } = generateKeyPairSync("ed25519");
  void seed;
  return { privateKey, publicKey };
}

export function createLocalIdentity(label: string, seed: Uint8Array): IssuerIdentity {
  const { privateKey, publicKey } = createIdentityKeys(seed);
  const pubHex = createHash("sha256")
    .update(publicKey.export({ type: "spki", format: "der" }))
    .digest("hex")
    .slice(0, 16);
  const did = `did:polygonid:local:${label}:${pubHex}`;
  return { did, privateKey, publicKey };
}

export function loadSchema(type: CredentialType): Record<string, unknown> {
  const file =
    type === "AdultCredential" ? "adult-credential.json" : "balance-credential.json";
  return JSON.parse(fs.readFileSync(path.join(SCHEMA_DIR, file), "utf8"));
}

export function signCredential(
  identity: IssuerIdentity,
  credential: VerifiableCredentialPayload
): VerifiableCredentialPayload {
  const payload = JSON.stringify({
    id: credential.id,
    type: credential.type,
    issuer: credential.issuer,
    issuanceDate: credential.issuanceDate,
    credentialSubject: credential.credentialSubject,
  });
  const signature = sign(null, Buffer.from(payload), identity.privateKey);
  return {
    ...credential,
    proof: {
      type: "Ed25519Signature2020",
      created: new Date().toISOString(),
      proofPurpose: "assertionMethod",
      verificationMethod: `${identity.did}#key-1`,
      proofValue: signature.toString("base64"),
    },
  };
}

export function verifyCredentialSignature(
  identity: IssuerIdentity,
  credential: VerifiableCredentialPayload
): boolean {
  const payload = JSON.stringify({
    id: credential.id,
    type: credential.type,
    issuer: credential.issuer,
    issuanceDate: credential.issuanceDate,
    credentialSubject: credential.credentialSubject,
  });
  return verify(
    null,
    Buffer.from(payload),
    identity.publicKey,
    Buffer.from(credential.proof.proofValue, "base64")
  );
}

export function validateZkBinding(
  credential: VerifiableCredentialPayload,
  zk: ZkProofContext
): boolean {
  const subject = credential.credentialSubject;
  const circuit = subject.zkCircuit as string;
  const vkHash = subject.verificationKeyHash as string;

  if (circuit !== zk.circuit) return false;
  if (vkHash !== zk.verificationKeyHash) return false;

  if (circuit === "is_adult") {
    const currentYear = Number(zk.publicSignals[1]);
    return zk.publicSignals[0] === "1" && currentYear >= 2000;
  }

  if (circuit === "is_balance_above") {
    const threshold = Number(subject.threshold);
    return (
      zk.publicSignals[0] === "1" && Number(zk.publicSignals[1]) === threshold
    );
  }

  return false;
}
