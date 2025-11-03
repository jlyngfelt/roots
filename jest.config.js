module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native" +
      "|@react-native" +
      "|@react-navigation" +
      "|@react-native-community" +
      "|expo(nent)?" +
      "|@expo(nent)?/.*" +
      "|@expo-google-fonts/.*" +
      "|@unimodules/.*" +
      "|unimodules" +
      "|sentry-expo" +
      "|native-base" +
      "|react-native-svg" +
      "|expo-modules-core" +
      "|firebase" +
      "|@firebase" +
      ")",
  ],
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/coverage/**",
    "!**/node_modules/**",
    "!**/babel.config.js",
    "!**/jest.setup.js",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
};
