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
		"import/no-unresolved": [
			"error",
			{
				ignore: [ "^@yoast/(components|helpers|replacement-variable-editor|style-guide)" ],
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
				"no-restricted-imports": "off",
			},
		},
	],
};
