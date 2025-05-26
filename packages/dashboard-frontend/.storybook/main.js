import { dirname, join } from "path";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 * @param {string} value The package name or path.
 * @returns {string} The absolute path to the package.
 */
function getAbsolutePath( value ) {
	return dirname( require.resolve( join( value, "package.json" ) ) );
}

/** @type { import("@storybook/react-webpack5").StorybookConfig } */
const config = {
	stories: [
		"../stories/**/*.mdx",
		"../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
	],
	addons: [
		getAbsolutePath( "@storybook/addon-webpack5-compiler-swc" ),
		getAbsolutePath( "@storybook/addon-essentials" ),
		getAbsolutePath( "@storybook/addon-interactions" ),
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
	framework: {
		name: getAbsolutePath( "@storybook/react-webpack5" ),
		options: {},
	},
	docs: {
		autodocs: true,
	},
	core: {
		disableTelemetry: true,
		disableWhatsNewNotifications: true,
	},
};

export default config;
