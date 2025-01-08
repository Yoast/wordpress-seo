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
			// Account for webpack externals and potentially unbuilt packages in the monorepo setup.
			"import/no-unresolved": [
				"error",
				{
					ignore: [
						// Ignore @yoast packages from this workspace, or we have to build the code before linting.
						// Because `main` in `package.json` points to the `build/index.js`, which is not present before building.
						// As we are dealing with our source, not the actual NPM download, due to the monorepo setup.
						"^@yoast/(ui-library|style-guide|components|helpers|search-metadata-previews|social-metadata-forms|replacement-variable-editor|analysis-report|feature-flag|related-keyphrase-suggestions)$",
						"yoastseo",
					],
				},
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
			"stylistic/space-before-function-paren": [
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
		files: [ "*.config.js", "scripts/**", ".storybook/**" ],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	},
];
