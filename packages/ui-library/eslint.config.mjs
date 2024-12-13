import globals from "globals";
import yoastConfig, { reactConfig } from "eslint-config-yoast";

/** @type {import('eslint').Linter.Config[]} */
export default [
	{ ignores: [ "build", "storybook-static" ] },
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
			"template-curly-spacing": [
				"error",
				"always",
			],

			// Deviate from the Yoast config to allow use of short-circuit and ternary expressions to call functions with side effects, like setState.
			"no-unused-expressions": [
				"error",
				{
					allowShortCircuit: true,
					allowTernary: true,
				},
			],

			// Deviate from the Yoast config to force spacing before async arrow function parentheses.
			"space-before-function-paren": [
				"error",
				{
					anonymous: "never",
					named: "never",
					asyncArrow: "always",
				},
			],

			// Deviate from the Yoast config to allow for not using the error that is caught.
			"no-unused-vars": [ "error", { caughtErrors: "none" } ],
		},
	},
	{
		files: [ "src/**/stories.*" ],
		rules: {
			"no-unused-vars": "off",
			"require-jsdoc": "off",
			"valid-jsdoc": "off",
			"react/prop-types": "off",
		},
	},
	{
		files: [ "*.config.*", "scripts/**", ".storybook/**" ],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	},
];
