module.exports = {
  rootDir: __dirname,
  clearMocks: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.[jt]s?(x)"],
};
