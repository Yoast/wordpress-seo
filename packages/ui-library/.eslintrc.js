module.exports = {
	root: true,
	"extends": [
		"yoast",
	],
	parser: "@babel/eslint-parser",
	parserOptions: {
		ecmaVersion: 2019,
		sourceType: "module",
	},
	plugins: [
		"@babel",
	],
	rules: {
		// We use 'wp.element.createElement' instead of the 'react' package directly.
		"react/react-in-jsx-scope": "off",
		"no-restricted-imports": [
			"error",
			{
				name: "react",
				message: "Please use @wordpress/element instead. No need to import just for JSX.",
			},
			{
				name: "react-dom",
				message: "Please use @wordpress/element instead.",
			},
		],
		"no-unused-expressions": "always",
		"max-len": [
			"error",
			{
				code: 150,
				ignoreStrings: true,
				ignorePattern: "[\t]*<path [\\w\\W]*/>\n",
			},
		],
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
	overrides: [
		{
			files: [ "src/**/*.stories.js", "src/**/stories.js" ],
			rules: {
				"no-unused-vars": "off",
				"require-jsdoc": "off",
				"valid-jsdoc": "off",
				"react/prop-types": "off",
			},
		},
	],
};
