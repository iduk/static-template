/* eslint-disable no-undef */
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    allowImportExportEverywhere: false,
  },
  // plugins: ['react'],
  rules: {
    'no-unused-expressions': 0,
    'react/no-unescaped-entities': 0,
    'react/prop-types': 0,
    'no-unused-vars': 0,
  },
}
