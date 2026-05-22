require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const scrollRpc = process.env.SCROLL_SEPOLIA_RPC || "https://sepolia-rpc.scroll.io";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
  },
  networks: {
    hardhat: {},
    scrollSepolia: {
      url: scrollRpc,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};
