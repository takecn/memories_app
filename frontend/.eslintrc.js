module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["plugin:react/recommended", "airbnb", "prettier"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "import/prefer-default-export": "off",
    "arrow-body-style": "off",
    "react/function-component-definition": "off",
    "react/no-array-index-key": "off",
    "no-nested-ternary": "off",
  },
  settings: { "import/resolver": "webpack" },
};
