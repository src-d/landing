module.exports = {
  extends: "airbnb-base",
  plugins: ["import", "prettier"],
  rules: {
    "prettier/prettier": "error",
    "import/no-extraneous-dependencies": 0,
    "import/no-unresolved": 0,
    "import/extensions": 0,
    "func-names": 0,
    "no-underscore-dangle": 0, // because of _super
    "no-plusplus": ["error", { allowForLoopAfterthoughts: true }]
  }
};
