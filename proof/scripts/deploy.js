const hre = require("hardhat");

async function main() {
  const IsAdult = await hre.ethers.getContractFactory(
    "contracts/IsAdultVerifier.sol:IsAdultVerifier"
  );
  const IsBalanceAbove = await hre.ethers.getContractFactory(
    "contracts/IsBalanceAboveVerifier.sol:IsBalanceAboveVerifier"
  );
  const Credential = await hre.ethers.getContractFactory("CredentialVerifier");

  const isAdult = await IsAdult.deploy();
  await isAdult.waitForDeployment();

  const isBalanceAbove = await IsBalanceAbove.deploy();
  await isBalanceAbove.waitForDeployment();

  const credential = await Credential.deploy(
    await isAdult.getAddress(),
    await isBalanceAbove.getAddress()
  );
  await credential.waitForDeployment();

  console.log(
    JSON.stringify(
      {
        isAdultVerifier: await isAdult.getAddress(),
        isBalanceAboveVerifier: await isBalanceAbove.getAddress(),
        credentialVerifier: await credential.getAddress(),
        network: hre.network.name,
        chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
