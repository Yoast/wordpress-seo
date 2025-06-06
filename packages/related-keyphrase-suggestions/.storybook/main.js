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
		getAbsolutePath( "@storybook/addon-webpack5-compiler-swc" ),
		getAbsolutePath( "@storybook/addon-essentials" ),
		getAbsolutePath( "@storybook/addon-interactions" ),
		getAbsolutePath( "@storybook/addon-links" ),
		getAbsolutePath( "@storybook/addon-a11y" ),
		{
			name: getAbsolutePath( "@storybook/addon-styling-webpack" ),
			options: {
				rules: [
					{
						test: /\.css$/,
						sideEffects: true,
						use: [
							getAbsolutePath( "style-loader" ),
							getAbsolutePath( "css-loader" ),
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
	framework: {
		name: getAbsolutePath( "@storybook/react-webpack5" ),
		options: {},
	},
	docs: {
		autodocs: true,
	},
};

export default config;
