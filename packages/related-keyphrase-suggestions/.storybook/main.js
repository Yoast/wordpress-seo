import { dirname, join } from "path";

/**
 * Get the absolute path of the given value.
 *
 * @param {string} value The value to get the absolute path of.
 * @returns {string} The absolute path.
 */
function getAbsolutePath( value ) {
	return dirname( require.resolve( join( value, "package.json" ) ) );
}

const config = {
	stories: [
		"../src/**/*.stories.@(js)",
		"../src/**/stories.@(js)",
	],
	addons: [
		getAbsolutePath( "@storybook/addon-links" ),
		getAbsolutePath( "@storybook/addon-essentials" ),
		"@storybook/addon-a11y",
		{
			name: getAbsolutePath( "@storybook/addon-styling-webpack" ),
			options: {
				rules: [
					{
						test: /\.css$/,
						sideEffects: true,
						use: [
							getAbsolutePath( "style-loader" ),
							{
								loader: getAbsolutePath( "css-loader" ),
								options: { importLoaders: 1 },
							},
							{
								loader: getAbsolutePath( "postcss-loader" ),
								options: { implementation: getAbsolutePath( "postcss" ) },
							},
						],
					},
				],
			},
		},
	],
	core: {
		disableTelemetry: true,
		disableWhatsNewNotifications: true,
	},
	features: {
		previewMdx2: true,
	},
	framework: {
		name: getAbsolutePath( "@storybook/react-webpack5" ),
		options: {},
	},
	docs: {
		autodocs: true,
	},

	// Add Webpack customization here
	webpackFinal: async ( webpackConfig ) => {
		webpackConfig.module.rules.push( {
			test: /\.(js|jsx|mjs)$/,
			exclude: /node_modules/,
			use: {
				loader: "babel-loader",
				options: {
					presets: [
						"@babel/preset-env",
						"@babel/preset-react",
					],
				},
			},
		} );
		webpackConfig.resolve.extensions.push( ".js", ".jsx" );
		return webpackConfig;
	},
};

export default config;
