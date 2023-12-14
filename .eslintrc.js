const { off } = require("process");

module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended'
    ],
    rules: {
      // Add any additional rules here
      '@typescript-eslint/no-unused-vars': 'off',
    }
  };
  