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
		"import/no-unresolved": [
			"error",
			{
				ignore: [
					// Ignore UI library and schema-blocks, or we have to build the code before linting.
					// Because `main` in `package.json` points to the `build/index.js` (in the UI library), which is not present before building.
					// As we are dealing with our source, not the actual NPM download, due to the monorepo setup.
					"^@yoast/(ui-library|schema-blocks|style-guide|components|helpers|search-metadata-previews|social-metadata-forms|replacement-variable-editor|semrush|analysis-report|feature-flag)$",
				],
			},
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
