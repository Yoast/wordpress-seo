const webpack = require( "webpack" );
const HtmlWebpackPlugin = require( "html-webpack-plugin" );
const path = require( "path" );

module.exports = {
	plugins: [
		new webpack.ProvidePlugin({
			process: 'process/browser',
		}),
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'src/index.html'),
			filename: 'index.html',
		}),
	],
	devServer: {
		static: {
			directory: path.join(__dirname, 'dist'),
		},
		compress: true,
		port: 8999,
		watchFiles: [ 'src/index.html' ],
	},
}
