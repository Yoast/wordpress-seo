module.exports = {
	root: true,
	"extends": [
		"yoast",
	],
	env: {
		amd: true,
		browser: true,
		es6: true,
		jquery: true,
		node: true,
		jest: true,
	},
	plugins: [
		"@stylistic",
	],
	parserOptions: {
		ecmaVersion: 2019,
		sourceType: "module",
	},
	// The Yoast eslint config requires setting up the React version.
	settings: {
		react: {
			version: "detect",
		},
		"import/core-modules": [ "yoastseo" ],
	},
	rules: {
		complexity: [ "warn", 10 ],
		"no-new": "off",
		"max-statements": "off",
		"new-cap": "off",
		"no-redeclare": "off",
		"no-prototype-builtins": "off",
		// Longer grace period for Yoast config.
		"no-shadow": [ "warn", { builtinGlobals: false, hoist: "all", allow: [] } ],
		"require-jsdoc": [ "warn",
			{ require: {
				MethodDefinition: true,
				ClassDeclaration: true,
				ArrowFunctionExpression: false,
				FunctionExpression: true },
			} ],
		"no-useless-backreference": "warn",
		"no-useless-catch": "off",
		"no-useless-escape": "warn",
		// Disabling the default `comma-dangle` and `max-len` rule from Yoast.
		// The `comma-dangle` and `max-len` rules are also deprecated, and it is recommended to use the `@stylistic` plugin.
		"comma-dangle": "off",
		"max-len": "off",
		// Stylistic rules (https://eslint.style/packages/default)
		"@stylistic/comma-dangle": [ "error", {
			arrays: "always-multiline",
			objects: "always-multiline",
			imports: "always-multiline",
			exports: "always-multiline",
			functions: "never",
		} ],
		"@stylistic/max-len": [ "error", {
			code: 150,
			tabWidth: 4,
			ignoreComments: true,
			ignoreStrings: true,
			ignoreRegExpLiterals: true,
		} ],
		// Import rules (https://github.com/import-js/eslint-plugin-import)
		"import/default": "off",
		"import/namespace": "off",
		"import/no-named-as-default": "off",
		"import/no-named-as-default-member": "off",
		"import/no-extraneous-dependencies": "off",
		"import/no-unresolved": [ "error", { ignore: [ "premium-configuration/data/morphologyData", "@yoast/feature-flag", "yoastseo" ] } ],
	},
};
