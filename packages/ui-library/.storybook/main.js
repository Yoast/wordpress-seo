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
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@storybook/addon-a11y",
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
		name: "@storybook/react-webpack5",
		options: {},
	},
};
