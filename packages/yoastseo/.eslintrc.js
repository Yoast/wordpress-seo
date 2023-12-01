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
	// The Yoast eslint config requires setting up the React version.
	settings: {
		react: {
			version: "detect",
		},
	},
	rules: {
		complexity: [ "error", 10 ],
		"no-new": "off",
		"max-len": "off",
		"max-statements": "off",
		"new-cap": "off",
		"no-redeclare": "off",
		"no-shadow": [ "warn", { builtinGlobals: false, hoist: "all", allow: [] } ],
		"require-jsdoc": [ "warn", {
			require: {
				MethodDefinition: true,
				ClassDeclaration: true,
				ArrowFunctionExpression: false,
				FunctionExpression: true },
		} ],
		"no-useless-escape": "warn",
		// Disabling the default `comma-dangle` rule from Yoast.
		// The `comma-dangle` rule is also deprecated, and it is recommended to use the `@stylistic` plugin.
		"comma-dangle": "off",
		// Stylistic rules (https://eslint.style/packages/default)
		"@stylistic/comma-dangle": [ "error", {
			arrays: "always-multiline",
			objects: "always-multiline",
			imports: "always-multiline",
			exports: "always-multiline",
			functions: "never",
		} ],
		// Import rules (https://github.com/import-js/eslint-plugin-import)
		"import/default": "off",
		"import/namespace": "off",
		"import/no-named-as-default": "off",
		"import/no-named-as-default-member": "off",
	},
};
