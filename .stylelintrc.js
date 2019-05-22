
module.exports = {
  "extends": [
    "stylelint-config-standard",
    "stylelint-config-css-modules",
    "stylelint-config-rational-order"
  ],
  "plugins": ["stylelint-order", "stylelint-declaration-block-no-ignored-properties"],
  "rules": {
    "comment-empty-line-before": null,
    "declaration-empty-line-before": null,
    "no-descending-specificity": null,
    "plugin/declaration-block-no-ignored-properties": true,
  },
  "ignoreFiles": [
  ]
}
