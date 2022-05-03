// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard',
  ],
  // required to lint *.vue files
  plugins: ['vue'],
  globals: {
    messageBox: true,
    eventlog: true,
  },
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    semi: [2, 'always'],
    //enforce consistent spacing before opening parenthesis in function definitions
    'space-before-function-paren': 'off',
    // enforce consistent spacing before opening parenthesis in function definitions - Removed
    'space-before-function-parentheses': 'off',
    // enforce consistent spacing inside parentheses
    'space-in-parens': 'off',
    'no-extend-native': 'off',
    'no-useless-escape': 'off',
    'no-extra-parens': 'off',
    'handle-callback-err': 'off',
    yoda: 'off',
    'no-unused-vars': ['error', { varsIgnorePattern: 'scope', argsIgnorePattern: 'scope' }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'prettier/prettier': [
      {
        printWidth: 350,
      },
    ],
  },
};
