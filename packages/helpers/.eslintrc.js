module.exports = {
	root: true,
	"extends": [
		"yoast",
	],
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},
	settings: {
		react: {
			version: "detect",
		},
	},
	rules: {
		"comma-dangle": "off",
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
