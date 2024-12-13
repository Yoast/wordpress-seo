import globals from "globals";
import yoastConfig from "eslint-config-yoast";

/** @type {import('eslint').Linter.Config[]} */
export default [
	{ ignores: [ "js/dist", "packages", "apps", "artifact", "vendor", "vendor_prefixed", ".yarn" ] },
	...yoastConfig,
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
		},
	},
	{
		files: [ "*.config.js", "config/**", "Gruntfile.js" ],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	},
];
