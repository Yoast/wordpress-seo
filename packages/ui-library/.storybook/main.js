import { dirname, join } from "path";

/**
 * Get the absolute path of an installed package.
 * @param {string} value The package name.
 * @returns {string} The absolute path to the package.
 */
function getAbsolutePath( value ) {
	return dirname( require.resolve( join( value, "package.json" ) ) );
}

/** @type { import("@storybook/react-webpack5").StorybookConfig } */
const config = {
	stories: [
		"../src/introduction.mdx",
		"../src/installation.mdx",
		"../src/contributing.mdx",
		"../src/changelog.mdx",
		"../src/**/*.mdx",
		"../src/**/*.stories.js",
		"../src/**/stories.js",
	],
	addons: [
		getAbsolutePath( "@storybook/addon-webpack5-compiler-swc" ),
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
	framework: {
		name: getAbsolutePath( "@storybook/react-webpack5" ),
		options: {},
	},
};

export default config;
