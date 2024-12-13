import globals from "globals";
import yoastConfig, { reactConfig } from "eslint-config-yoast";

/** @type {import('eslint').Linter.Config[]} */
export default [
	{ ignores: [ "build" ] },
	...yoastConfig,
	...reactConfig,
	{
		languageOptions: {
			ecmaVersion: "latest",
			globals: {
				...globals.browser,
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

			// Deviate from the Yoast config to allow existing violations. New occurrences are still disallowed.
			"react/jsx-no-bind": "warn",
		},
	},
	{
		files: [ "*.config.js", "tools/jest/**" ],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	},
];
