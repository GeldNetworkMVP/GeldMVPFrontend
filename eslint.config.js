// @ts-check
const eslint = require("@eslint/js");
const angular = require("angular-eslint");
const perfectionist = require("eslint-plugin-perfectionist");
const tailwind = require("eslint-plugin-tailwindcss");
const tseslint = require("typescript-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  },
  {
    plugins: {
      perfectionist,
    },
    rules: {
      "perfectionist/sort-imports": [
        "error",
        {
          internalPattern: [
            "~/**",
            "@app/*",
            "@assets/*",
            "@features/*",
            "@shared/*",
            "@environments/*",
          ],
          customGroups: {
            value: {
              app: ["@app/**"],
              assets: ["@assets/**"],
              features: ["@features/**"],
              shared: ["@shared/**"],
              environments: ["@environments/**"],
            },
            type: {
              app: ["@app/**"],
              assets: ["@assets/**"],
              features: ["@features/**"],
              shared: ["@shared/**"],
              environments: ["@environments/**"],
            },
          },
          groups: [
            "type",
            ["builtin", "external"],
            "app",
            "environments",
            "assets",
            "features",
            "shared",
            "internal-type",
            "internal",
            ["parent-type", "sibling-type", "index-type"],
            ["parent", "sibling", "index"],
            "object",
            "unknown",
          ],
        },
      ],
    },
  },
  ...tailwind.configs['flat/recommended'],
  {
    rules: {
      'tailwindcss/no-custom-classname': 'off',
    }
  }
);
