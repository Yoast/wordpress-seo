const CopyPlugin = require( "copy-webpack-plugin" );
const defaultConfig = require( "@yoast/admin-ui-toolkit/configs/webpack.js" );

module.exports = {
	...defaultConfig,
	plugins: [
		...defaultConfig.plugins,
		new CopyPlugin( {
			patterns: [
				{ from: "public/images", to: "./images" },
			],
		} ),
	],
};

