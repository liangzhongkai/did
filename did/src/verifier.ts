import {
  IssuerIdentity,
  validateZkBinding,
  VerifiableCredentialPayload,
  verifyCredentialSignature,
  ZkProofContext,
} from "./core";

export interface VerificationResult {
  valid: boolean;
  reason?: string;
}

export class CredentialVerifier {
  verifySignature(
    issuer: IssuerIdentity,
    credential: VerifiableCredentialPayload
  ): VerificationResult {
    if (credential.issuer !== issuer.did) {
      return { valid: false, reason: "Issuer mismatch" };
    }
    const ok = verifyCredentialSignature(issuer, credential);
    return ok ? { valid: true } : { valid: false, reason: "Invalid signature" };
  }

  verifyWithZkProof(
    issuer: IssuerIdentity,
    credential: VerifiableCredentialPayload,
    zk: ZkProofContext
  ): VerificationResult {
    const sig = this.verifySignature(issuer, credential);
    if (!sig.valid) return sig;

    const bound = validateZkBinding(credential, zk);
    return bound
      ? { valid: true }
      : { valid: false, reason: "ZK proof does not match credential" };
  }
}
