const path = require( "path" );
const webpack = require("webpack");

const PORT = 3333;

module.exports = {
	entry: [
		// Activate HMR for React
		"react-hot-loader/patch",

		// Bundle the client for webpack-dev-server
		// And connect to the provided endpoint
		`webpack-dev-server/client?http://localhost:${PORT}`,

		// Bundle the client for hot reloading
		// 'Only-' means to only hot reload for successful updates
		"webpack/hot/only-dev-server",

		"./render.js",
	],
	output: {
		path: path.resolve( __dirname ),
		filename: "index.js",
	},
	devServer: {
		inline: true,
		port: PORT,
		historyApiFallback: true,
		hot: true,
		contentBase: "./",
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [ "babel-loader" ],
			},
			{
				test: /\.json$/,
				use: [ "json-loader" ],
			},
		],
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
	],
	resolve: {
		extensions: [ ".json", ".jsx", ".js" ],
	},
};
