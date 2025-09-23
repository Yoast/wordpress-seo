import yoastConfig, { reactConfig } from "@yoast/eslint-config";
import storybookConfig from "eslint-plugin-storybook";
import globals from "globals";

/** @type {import("eslint").Linter.Config[]} */
export default [
	{ ignores: [ "build" ] },
	...yoastConfig,
	...reactConfig,
	{
		languageOptions: {
			ecmaVersion: "latest",
			globals: {
				...globals.browser,
				React: "readonly",
				// Webpack maps `global` to the window.
				global: false,
			},
		},
		rules: {
			// Account for webpack externals and potentially un-built packages in the monorepo setup.
			"import/no-unresolved": [
				"error",
				{
					ignore: [
						// Ignore @yoast packages from this workspace, or we have to build the code before linting.
						// Because `main` in `package.json` points to the `build/index.js`, which is not present before building.
						// As we are dealing with our source, not the actual NPM download, due to the monorepo setup.
						"@yoast/ui-library",
					],
				},
			],
			// Disabled rules
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
		},
	},
	{
		files: [ "tests/**" ],
		rules: {
			"no-undefined": "off",
		},
	},
	{
		files: [ ".storybook/**" ],
		...storybookConfig[ "flat/recommended" ],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
		settings: {
			// Ignore certain Storybook packages to avoid import/named errors.
			"import/ignore": [
				"@storybook/manager-api",
				"@storybook/theming",
			],
		},
	},
	{
		files: [ "stories/**" ],
		...storybookConfig[ "flat/recommended" ],
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
