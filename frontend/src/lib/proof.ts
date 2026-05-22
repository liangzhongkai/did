import { groth16 } from "snarkjs";
import type { CircuitName } from "./config";
import { ZK_ASSETS } from "./config";

export interface ProofBundle {
  proof: {
    pi_a: string[];
    pi_b: string[][];
    pi_c: string[];
    protocol: string;
    curve: string;
  };
  publicSignals: string[];
}

export async function generateProof(
  circuit: CircuitName,
  input: Record<string, number>
): Promise<ProofBundle> {
  const assets = ZK_ASSETS[circuit];
  const { proof, publicSignals } = await groth16.fullProve(
    input,
    assets.wasm,
    assets.zkey
  );
  return { proof, publicSignals };
}

export function toContractArgs(bundle: ProofBundle) {
  const { proof, publicSignals } = bundle;
  const pA: [bigint, bigint] = [BigInt(proof.pi_a[0]), BigInt(proof.pi_a[1])];
  const pB: [[bigint, bigint], [bigint, bigint]] = [
    [BigInt(proof.pi_b[0][1]), BigInt(proof.pi_b[0][0])],
    [BigInt(proof.pi_b[1][1]), BigInt(proof.pi_b[1][0])],
  ];
  const pC: [bigint, bigint] = [BigInt(proof.pi_c[0]), BigInt(proof.pi_c[1])];
  const pub = publicSignals.map((s) => BigInt(s)) as [bigint, bigint];
  return { pA, pB, pC, pub };
}
