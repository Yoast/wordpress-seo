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
				ignore: [ "^@yoast/(components|replacement-variable-editor|social-metadata-forms|style-guide)" ],
			},
		],
	},
	overrides: [
		{
			files: [ "tests/**/*.js" ],
			env: {
				jest: true,
			},
		},
	],
};
