module.exports = function (config) {
  config.set({
    frameworks: ["jasmine", "karma-typescript"],
    files: [
      { pattern: "src/**/*.ts" },
      { pattern: "spec/**/*.ts" },
    ],
    preprocessors: {
      "**/*.ts": ["karma-typescript"],
    },
    reporters: ["mocha", "karma-typescript"],
    browsers: ["Chrome"],
    karmaTypescriptConfig: {
      reports:
      {
        "html": "./dist/coverage"
      }
    },
    singleRun: true
  });
};
