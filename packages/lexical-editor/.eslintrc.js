module.exports = {
	root: true,
	"extends": [
		"yoast",
	],
	parser: "@babel/eslint-parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},
	plugins: [
		"@babel",
	],
	settings: {
		react: {
			version: "detect",
		},
	},
	rules: {
		"no-unused-expressions": [
			"error",
			{
				allowShortCircuit: true,
				allowTernary: true,
			},
		],
		"react/prop-types": "off",
		"space-unary-ops": [
			"error",
			{
				words: true,
				nonwords: false,
				overrides: {
					"!": true,
					"!!": true,
				},
			},
		],
		"space-before-function-paren": [
			"error",
			{
				anonymous: "never",
				named: "never",
				asyncArrow: "always",
			},
		],
		"template-curly-spacing": [
			"error",
			"always",
		],
	},
};
