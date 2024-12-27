import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
export default [
	{ files: ["**/*.{js,mjs,cjs,ts}"] },
	{
		files: ["src/base/**/*.{js,mjs,cjs,ts}"],
		languageOptions: { globals: globals.browser },
	},
	{
		files: ["src/process/**/*.{js,mjs,cjs,ts}"],
		languageOptions: { globals: globals.node },
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	{
		rules: {
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					caughtErrors: "none",
				},
			],
		},
	},
];
