import {
  createLocalIdentity,
  CredentialType,
  IssuerIdentity,
  loadSchema,
  loadVerificationKeyHash,
  signCredential,
  VerifiableCredentialPayload,
} from "./core";

export class CredentialIssuer {
  readonly identity: IssuerIdentity;

  constructor(label: string, seed: Uint8Array) {
    this.identity = createLocalIdentity(label, seed);
  }

  async issue(
    holderDid: string,
    type: CredentialType,
    subject: Record<string, unknown>
  ): Promise<VerifiableCredentialPayload> {
    loadSchema(type);

    const circuit =
      type === "AdultCredential" ? "is_adult" : "is_balance_above";
    const verificationKeyHash = loadVerificationKeyHash(circuit);

    const credential: VerifiableCredentialPayload = {
      id: `urn:uuid:${crypto.randomUUID()}`,
      type: ["VerifiableCredential", type],
      issuer: this.identity.did,
      issuanceDate: new Date().toISOString(),
      credentialSubject: {
        id: holderDid,
        ...subject,
        zkCircuit: circuit,
        verificationKeyHash,
      },
      proof: {
        type: "BJJSignature2021",
        created: "",
        proofPurpose: "assertionMethod",
        verificationMethod: "",
        proofValue: "",
      },
    };

    return signCredential(this.identity, credential);
  }
}
