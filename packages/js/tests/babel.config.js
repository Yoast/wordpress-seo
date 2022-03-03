/*
 * This Babel configuration is needed for ESLint to be able to parse the
 * test and source code files.
 */
module.exports = {
	presets: [
		"@wordpress/babel-preset-default",
	],
	env: {
		test: {
			plugins: [
				"babel-plugin-styled-components",
			],
		},
	},
};
