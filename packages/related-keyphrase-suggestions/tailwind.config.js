/* eslint-disable global-require */
module.exports = {
	presets: [ require( "@yoast/tailwindcss-preset" ) ],
	content: [
		"../ui-library/src/**/!(stories).js",
		"./src/**/*.js",
		"./src/**/*.mdx",
		"./src/**/*.md",
	],
};
