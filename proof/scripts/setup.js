const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const PROJECT_ROOT = path.join(__dirname, "../..");
const PROOF_ROOT = path.join(__dirname, "..");
const CIRCUITS = path.join(PROJECT_ROOT, "circuits");
const KEYS = path.join(PROOF_ROOT, "keys");
const EXAMPLES = path.join(PROOF_ROOT, "examples");
const CONTRACTS = path.join(PROOF_ROOT, "contracts");

const CIRCUITS_CONFIG = [
  {
    name: "is_adult",
    r1cs: path.join(CIRCUITS, "build/is_adult/is_adult_main.r1cs"),
    wasm: path.join(CIRCUITS, "build/is_adult/is_adult_main_js/is_adult_main.wasm"),
    verifierContract: "IsAdultVerifier.sol",
    sampleInput: { birthdate: 20000115, currentYear: 2026 },
  },
  {
    name: "is_balance_above",
    r1cs: path.join(CIRCUITS, "build/is_balance_above/is_balance_above_main.r1cs"),
    wasm: path.join(
      CIRCUITS,
      "build/is_balance_above/is_balance_above_main_js/is_balance_above_main.wasm"
    ),
    verifierContract: "IsBalanceAboveVerifier.sol",
    sampleInput: { balance: 10000, threshold: 5000 },
  },
];

function run(cmd, cwd = PROOF_ROOT) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd, shell: "/bin/bash" });
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

async function main() {
  ensureDir(KEYS);
  ensureDir(EXAMPLES);
  ensureDir(CONTRACTS);

  run("npm run build", CIRCUITS);

  const potFinal = path.join(KEYS, "pot14_final.ptau");
  const pot0 = path.join(KEYS, "pot14_0000.ptau");
  const pot1 = path.join(KEYS, "pot14_0001.ptau");

  if (!fs.existsSync(potFinal)) {
    console.log("\n=== Powers of Tau (dev, pot 14) ===");
    run(`npx snarkjs powersoftau new bn128 14 "${pot0}" -v`);
    run(
      `echo "dev entropy $(date)" | npx snarkjs powersoftau contribute "${pot0}" "${pot1}" --name="Dev Contributor" -v`
    );
    run(`npx snarkjs powersoftau prepare phase2 "${pot1}" "${potFinal}" -v`);
  } else {
    console.log("Using existing Powers of Tau file:", potFinal);
  }

  for (const circuit of CIRCUITS_CONFIG) {
    console.log(`\n=== Setting up ${circuit.name} ===`);
    const zkey0 = path.join(KEYS, `${circuit.name}_0000.zkey`);
    const zkeyFinal = path.join(KEYS, `${circuit.name}_final.zkey`);
    const vkJson = path.join(KEYS, `${circuit.name}_verification_key.json`);
    const verifierSol = path.join(CONTRACTS, circuit.verifierContract);

    if (!fs.existsSync(zkeyFinal)) {
      run(`npx snarkjs groth16 setup "${circuit.r1cs}" "${potFinal}" "${zkey0}"`);
      run(
        `echo "circuit entropy ${circuit.name}" | npx snarkjs zkey contribute "${zkey0}" "${zkeyFinal}" --name="Dev Contributor" -v`
      );
    }

    if (!fs.existsSync(vkJson)) {
      run(`npx snarkjs zkey export verificationkey "${zkeyFinal}" "${vkJson}"`);
    }

    if (!fs.existsSync(verifierSol)) {
      run(`npx snarkjs zkey export solidityverifier "${zkeyFinal}" "${verifierSol}"`);
      const contractName =
        circuit.name === "is_adult" ? "IsAdultVerifier" : "IsBalanceAboveVerifier";
      let sol = fs.readFileSync(verifierSol, "utf8");
      sol = sol.replace("contract Groth16Verifier", `contract ${contractName}`);
      fs.writeFileSync(verifierSol, sol);
    }

    const exampleDir = path.join(EXAMPLES, circuit.name);
    ensureDir(exampleDir);
    const inputPath = path.join(exampleDir, "input.json");
    const proofPath = path.join(exampleDir, "proof.json");
    const publicPath = path.join(exampleDir, "public.json");

    fs.writeFileSync(inputPath, JSON.stringify(circuit.sampleInput, null, 2));

    run(
      `npx snarkjs groth16 fullprove "${inputPath}" "${circuit.wasm}" "${zkeyFinal}" "${proofPath}" "${publicPath}"`
    );

    const calldataPath = path.join(exampleDir, "calldata.txt");
    run(
      `npx snarkjs zkey export soliditycalldata "${publicPath}" "${proofPath}" > "${calldataPath}"`
    );

    console.log(`Generated example proof for ${circuit.name}`);
  }

  console.log("\n=== Setup complete ===");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
