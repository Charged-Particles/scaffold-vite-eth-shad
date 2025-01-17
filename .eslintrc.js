module.exports = {
  globals: {
    __PATH_PREFIX__: 'readonly',
    process: 'readonly',
    require: 'readonly',
    __dirname: 'readonly',
    path: 'readonly',
    _: 'readonly',
  },
  env: {
    'browser': true,
    'node': true,
    'es2022': true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'google',
  ],
  parserOptions: {
    'ecmaFeatures': {
      'jsx': true,
    },
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'max-len': 0,
    'key-spacing': 0,
    'no-multi-spaces': 0,
    'require-jsdoc': 0,
    'react/prop-types': 0,
    'space-in-parens': 0,
    'new-cap': 0,
    'one-var': 0,
    'react/display-name': 0,
    'no-constant-condition': 0,
    'no-unused-vars': 'warn',
    'indent': [
      'error',
      2,
      { 'SwitchCase': 1 },
    ],
    'block-spacing': [
      'error',
      'always',
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    'quotes': [
      'warn',
      'single',
    ],
    'quote-props': [
      'error',
      'as-needed',
      { 'unnecessary': false },
    ],
    'semi': [
      'error',
      'always',
    ],
    'brace-style': [
      'error',
      '1tbs',
      { 'allowSingleLine': true },
    ],
    'operator-linebreak': [
      'error',
      'before',
    ],
    'object-curly-spacing': [
      'error',
      'always',
      { 'objectsInObjects': true },
    ],
    'arrow-parens': [
      'error',
      'as-needed',
      { 'requireForBlockBody': true },
    ],
    'array-bracket-spacing': [
      'error',
      'always',
      {
        'singleValue': true,
        'objectsInArrays': false,
        'arraysInArrays': false,
      },
    ],
  },
  settings: {
    'react': {
      'createClass': 'createReactClass',
      'pragma': 'React',
      'fragment': 'Fragment',
      'version': 'detect',
      'flowVersion': '0.53',
    },
    'propWrapperFunctions': [
      'forbidExtraProps',
      { 'property': 'freeze', 'object': 'Object' },
      { 'property': 'myFavoriteWrapper' },
      { 'property': 'forbidExtraProps', 'exact': true },
    ],
    'componentWrapperFunctions': [
      'observer',
      { 'property': 'styled' },
      { 'property': 'observer', 'object': 'Mobx' },
      { 'property': 'observer', 'object': '<pragma>' },
    ],
    'formComponents': [
      'CustomForm',
      { 'name': 'Form', 'formAttribute': 'endpoint' },
    ],
    'linkComponents': [
      'Hyperlink',
      { 'name': 'Link', 'linkAttribute': 'to' },
    ],
  },
};
