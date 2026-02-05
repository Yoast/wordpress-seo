module.exports = {
	presets: [ require( "@yoast/tailwindcss-preset" ) ],
	content: [
		"./src/**/*.js",
		"./src/**/*.mdx",
		"./src/**/*.md",
		// Scan packages/js for Tailwind classes used in WordPress plugin components
		"../js/src/**/*.js",
	],
};
