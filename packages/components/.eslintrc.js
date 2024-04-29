module.exports = {
	root: true,
	"extends": [
		"yoast",
	],
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: "module",
	},
	settings: {
		react: {
			version: "detect",
		},
	},
	rules: {
		"comma-dangle": "off",
		"react/jsx-no-bind": 1,
		"react/require-default-props": 1,
		"react/default-props-match-prop-types": 1,
		"react/no-unused-prop-types": 1,
		"require-jsdoc": 1,
		"import/no-unresolved": [ "error", { ignore: [ "^@yoast/(helpers|style-guide)" ] } ],
	},
	overrides: [
		{
			files: [ "tests/**/*.js" ],
			env: {
				jest: true,
			},
			rules: {
				"no-restricted-imports": "off",
				"no-console": 0,
				"react/jsx-no-bind": 0,
			},
		},
	],
};
