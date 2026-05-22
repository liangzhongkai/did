import { scrollSepolia } from "viem/chains";

export const SUPPORTED_CHAIN = scrollSepolia;

export const CONTRACTS = {
  credentialVerifier: (import.meta.env.VITE_CREDENTIAL_VERIFIER as `0x${string}`) || "0x",
};

export const ZK_ASSETS = {
  is_adult: {
    wasm: "/zk/is_adult/is_adult_main.wasm",
    zkey: "/zk/is_adult/is_adult_final.zkey",
  },
  is_balance_above: {
    wasm: "/zk/is_balance_above/is_balance_above_main.wasm",
    zkey: "/zk/is_balance_above/is_balance_above_final.zkey",
  },
} as const;

export type CircuitName = keyof typeof ZK_ASSETS;
