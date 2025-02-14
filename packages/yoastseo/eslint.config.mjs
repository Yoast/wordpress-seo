import globals from "globals";
import yoastConfig from "eslint-config-yoast";

/** @type {import('eslint').Linter.Config[]} */
export default [
	{ ignores: [ "build", "vendor", "examples" ] },
	...yoastConfig,
	{
		languageOptions: {
			ecmaVersion: "latest",
			globals: {
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
						// Ignore imports from premium-configuration, which might not be available in all environments.
						"premium-configuration/data/morphologyData",
					],
				},
			],

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

			// Deviate from the Yoast config to ignore RegExp literals.
			"stylistic/max-len": [
				"error",
				{
					code: 150,
					tabWidth: 4,
					ignoreComments: true,
					ignoreStrings: true,
					ignoreRegExpLiterals: true,
				},
			],

			// Deviate from the Yoast config to allow existing violations. New occurrences are still disallowed.
			"no-useless-backreference": "warn",
			"no-prototype-builtins": "warn",

			// Deviate from the Yoast config to allow default imports that share the name of a named export.
			// We sometimes export a value as both a named export and a default export.
			"import/no-named-as-default": "off",

			// Deviate from the Yoast config to allow for not using the error that is caught.
			"no-unused-vars": [ "error", { caughtErrors: "none" } ],
		},
	},
	{
		files: [ "src/languageProcessing/**" ],
		settings: {
			"import/core-modules": [ "yoastseo" ],
		},
	},
	{
		// Enable node globals for the singleton script, as it is the only file that accounts for a Node environment as a fallback.
		files: [ "src/helpers/shortlinker/singleton.js" ],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	},
	{
		// Enable worker globals for worker scripts.
		files: [ "src/worker/**" ],
		languageOptions: {
			globals: {
				...globals.worker,
			},
		},
	},
	{
		// Enable browser globals for the createWorker script, which is not a worker itself.
		files: [ "src/worker/createWorker.js" ],
		languageOptions: {
			globals: {
				...globals.browser,
			},
		},
	},
	{
		files: [ "spec/**" ],
		rules: {
			"max-statements": "off",
			// Deviate from the Yoast config to allow access properties from the default export that share a name with a named export.
			// We sometimes export a value as both a named export and a default export that represents all the named exports as a single object.
			// We exclusively do this in test, so we can keep this rule enabled in src.
			"import/no-named-as-default-member": "off",
		},
	},
	{
		files: [ "Gruntfile.js", "grunt/**", "babel.config.js", "premium-configuration/**" ],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	},
];
