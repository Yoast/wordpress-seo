import globals from "globals";
import yoastConfig from "@yoast/eslint-config";

/** @type {import('eslint').Linter.Config[]} */
export default [
	...yoastConfig,
	{
		languageOptions: {
			ecmaVersion: "latest",
			globals: {
				...globals.node,
			},
		},
		rules: {
			// Deviate from the Yoast config to prohibit dangling commas in functions.
			"stylistic/comma-dangle": [
				"error",
				{
					functions: "never",
					arrays: "always-multiline",
					objects: "always-multiline",
					imports: "always-multiline",
					exports: "always-multiline",
				},
			],
		},
	},
	{
		files: [ "*.config.*" ],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	},
];
