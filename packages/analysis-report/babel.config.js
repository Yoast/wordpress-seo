module.exports = {
	presets: [ "@yoast/babel-preset" ],
	env: {
		test: {
			plugins: [
				"babel-plugin-styled-components",
			],
		},
	},
	sourceMaps: ( process.env.NODE_ENV !== "production" ),
};
