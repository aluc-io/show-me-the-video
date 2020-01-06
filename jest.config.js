// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  testMatch: null,
  testRegex: "/__tests__/.*\\.(test|spec)\\.(jsx?|tsx?)$",
  globals: {
    'ts-jest': {
      diagnostics: {
        ignoreCodes: [6133],
        // pathRegex: /\.(spec|test)\.ts$/,
        // "warnOnly": true,
      }
    }
  }
}
