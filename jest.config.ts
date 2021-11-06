import {} from "ts-jest";
export default {
  injectGlobals: true,
  transform: {
    ".*\\.(js)$": "babel-jest",
    ".*\\.(ts)$": "ts-jest"
  },
 
  clearMocks: true,
  collectCoverage: true,
  testEnvironment: "jsdom",

  coverageDirectory: "coverage",

  coverageReporters: [
    "html",
    "clover"
  ],

};
