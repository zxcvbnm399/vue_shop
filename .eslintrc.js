/*
 * "off"或者0，不启用这个规则
 * "warn"或者1，出现问题会有警告
 * "error"或者2，出现问题会报错
 */


module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],

  parserOptions: {
    parser: 'babel-eslint'
  },

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'space-before-function-paren': 0,
    'space-before-blocks': 0,
    'vue/no-unused-vars': 'off',
    // EXPECTED INDENTATION OF 4 SPACES BUT FOUND 6 “错误的解决
    'space-before-function-paren': 0,
    'indent': 'off'
  },

  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ]
}