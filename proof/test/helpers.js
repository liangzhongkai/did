const fs = require("fs");
const path = require("path");

function loadProofBundle(circuitName) {
  const base = path.join(__dirname, "..", "examples", circuitName);
  const proof = JSON.parse(fs.readFileSync(path.join(base, "proof.json"), "utf8"));
  const publicSignals = JSON.parse(fs.readFileSync(path.join(base, "public.json"), "utf8"));

  const pA = proof.pi_a.slice(0, 2).map((x) => BigInt(x));
  const pB = [
    proof.pi_b[0].slice(0, 2).map((x) => BigInt(x)).reverse(),
    proof.pi_b[1].slice(0, 2).map((x) => BigInt(x)).reverse(),
  ];
  const pC = proof.pi_c.slice(0, 2).map((x) => BigInt(x));
  const pub = publicSignals.map((x) => BigInt(x));

  return { pA, pB, pC, pub };
}

function corruptProof(bundle) {
  return {
    ...bundle,
    pA: [bundle.pA[0] + 1n, bundle.pA[1]],
  };
}

module.exports = { loadProofBundle, corruptProof };
