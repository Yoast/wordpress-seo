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

			// Deviate from the yoast config to allow existing usages of .bind in React components and unused state. New cases are still prohibited.
			"react/jsx-no-bind": "warn",
			"react/no-unused-state": "warn",
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
