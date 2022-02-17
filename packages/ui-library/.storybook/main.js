module.exports = {
	stories: [ "../src/**/*.stories.js", "../src/**/stories.js" ],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@storybook/addon-a11y",
		"@whitespace/storybook-addon-html",

		{
			name: "@storybook/addon-postcss",
			options: {
				postcssLoaderOptions: {
					implementation: require( "postcss" ),
				},
			},
		},
	],
};
