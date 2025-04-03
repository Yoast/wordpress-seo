import { dirname, join } from "path";

/**
 * Get the absolute path of an installed package.
 * @param {string} value The package name.
 * @returns {string} The absolute path to the package.
 */
function getAbsolutePath( value ) {
	return dirname( require.resolve( join( value, "package.json" ) ) );
}

const config = {
	stories: [
		"../src/introduction.stories.mdx",
		"../src/installation.stories.mdx",
		"../src/contributing.stories.mdx",
		"../src/changelog.stories.mdx",
		"../src/**/*.stories.@(js|mdx)",
		"../src/**/stories.@(js|mdx)",
	],
	addons: [
		getAbsolutePath( "@storybook/addon-links" ),
		getAbsolutePath( "@storybook/addon-essentials" ),
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
};

export default config;
