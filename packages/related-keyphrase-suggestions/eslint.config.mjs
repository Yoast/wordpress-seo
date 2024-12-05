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
				...globals.builtin,
				...globals.browser,
			},
		},
		rules: {
			// Deviate from the Yoast config to allow use of short-circuit and ternary expressions to call functions with side effects, like setState.
			"no-unused-expressions": [
				"error",
				{
					allowShortCircuit: true,
					allowTernary: true,
				},
			],

			// Deviate from the Yoast config to force spacing before async arrow function parentheses.
			"stylistic/space-before-function-paren": [
				"error",
				{
					anonymous: "never",
					named: "never",
					asyncArrow: "always",
				},
			],
		},
	},
	{
		files: [ "*.config.js", "scripts/**", ".storybook/**" ],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	},
];
