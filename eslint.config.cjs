const eslint = require('@eslint/js');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tseslintParser = require('@typescript-eslint/parser');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  eslint.configs.recommended,
  {
    files: ['**/*.{ts,js}'],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        project: ['./tsconfig.json', './knexfile.ts'],
        tsconfigRootDir: __dirname,
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        require: 'readonly',
        module: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs['recommended'].rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-require-imports': 'warn',
      'no-undef': 'off',
    },
  },
  {
    files: ['**/*.js', '**/*.cjs'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        require: 'readonly',
        module: 'readonly',
      },
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  prettierConfig,
];