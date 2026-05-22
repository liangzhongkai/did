const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const CIRCUIT_MAP = {
  is_adult: {
    wasm: path.join(__dirname, "../../circuits/build/is_adult/is_adult_main_js/is_adult_main.wasm"),
    zkey: path.join(__dirname, "../keys/is_adult_final.zkey"),
  },
  is_balance_above: {
    wasm: path.join(
      __dirname,
      "../../circuits/build/is_balance_above/is_balance_above_main_js/is_balance_above_main.wasm"
    ),
    zkey: path.join(__dirname, "../keys/is_balance_above_final.zkey"),
  },
};

function run(cmd) {
  execSync(cmd, { stdio: "inherit", cwd: path.join(__dirname, "..") });
}

const circuitName = process.argv[2];
if (!CIRCUIT_MAP[circuitName]) {
  console.error("Usage: node generateProof.js <is_adult|is_balance_above> [input.json]");
  process.exit(1);
}

const inputArg = process.argv[3];
const input =
  inputArg && fs.existsSync(inputArg)
    ? JSON.parse(fs.readFileSync(inputArg, "utf8"))
    : JSON.parse(fs.readFileSync(path.join(__dirname, "../examples", circuitName, "input.json")));

const outDir = path.join(__dirname, "../examples", circuitName, "generated");
fs.mkdirSync(outDir, { recursive: true });

const inputPath = path.join(outDir, "input.json");
const proofPath = path.join(outDir, "proof.json");
const publicPath = path.join(outDir, "public.json");

fs.writeFileSync(inputPath, JSON.stringify(input, null, 2));

const { wasm, zkey } = CIRCUIT_MAP[circuitName];
run(
  `npx snarkjs groth16 fullprove ${inputPath} ${wasm} ${zkey} ${proofPath} ${publicPath}`
);

const calldata = execSync(
  `npx snarkjs zkey export soliditycalldata ${publicPath} ${proofPath}`,
  { cwd: path.join(__dirname, "..") }
).toString();

fs.writeFileSync(path.join(outDir, "calldata.txt"), calldata);
console.log(JSON.stringify({ proofPath, publicPath, calldata }, null, 2));
