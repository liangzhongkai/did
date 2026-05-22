import fs from "fs";
import path from "path";
import { CredentialIssuer } from "../src/issuer";
import { CredentialVerifier } from "../src/verifier";
import { createLocalIdentity, loadVerificationKeyHash } from "../src/core";

const encoder = new TextEncoder();

describe("DID integration", () => {
  const issuerSeed = encoder.encode("issuer-seed-for-testing-0001");
  const holderSeed = encoder.encode("holder-seed-for-testing-00002");
  let issuer: CredentialIssuer;
  let verifier: CredentialVerifier;
  let holderDid: string;

  beforeAll(() => {
    issuer = new CredentialIssuer("issuer", issuerSeed);
    verifier = new CredentialVerifier();
    holderDid = createLocalIdentity("holder", holderSeed).did;
  });

  it("creates issuer DID in did:polygonid format", () => {
    expect(issuer.identity.did).toMatch(/^did:polygonid:local:issuer:/);
  });

  it("issues and verifies an adult credential", async () => {
    const vc = await issuer.issue(holderDid, "AdultCredential", {
      birthdate: 20000115,
    });

    expect(vc.type).toContain("AdultCredential");
    expect(vc.credentialSubject.zkCircuit).toBe("is_adult");
    expect(vc.proof.proofValue).toBeTruthy();

    const result = verifier.verifySignature(issuer.identity, vc);
    expect(result.valid).toBe(true);
  });

  it("issues and verifies a balance credential", async () => {
    const vc = await issuer.issue(holderDid, "BalanceCredential", {
      threshold: 5000,
    });

    const result = verifier.verifySignature(issuer.identity, vc);
    expect(result.valid).toBe(true);
    expect(vc.credentialSubject.threshold).toBe(5000);
  });

  it("links VC to ZK proof public signals", async () => {
    const vc = await issuer.issue(holderDid, "AdultCredential", {
      birthdate: 20000115,
    });

    const publicPath = path.join(__dirname, "../../proof/examples/is_adult/public.json");
    const publicSignals: string[] = JSON.parse(fs.readFileSync(publicPath, "utf8"));

    const result = verifier.verifyWithZkProof(issuer.identity, vc, {
      circuit: "is_adult",
      publicSignals,
      verificationKeyHash: loadVerificationKeyHash("is_adult"),
    });

    expect(result.valid).toBe(true);
  });

  it("rejects VC when ZK proof does not match", async () => {
    const vc = await issuer.issue(holderDid, "BalanceCredential", {
      threshold: 9999,
    });

    const publicPath = path.join(
      __dirname,
      "../../proof/examples/is_balance_above/public.json"
    );
    const publicSignals: string[] = JSON.parse(fs.readFileSync(publicPath, "utf8"));

    const result = verifier.verifyWithZkProof(issuer.identity, vc, {
      circuit: "is_balance_above",
      publicSignals,
      verificationKeyHash: loadVerificationKeyHash("is_balance_above"),
    });

    expect(result.valid).toBe(false);
    expect(result.reason).toBe("ZK proof does not match credential");
  });
});
