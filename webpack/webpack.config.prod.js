const webpack = require( "webpack" );
const path = require( "path" );
const CopyWebpackPlugin = require( "copy-webpack-plugin" );
const UnminifiedWebpackPlugin = require( "unminified-webpack-plugin" );

const paths = require( "./paths" );

const pluginVersion = "5.0.2";

const versionParts = pluginVersion.split( "." );
if ( versionParts.length === 2 ) {
	versionParts.push( 0 );
}

const pluginVersionSlug = versionParts.join( "" );

const PLUGINS = [
	new CopyWebpackPlugin( [ {
		from: path.resolve( paths.select2, "js", "select2.full.min.js" ),
		/* Copies to {output.path}/select2 */
		to: "select2",
	}, {
		context: path.resolve( paths.select2, "js", "i18n" ),
		from: "*.js",
		to: path.resolve( paths.jsDist, "select2", "i18n" ),
	}, {
		from: path.resolve( paths.select2, "css", "select2.min.css" ),
		to: path.resolve( paths.cssDist, "select2" ),
	} ], {
		ignore: [ "*.txt" ],
	} ),
	new webpack.DefinePlugin( {
		"process.env": {
			NODE_ENV: JSON.stringify( "production" ),
		},
	} ),
	new webpack.optimize.UglifyJsPlugin(),
	new UnminifiedWebpackPlugin(),
	new webpack.optimize.AggressiveMergingPlugin(),
];

let outputFilename = `[name]-${pluginVersionSlug}.min.js`;

module.exports = {
	devtool: "cheap-module-source-map",
	entry: paths.entry,
	context: paths.jsSrc,
	output: {
		path: paths.jsDist,
		filename: outputFilename,
	},
	resolve: {
		extensions: [ ".js", ".jsx" ],
	},
	module: {
		rules: [
			{
				test: /.jsx?$/,
				use: [
					{
						loader: "babel-loader",
					},
				],
			},
		],
	},
	plugins: PLUGINS,
};


