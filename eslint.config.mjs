const rules = {
  // The original code mixed Allman and K&R braces within single files.
  'brace-style': ['error', '1tbs', {allowSingleLine: true}],
  indent: ['error', 2, {SwitchCase: 1}],
  quotes: ['error', 'single', {avoidEscape: true}],
  semi: ['error', 'always'],
  'comma-dangle': ['error', 'always-multiline'],
  'no-trailing-spaces': 'error',
  'eol-last': ['error', 'always'],
  'object-curly-spacing': ['error', 'never'],

  // This is what caught the dead `ClientFunction` import and the unused
  // `featureFlagsArgs` binding that shipped in the original config files.
  'no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
  'no-undef': 'error',
  'no-var': 'error',
  'prefer-const': 'error',
  eqeqeq: ['error', 'always'],
};

const nodeGlobals = {
  process: 'readonly',
  console: 'readonly',
  URL: 'readonly',
};

const browserGlobals = {
  document: 'readonly',
  window: 'readonly',
};

import react from 'eslint-plugin-react';

export default [
  {
    ignores: ['fixtures/app/dist/**'],
  },
  {
    // Tests, page objects, and config.
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        // TestCafe injects these into test files.
        fixture: 'readonly',
        test: 'readonly',
        ...nodeGlobals,
        ...browserGlobals,
      },
    },
    linterOptions: {reportUnusedDisableDirectives: true},
    rules,
  },
  {
    // The React fixture app. Built with the automatic JSX runtime, so there is
    // no `React` import to keep alive.
    files: ['**/*.jsx'],
    plugins: {react},
    settings: {react: {version: 'detect'}},
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {ecmaFeatures: {jsx: true}},
      globals: browserGlobals,
    },
    linterOptions: {reportUnusedDisableDirectives: true},
    rules: {
      ...rules,
      // Without this, every component referenced only inside JSX reads as
      // unused.
      'react/jsx-uses-vars': 'error',
    },
  },
];
