const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadProofBundle, corruptProof } = require("./helpers");

describe("Groth16 verifiers", function () {
  this.timeout(120000);

  let isAdultVerifier;
  let isBalanceAboveVerifier;
  let credentialVerifier;

  before(async function () {
    const IsAdult = await ethers.getContractFactory("contracts/IsAdultVerifier.sol:IsAdultVerifier");
    const IsBalanceAbove = await ethers.getContractFactory(
      "contracts/IsBalanceAboveVerifier.sol:IsBalanceAboveVerifier"
    );

    isAdultVerifier = await IsAdult.deploy();
    isBalanceAboveVerifier = await IsBalanceAbove.deploy();

    const Credential = await ethers.getContractFactory("CredentialVerifier");
    credentialVerifier = await Credential.deploy(
      await isAdultVerifier.getAddress(),
      await isBalanceAboveVerifier.getAddress()
    );
  });

  describe("IsAdultVerifier", function () {
    it("accepts a valid adult proof", async function () {
      const { pA, pB, pC, pub } = loadProofBundle("is_adult");
      const ok = await isAdultVerifier.verifyProof.staticCall(pA, pB, pC, pub);
      expect(ok).to.equal(true);
      expect(pub[0]).to.equal(1n);
    });

    it("rejects a corrupted proof", async function () {
      const bad = corruptProof(loadProofBundle("is_adult"));
      const ok = await isAdultVerifier.verifyProof.staticCall(bad.pA, bad.pB, bad.pC, bad.pub);
      expect(ok).to.equal(false);
    });
  });

  describe("IsBalanceAboveVerifier", function () {
    it("accepts a valid balance proof", async function () {
      const { pA, pB, pC, pub } = loadProofBundle("is_balance_above");
      const ok = await isBalanceAboveVerifier.verifyProof.staticCall(pA, pB, pC, pub);
      expect(ok).to.equal(true);
      expect(pub[0]).to.equal(1n);
    });

    it("rejects a corrupted proof", async function () {
      const bad = corruptProof(loadProofBundle("is_balance_above"));
      const ok = await isBalanceAboveVerifier.verifyProof.staticCall(
        bad.pA,
        bad.pB,
        bad.pC,
        bad.pub
      );
      expect(ok).to.equal(false);
    });
  });

  describe("CredentialVerifier", function () {
    it("verifies adult credential end-to-end", async function () {
      const { pA, pB, pC, pub } = loadProofBundle("is_adult");
      await expect(credentialVerifier.verifyAdult(pA, pB, pC, pub)).to.not.be.reverted;
    });

    it("verifies balance credential end-to-end", async function () {
      const { pA, pB, pC, pub } = loadProofBundle("is_balance_above");
      await expect(credentialVerifier.verifyBalance(pA, pB, pC, pub)).to.not.be.reverted;
    });

    it("rejects invalid adult proof via wrapper", async function () {
      const bad = corruptProof(loadProofBundle("is_adult"));
      await expect(
        credentialVerifier.verifyAdult(bad.pA, bad.pB, bad.pC, bad.pub)
      ).to.be.revertedWith("Invalid adult proof");
    });
  });
});
