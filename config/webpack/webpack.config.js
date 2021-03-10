const CaseSensitivePathsPlugin = require( "case-sensitive-paths-webpack-plugin" );
const path = require( "path" );
const mapValues = require( "lodash/mapValues" );
const isString = require( "lodash/isString" );

const paths = require( "./paths" );
const BundleAnalyzerPlugin = require( "webpack-bundle-analyzer" ).BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require( "mini-css-extract-plugin" );

const { externals, yoastExternals, wordpressExternals } = require( './externals' );
const { YOAST_PACKAGE_NAMESPACE } = require( './externals' );

const root = path.join( __dirname, "../../" );
const mainEntry = mapValues( paths.entry, entry => {
	if ( ! isString( entry ) ) {
		return entry;
	}

	return path.join( paths.jsSrc, entry );
} );

const defaultAllowedHosts = [
	"local.wordpress.test",
	"one.wordpress.test",
	"two.wordpress.test",
	"build.wordpress-develop.test",
	"src.wordpress-develop.test",
	"basic.wordpress.test",
];

let bundleAnalyzerPort = 8888;

/**
 * Creates a new bundle analyzer on a unique port number.
 *
 * @returns {BundleAnalyzerPlugin} bundle analyzer.
 */
function createBundleAnalyzer() {
	return new BundleAnalyzerPlugin( {
		analyzerPort: bundleAnalyzerPort++,
		statsOptions: {
			excludeModules: ( module ) => {
				module = module + "";

				let exclude = false;

				// The webpack dev server requires these, so exclude them:
				[
					"sockjs-client/dist",
					"html-entities/lib",
					"url/url.js",
					"loglevel/lib",
					"punycode/punycode.js",
					"localhost:8080",
					"ansi-html",
					"events/events.js",
					"querystring-es3",
					"client/overlay.js",
				].forEach( ( dep ) => {
					if ( module.includes( dep ) ) {
						exclude = true;
					}
				} );

				return exclude;
			},
		},
	} );
}

/**
 * Adds a bundle analyzer to a list of webpack plugins.
 *
 * @param {Array} plugins Current list of plugins.
 * @returns {Array} List of plugins including the webpack bundle analyzer.
 */
function addBundleAnalyzer( plugins ) {
	if ( process.env.BUNDLE_ANALYZER ) {
		return [ ...plugins, createBundleAnalyzer() ];
	}

	return plugins;
}

