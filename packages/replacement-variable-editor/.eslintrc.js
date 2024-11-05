module.exports = {
	root: true,
	"extends": [
		"yoast",
	],
	settings: {
		react: {
			version: "detect",
		},
	},
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: "module",
	},
	rules: {
		"no-prototype-builtins": 0,
		"comma-dangle": [
			"error",
			{
				arrays: "always-multiline",
				objects: "always-multiline",
				imports: "always-multiline",
				exports: "always-multiline",
				functions: "never",
			},
		],
		"import/no-unresolved": [
			"error",
			{
				ignore: [ "^@yoast/(components|helpers|style-guide)" ],
			},
		],
	},
	overrides: [
		{
			files: [ "tests/**/*.js" ],
			env: {
				jest: true,
			},
			rules: {
				"no-restricted-imports": 0,
			},
		},
		{
			files: [ "**/*.js" ],
			rules: {
				"react/jsx-no-bind": 1,
				"react/require-default-props": 1,
			},
		},
	],
};
