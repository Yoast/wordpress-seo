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
	parser: "@babel/eslint-parser",
	parserOptions: {
		ecmaVersion: 2019,
		sourceType: "module",
	},
	plugins: [
		"@babel",
		"jest",
	],
	env: {
		"jest/globals": true,
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
	},
	overrides: [
		{
			files: [ "**/*.js" ],
			rules: {
				// Custom rules: only for temporary exceptions that should be removed over time
				camelcase: 1,
				complexity: [ 1, 6 ],
				"brace-style": 1,
				"max-statements": 1,
				"max-len": [
					"error",
					{
						code: 150,
						ignoreStrings: true,
						ignoreTemplateLiterals: true,
						ignorePattern: "[\t]*<path [\\w\\W]*/>\n",
					},
				],
				"no-shadow": 1,
				"require-jsdoc": 1,
				"react/jsx-no-bind": 1,
				"react/jsx-no-target-blank": 1,
				"react/no-access-state-in-setstate": 1,
				"react/no-deprecated": 1,
				"react/no-unused-prop-types": 1,
				"react/prop-types": 1,
				"react/require-default-props": 1,
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

				// Disabled rules
				// In the editor, we're using the pragma `wp.element.createElement`
				"react/react-in-jsx-scope": 0,
			},

		},
		{
			files: [ "tests/**/*.js" ],
			rules: {
				"no-restricted-imports": 0,
				"no-undefined": 0,
				"react/display-name": 0,
			},
		},
	],
};
