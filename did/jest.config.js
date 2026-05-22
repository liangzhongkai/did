/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/test/**/*.test.ts"],
  testTimeout: 30000,
  transformIgnorePatterns: [
    "node_modules/(?!(@iden3/js-crypto|@noble/hashes|@iden3/js-iden3-core|@iden3/js-jsonld-merklization)/)",
  ],
};
