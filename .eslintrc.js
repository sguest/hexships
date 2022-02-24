module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        'plugin:react/recommended',
        'standard',
        'plugin:react/jsx-runtime',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: [
        'react',
        'react-hooks',
        '@typescript-eslint',
    ],
    rules: {
        // causes false positives https://stackoverflow.com/a/64024916
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': ['error'],
        semi: 'off',
        'space-before-function-paren': ['error', 'never'],
        indent: ['error', 4],
        'comma-dangle': ['error', {
            arrays: 'always-multiline',
            objects: 'always-multiline',
            functions: 'always-multiline',
        }],
        'keyword-spacing': ['error', {
            after: true,
            overrides: {
                if: { after: false },
                for: { after: false },
                while: { after: false },
            },
        }],
        'eol-last': 'off',
        'brace-style': ['error', 'stroustrup'],
        'react/react-in-jsx-scope': 'off',
        'react-hooks/exhaustive-deps': 'error',
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
}
