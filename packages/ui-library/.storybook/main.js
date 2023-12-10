import { dirname, join } from "path";

function getAbsolutePath( value ) {
	return dirname( require.resolve( join( value, "package.json" ) ) );
}

module.exports = {
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
			name: "@storybook/addon-styling-webpack",
			options: {
				rules: [
					{
						test: /\.css$/,
						use: [
							"style-loader",
							{
								loader: "css-loader",
								options: { importLoaders: 1 },
							},
							{
								loader: "postcss-loader",
								options: { implementation: require.resolve( "postcss" ) },
							},
						],
					},
				],
			},
		},
	],
	core: {
		disableTelemetry: true,
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
