export { CredentialIssuer } from "./issuer";
export { CredentialVerifier } from "./verifier";
export {
  createLocalIdentity,
  loadVerificationKeyHash,
  validateZkBinding,
  type CredentialType,
  type IssuerIdentity,
  type VerifiableCredentialPayload,
  type ZkProofContext,
} from "./core";