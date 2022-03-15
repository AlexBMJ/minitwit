module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'jest'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
    'plugin:jest/recommended',
  ],
  rules: {
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    indent: ["error", 2]
  }
};