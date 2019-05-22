module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
        es6: true
    },
    extends: [
      'plugin:vue/recommended',
      'eslint:recommended',
      'standard'
    ],
    globals: {
        describe: false,
        it: false,
    },
    rules: {
        'vue/multiline-html-element-content-newline': 'off',
        'vue/singleline-html-element-content-newline': 'off',
        'vue/max-attributes-per-line': 'off',
        'comma-dangle': ['error', {
            'arrays': 'always-multiline',
            'objects': 'always-multiline',
            'imports': 'always-multiline',
            'exports': 'always-multiline',
            'functions': 'always-multiline',
        }],
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
}