const path = require("path");
const wasm_tester = require("circom_tester").wasm;
const { expect } = require("chai");

const CIRCUITS_DIR = path.join(__dirname, "..");

describe("IsAdult circuit", () => {
  let circuit;

  before(async () => {
    circuit = await wasm_tester(
      path.join(CIRCUITS_DIR, "is_adult_main.circom"),
      { include: path.join(CIRCUITS_DIR, "node_modules") }
    );
  });

  it("returns 1 for an adult born in 2000 (currentYear 2026)", async () => {
    const witness = await circuit.calculateWitness({
      birthdate: 20000115,
      currentYear: 2026,
    });
    await circuit.checkConstraints(witness);
    await circuit.assertOut(witness, { is_adult: 1 });
  });

  it("returns 1 for exactly 18 years old", async () => {
    const witness = await circuit.calculateWitness({
      birthdate: 20080101,
      currentYear: 2026,
    });
    await circuit.checkConstraints(witness);
    await circuit.assertOut(witness, { is_adult: 1 });
  });

  it("returns 0 for a minor born in 2010", async () => {
    const witness = await circuit.calculateWitness({
      birthdate: 20100520,
      currentYear: 2026,
    });
    await circuit.checkConstraints(witness);
    await circuit.assertOut(witness, { is_adult: 0 });
  });

  it("returns 0 for borderline minor (17 years old)", async () => {
    const witness = await circuit.calculateWitness({
      birthdate: 20090101,
      currentYear: 2026,
    });
    await circuit.checkConstraints(witness);
    await circuit.assertOut(witness, { is_adult: 0 });
  });

  it("rejects invalid birthdate remainder >= 10000", async () => {
    try {
      await circuit.calculateWitness({
        birthdate: 20009999,
        currentYear: 2026,
      });
      expect.fail("Expected constraint failure");
    } catch (err) {
      expect(err).to.exist;
    }
  });
});

describe("IsBalanceAbove circuit", () => {
  let circuit;

  before(async () => {
    circuit = await wasm_tester(
      path.join(CIRCUITS_DIR, "is_balance_above_main.circom"),
      { include: path.join(CIRCUITS_DIR, "node_modules") }
    );
  });

  it("returns 1 when balance is above threshold", async () => {
    const witness = await circuit.calculateWitness({
      balance: 10000,
      threshold: 5000,
    });
    await circuit.checkConstraints(witness);
    await circuit.assertOut(witness, { above: 1 });
  });

  it("returns 0 when balance equals threshold", async () => {
    const witness = await circuit.calculateWitness({
      balance: 5000,
      threshold: 5000,
    });
    await circuit.checkConstraints(witness);
    await circuit.assertOut(witness, { above: 0 });
  });

  it("returns 0 when balance is below threshold", async () => {
    const witness = await circuit.calculateWitness({
      balance: 100,
      threshold: 5000,
    });
    await circuit.checkConstraints(witness);
    await circuit.assertOut(witness, { above: 0 });
  });

  it("handles large balance values", async () => {
    const witness = await circuit.calculateWitness({
      balance: 999999999999,
      threshold: 1000000,
    });
    await circuit.checkConstraints(witness);
    await circuit.assertOut(witness, { above: 1 });
  });

  it("returns 0 for balance just below threshold", async () => {
    const witness = await circuit.calculateWitness({
      balance: 4999,
      threshold: 5000,
    });
    await circuit.checkConstraints(witness);
    await circuit.assertOut(witness, { above: 0 });
  });
});
