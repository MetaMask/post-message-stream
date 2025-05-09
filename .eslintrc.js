module.exports = {
  root: true,

  extends: ['@metamask/eslint-config'],

  rules: {
    'jsdoc/newline-after-description': 'off',
    'jsdoc/tag-lines': [
      'error',
      'any',
      {
        startLines: 1,
      },
    ],
  },

  overrides: [
    {
      files: ['*.ts'],
      extends: ['@metamask/eslint-config-typescript'],
      rules: {
        '@typescript-eslint/consistent-type-definitions': 'off',
      },
    },

    {
      files: ['*.js'],
      parserOptions: {
        sourceType: 'script',
      },
      extends: ['@metamask/eslint-config-nodejs'],
    },

    {
      files: ['*.test.ts', '*.test.js'],
      extends: ['@metamask/eslint-config-jest'],
    },
  ],

  ignorePatterns: ['!.eslintrc.js', 'dist/', 'dist-test/', 'docs/'],
};
