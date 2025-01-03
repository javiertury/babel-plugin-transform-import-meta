import love from "eslint-config-love";

export default [
  love,
  {
    files: ['**/*.cjs', '**/*.mjs', '**/*.js', '**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['eslint.config.js', 'eslint.config.mjs', '*.js', '*.mjs'],
          defaultProject: './tsconfig.json',
        },
      },
    },
    rules: {
      "no-console": [
        "error",
        {
          allow: ["error", "warn"],
        },
      ],
      "prefer-destructuring": "off",
      "no-magic-numbers": "off",
      "@typescript-eslint/strict-boolean-expressions": [
        "error",
        {
          allowString: true,
          allowNumber: true,
          allowNullableObject: true,
        },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-dynamic-delete": "off",
      "@typescript-eslint/prefer-destructuring": "off",
      "@typescript-eslint/no-magic-numbers": "off"
    },
  },
  {
    ignores: ["lib/*"],
  },
];
