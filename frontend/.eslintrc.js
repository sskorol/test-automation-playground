module.exports = {
    extends: ['react-app', 'eslint:recommended', 'plugin:react/recommended', 'prettier'],
    plugins: ['babel'],
    parser: 'babel-eslint',
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        node: true
    },
    rules: {
        'comma-dangle': ['error', 'never'],
        indent: ['error', 4, { flatTernaryExpressions: true, SwitchCase: 1 }],
        'linebreak-style': ['error', 'unix'],
        'no-unused-vars': ['warn'],
        'no-console': 'warn',
        'no-redeclare': 'warn',
        quotes: ['error', 'single', { avoidEscape: true }],
        semi: ['error', 'always'],
        'react/prop-types': 0
    },
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 6,
        ecmaFeatures: { jsx: true }
    },
    globals: { React: true }
};
