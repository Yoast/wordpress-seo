import globals from "globals";
import yoastConfig, { reactConfig } from "eslint-config-yoast";

/** @type {import('eslint').Linter.Config[]} */
export default [
	...yoastConfig,
	...reactConfig,
	{
		languageOptions: {
			ecmaVersion: "latest",
			globals: {
				...globals.browser,
				...globals.jquery,
				// Webpack maps `global` to the window.
				global: false,
			},
		},
		rules: {
			// Account for webpack externals and potentially unbuilt packages in the monorepo setup.
			"import/no-unresolved": [
				"error",
				{
					ignore: [
						// This is our internal externals used within `packages/js`, not actually a package.
						"^@yoast/externals/(components|contexts|redux)$",
						// Externals provided by @wordpress/dependency-extraction-webpack-plugin
						"^@wordpress/(annotations|api|edit-post|sanitize)$",
						"^jquery$",
						// Ignore @yoast packages from this workspace, or we have to build the code before linting.
						// Because `main` in `package.json` points to the `build/index.js`, which is not present before building.
						// As we are dealing with our source, not the actual NPM download, due to the monorepo setup.
						"^@yoast/(ui-library|style-guide|components|helpers|search-metadata-previews|social-metadata-forms|replacement-variable-editor|analysis-report|feature-flag|related-keyphrase-suggestions)$",
						"yoastseo",
					],
				},
			],
			"no-restricted-imports": [
				"error",
				{
					name: "react",
					message: "Please use @wordpress/element instead. No need to import just for JSX.",

				},
				{
					name: "react-dom",
					message: "Please use @wordpress/element instead.",
				},
			],
			// Disabled rules
			// In the editor, we're using the pragma `wp.element.createElement`
			"react/react-in-jsx-scope": "off",

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

			// Deviate from the Yoast config to allow for not using the error that is caught.
			"no-unused-vars": [ "error", { caughtErrors: "none" } ],

			// Deviate from the Yoast config to allow longer template literals.
			"stylistic/max-len": [
				"error",
				{
					code: 150,
					ignoreStrings: true,
					ignoreTemplateLiterals: true,
					ignorePattern: "[\t]*<path [\\w\\W]*/>\n",
				},
			],

			// Deviate from the Yoast config to allow existing violations. New occurrences are still disallowed.
			complexity: [ "warn", 6 ],
			"no-shadow": "warn",
			"jsdoc/require-jsdoc": "warn",
			"react/jsx-no-bind": "warn",
			"react/no-access-state-in-setstate": "warn",
			"react/no-unused-prop-types": "warn",
			"react/prop-types": "warn",
			"react/require-default-props": "warn",
			"no-prototype-builtins": "warn",
		},
	},
	{
		files: [ "src/externals/**" ],
		languageOptions: {
			globals: {
				...globals.commonjs,
			},
		},
	},
	{
		files: [ "tests/**" ],
		rules: {
			"no-undefined": "off",
		},
	},
	// Ignore Proptypes in the dashboard.
	{
		files: [ "src/dashboard/**" ],
		rules: {
			"react/prop-types": "off",
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
