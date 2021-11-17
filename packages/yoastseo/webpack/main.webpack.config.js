const path = require( "path" );

const externals = require( "./externals/externals" );
const wordPressExternals = require( "./externals/wordpress" );

/**
 * The main Webpack configuration for building the main analysis file.
 *
 * @type {Object}
 */
module.exports = {
	entry: "./index.js",
	externals: [ externals, wordPressExternals ],
	output: {
		path: path.resolve( "dist" ),
		filename: "analysis.js",
	},
	plugins: [],
};
