module.exports = {
	stories: [
		"../src/**/*.stories.@(js|mdx)",
		"../src/**/stories.@(js|mdx)",
	],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@storybook/addon-a11y",
		{
			name: "@storybook/addon-postcss",
			options: {
				postcssLoaderOptions: {
					// Provide our own copy of PostCSS.
					implementation: require( "postcss" ),
				},
			},
		},
	],
	core: {
		disableTelemetry: true,
	},
	features: {
		previewMdx2: true,
	},
};