module.exports = function( env ) {
	if ( ! env ) {
		env = {};
	}
	if ( ! env.environment ) {
		env.environment = process.env.NODE_ENV || "production";
	}
	if ( ! env.pluginVersion ) {
		// eslint-disable-next-line global-require
		env.pluginVersion = require( root + "package.json" ).yoast.pluginVersion;
	}

	const pluginVersionSlug = paths.flattenVersionForFile( env.pluginVersion );

	// Allowed hosts is space separated string. Example usage: ALLOWED_HOSTS="first.allowed.host second.allowed.host"
	let allowedHosts = ( process.env.ALLOWED_HOSTS || "" ).split( " " );
	// The above will result in an array with an empty string if the environment variable is not set, which is undesired.
	allowedHosts = allowedHosts.filter( el => el );
	// Prepend the default allowed hosts.
	allowedHosts = defaultAllowedHosts.concat( allowedHosts );

	const outputFilename = "[name]-" + pluginVersionSlug + ".js";

	const plugins = [
		new CaseSensitivePathsPlugin(),
		new MiniCssExtractPlugin(
			{
				filename: "css/dist/monorepo-" + pluginVersionSlug + ".css",
			}
		),
	];

	const base = {
		mode: env.environment,
		watch: env.watch,
		devtool: env.environment === "development" ? "cheap-module-eval-source-map" : false,
		context: root,
		output: {
			path: paths.jsDist,
			filename: outputFilename,
			jsonpFunction: "yoastWebpackJsonp",
		},
		resolve: {
			extensions: [ ".json", ".js", ".jsx" ],
			symlinks: false,
		},
		module: {
			rules: [
				{
					test: /.jsx?$/,
					exclude: /node_modules[/\\](?!(yoast-components|gutenberg|yoastseo|@wordpress|@yoast|parse5)[/\\]).*/,
					use: [
						{
							loader: "babel-loader",
							options: {
								cacheDirectory: true,
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
					test: /\.css$/,
					use: [
						MiniCssExtractPlugin.loader,
						"css-loader",
					],
				},
			],
		},
		externals,
		optimization: {
			runtimeChunk: {
				name: "commons",
			},
		},
	};

	const config = [
		{
			...base,
			entry: {
				...mainEntry,
				"styled-components": path.join( paths.jsSrc, "externals/styled-components.js" ),
				redux: path.join( paths.jsSrc, "externals/redux.js" ),
				jed: path.join( paths.jsSrc, "externals/jed.js" ),
				"draft-js": path.join( paths.jsSrc, "externals/draft-js.js" ),
			},
			externals: {
				...externals,
				...yoastExternals,
				...wordpressExternals,
			},
			plugins: addBundleAnalyzer( [
				...plugins,
			] ),
		},

		// Config for files that should not use any externals at all.
		{
			...base,
			output: {
				path: paths.jsDist,
				filename: "[name]-" + pluginVersionSlug + ".js",
				jsonpFunction: "yoastWebpackJsonp",
			},
			entry: {
				"babel-polyfill": path.join( paths.jsSrc, "externals/babel-polyfill.js" ),
			},
			plugins: addBundleAnalyzer( plugins ),
			optimization: {
				runtimeChunk: false,
			},
		},
		// Config for the analysis web worker.
		{
			...base,
			externals: {},
			output: {
				path: paths.jsDist,
				filename: outputFilename,
				jsonpFunction: "yoastWebpackJsonp",
			},
			entry: {
				"analysis-worker": path.join( paths.jsSrc, "analysis-worker.js" ),
				analysis: path.join( paths.jsSrc, "externals/analysis.js" ),
			},
			plugins: addBundleAnalyzer( plugins ),
			optimization: {
				runtimeChunk: false,
			},
		},
		// Config for files that should only use externals available in the web worker context.
		{
			...base,
			externals: { yoastseo: "yoast.analysis" },
			entry: {
				"used-keywords-assessment": path.join( paths.jsSrc, "used-keywords-assessment.js" ),
			},
			plugins: addBundleAnalyzer( plugins ),
			optimization: {
				runtimeChunk: false,
			},
		},
	];

	/**
	 * Add the Yoast Externals to the config.
	 *
	 * These all need to have all -other- externals configured, but not their self.
	 */
	for (const [key, value] of Object.entries(yoastExternals)) {
		const yoastExternalsExcludingCurrent = Object.assign({}, yoastExternals);
		// Remove the current external to avoid self-reference.
		delete yoastExternalsExcludingCurrent[key];

		const packageName = key.replace( YOAST_PACKAGE_NAMESPACE, '' );

		config.push({
			...base,
			entry: {
				[packageName]: path.join( paths.jsSrc, "externals/yoast/" + packageName + ".js" ),
			},
			output: {
				path: path.resolve(),
				filename: "packages/js/dist/yoast/[name]-" + pluginVersionSlug + ".js",
				jsonpFunction: "yoastWebpackJsonp",
			},
			externals: {
				...externals,
				...yoastExternalsExcludingCurrent,
				...wordpressExternals,
			},
			plugins: addBundleAnalyzer([
				...plugins,
			]),
			optimization: {
				runtimeChunk: false,
			},
		});
	}

	if ( env.environment === "development" ) {
		config[ 0 ].devServer = {
			publicPath: "/",
			allowedHosts,
		};
	}

	return config;
};
