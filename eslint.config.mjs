import unjs from "eslint-config-unjs";

export default unjs({
  ignores: [
    // ignore paths
  ],
  rules: {
    "unicorn/no-nested-ternary": 0,
    "unicorn/filename-case": 0,
    "unicorn/prefer-switch": 0,
  },
  markdown: {
    rules: {
      "unicorn/filename-case": 0,
    },
  },
});
