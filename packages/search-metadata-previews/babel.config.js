module.exports = {
	presets: [
		[
			"@babel/preset-env",
			{
				targets: {
					browsers: [ "extends @yoast/browserslist-config" ],
				},
			},
		],
		"@babel/preset-react",
	],
	plugins: [
		"babel-plugin-styled-components",
		"@babel/plugin-transform-react-jsx",
	],
};
