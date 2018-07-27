const webpack = require( "webpack" );
const UnminifiedWebpackPlugin = require( "unminified-webpack-plugin" );
const path = require( "path" );

const paths = require( "./paths" );
const pkg = require( "../package.json" );

const pluginVersionSlug = paths.flattenVersionForFile( pkg.yoast.pluginVersion );
const outputFilename = "[name]-" + pluginVersionSlug + ".min.js";

const externals = {
	// This is necessary for Gutenberg to work.
	tinymce: "window.tinymce",

	yoastseo: "window.yoast.analysis",
};

// This makes sure the @wordpress dependencies are correctly transformed.
const wpDependencies = [
	"components",
	"element",
	"blocks",
	"utils",
	"date",
	"data",
	"editor",
	"viewport",
];

const alias = {
	// This prevents loading multiple versions of React:
	react: path.join( __dirname, "../", "node_modules/react" ),
	"react-dom": path.join( __dirname, "../", "node_modules/react-dom" ),

	// This prevents loading multiple versions of @wordpress/i18n:
	"@wordpress/i18n": path.join( __dirname, "../", "node_modules/@wordpress/i18n" ),
};

wpDependencies.forEach( wpDependency => {
	alias[ "@wordpress/" + wpDependency ] = path.join(
		__dirname,
		"../",
		"node_modules/gutenberg/" + wpDependency
	);
} );

module.exports = function( env = { environment: "production" } ) {
	const mode = env.environment;

	const config = [
		{
			devtool: "cheap-module-eval-source-map",
			entry: paths.entry,
			context: paths.jsSrc,
			output: {
				path: paths.jsDist,
				filename: outputFilename,
				jsonpFunction: "yoastWebpackJsonp",
			},
			resolve: {
				extensions: [ ".json", ".js", ".jsx" ],
				alias,
				symlinks: false,
			},
			module: {
				rules: [
					{
						test: /.jsx?$/,
						exclude: /node_modules\/(?!(yoast-components|gutenberg|yoastseo)\/).*/,
						use: [
							{
								loader: "babel-loader",
								options: {
									env: {
										development: {
											plugins: [
												"babel-plugin-styled-components",
											],
										},
									},
								},
							},
						],
					},
					{
						test: /.svg$/,
						use: [
							{
								loader: "svg-react-loader",
							},
						],
					},
					{
						test: /\.json$/,
						use: [ "json-loader" ],
					},
				],
			},
			externals,
			plugins: [
				new webpack.DefinePlugin( {
					"process.env": {
						NODE_ENV: JSON.stringify( mode ),
					},
				} ),
				new UnminifiedWebpackPlugin(),
				new webpack.optimize.UglifyJsPlugin(),
				new webpack.optimize.AggressiveMergingPlugin(),
				new webpack.optimize.CommonsChunkPlugin( {
					name: "vendor",
					filename: "commons-" + pluginVersionSlug + ".min.js",
				} ),
			],
		},
	];

	if ( mode === "development" ) {
		config[ 0 ].devServer = {
			publicPath: "/",
		};
	}

	return config;
};
