module.exports = {
  "extends": [
    "plugin:react/recommended",
    "airbnb-base"
  ],
  "plugins": ["import", "json"],
  "rules": {
    "import/no-extraneous-dependencies": 0,
    "import/no-unresolved": 0,
    "import/extensions": 0,
    "func-names": 0,
    "no-underscore-dangle": 0, // because of _super
    "no-plusplus": [
      "error",
      { "allowForLoopAfterthoughts": true }
    ]
  },
  "globals": {
    "window": true,
    "fetch": true
  }
};
