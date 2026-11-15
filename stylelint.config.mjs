export default {
    extends: ['stylelint-config-standard-scss'],

    ignoreFiles: [
        'dist/**/*.css',
        'node_modules/**',
    ],

    rules: {
        'selector-class-pattern': null,
        'selector-id-pattern': null,
        'scss/dollar-variable-pattern': null,

        'at-rule-empty-line-before': null,
        'declaration-empty-line-before': null,

        'color-function-notation': null,
        'color-function-alias-notation': null,
        'alpha-value-notation': null,

        'media-feature-range-notation': null,
        'no-empty-source': null,
    },
};