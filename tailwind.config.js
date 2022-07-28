const preset = require( "@yoast/tailwindcss-preset" );

module.exports = {
	presets: [ preset ],
	content: [
		"./packages/ui-library/src/**/!(stories).js",
		"./packages/js/src/**/*.js",
		"./src/integrations/settings-integration.php",
	],
	safelist: process.env.NODE_ENV === "development" ? [ { pattern: /.*/, variants: [ 'sm', 'md', 'lg', 'xl', '2xl' ] } ] : [
		"yst-border-l",
		"yst-space-x-8",
		"yst-pb-10",
		"yst-space-y-6",
		"yst--left-3",
		"yst-ring-gray-200",
		"yst-font-mono",
		"sm:yst-w-auto",
		"sm:yst-mb-0",
		"sm:yst-ml-3",
		"sm:yst-flex",
		"sm:yst-flex-row-reverse",
	],
};
