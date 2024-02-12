module.exports = {
  root: true,
  extends: ['plugin:react/recommended', 'plugin:@next/next/recommended' ],
  ignorePatterns: ['**/payload-types.ts'],
  // plugins: ['prettier'],
  settings: {
    react: {
      version: '18.2.0',
    },
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true
    },
    // moduleResolution: 'node'
    sourceType: 'module'
  },
  rules: {
    // 'comma-dangle': [2, 'never'],
    'dot-location': [2, 'property'],
    eqeqeq: 2,
    'import/order': 0, // Disable import order rule
    indent: 0,
    'linebreak-style': 0,
    'no-console': 0,
    'no-implicit-coercion': 2,
    'no-loop-func': 2,
    'no-new-wrappers': 2,
    'no-octal': 2,
    'no-param-reassign': [1, { props: false }],
    'no-redeclare': 2,
    'no-regex-spaces': 0,
    'no-undefined': 2,
    'no-unused-vars': 2,
    radix: 2,
    semi: [2, 'always'],
    'guard-for-in': 2,
    'prefer-const': 1,
    'prefer-arrow-callback': 1,
    'react/display-name': 0,
    'react/jsx-key': 2,
    'react/jsx-no-bind': 1,
    'react/jsx-no-duplicate-props': 2,
    'react/jsx-no-undef': 2,
    // 'react/jsx-quotes': [2, 'double'],
    'react/jsx-uses-vars': 2,
    'react/jsx-uses-react': 'error',
    'react/no-did-update-set-state': 2,
    'react/no-unknown-property': 2,
    'react/prop-types': 1,
    'simple-import-sorts': 0,
    'sort-imports': 0,
  },
};
