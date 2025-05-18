module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true }
  },
  settings: {
    react: { version: 'detect' }
  },
  env: {
    browser: true,
    es2021: true
  },
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint'
  ],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier' // disables formatting rules so you can use Prettier
  ],
  rules: {
    // Recommended overrides for non-strict TS
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'warn',

    // General rules
    'react/react-in-jsx-scope': 'off', // not needed with React 17+
    'react/prop-types': 'off', // using TypeScript instead
    'no-console': 'warn',
    'semi': ['error', 'always'],
    'quotes': ['error', 'single']
  }
};
