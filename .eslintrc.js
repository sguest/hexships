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
        // turn off the default rules and turn on the typescript rules for a few - the default rules cause issues with TS
        'no-use-before-define': 'off',
        'no-useless-constructor': 'off',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-use-before-define': ['error'],
        '@typescript-eslint/no-useless-constructor': ['error'],
        '@typescript-eslint/no-unused-vars': ['error'],

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
