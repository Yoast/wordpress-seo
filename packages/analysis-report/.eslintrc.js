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
				complexity: [ 1, 6 ],
				// A wrapping label is not necessary when there already is an htmlFor attribute.
				"jsx-a11y/label-has-for": [ "error", { required: "id" } ],
				"require-jsdoc": 1,
				"react/button-has-type": 1,
				"react/default-props-match-prop-types": 1,
				"react/no-unused-prop-types": 1,
				"react/no-access-state-in-setstate": 1,
				"react/no-unused-state": 1,
				"react/jsx-no-bind": 1,
				"react/jsx-no-target-blank": 1,
				"react/require-default-props": 1,
				"react/forbid-foreign-prop-types": 1,
			},
		},
	],
};
