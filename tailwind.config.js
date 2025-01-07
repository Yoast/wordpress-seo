const preset = require( "@yoast/tailwindcss-preset" );

module.exports = {
	presets: [ preset ],
	content: [
		"./packages/ui-library/src/**/!(stories).js",
		"./packages/related-keyphrase-suggestions/src/**/!(stories).js",
		"./packages/js/src/**/*.js",
		"./src/integrations/settings-integration.php",
	],
	theme: {
		extend: {
			keyframes: {
				slideRight: {
					"0%": {
						transform: "translate(0, 0)",
						opacity: 1,
					},
					"100%": {
						transform: "translate(100%, 0)",
						opacity: 0,
					},
				},
			},
			animation: {
				slideRight: "slideRight .5s ease-in-out forwards",
			},
			fontFamily: {
				wp: [
					"-apple-system",
					"BlinkMacSystemFont",
					"Segoe UI",
					"Roboto",
					"Oxygen-Sans",
					"Ubuntu",
					"Cantarell",
					"Helvetica Neue",
					"sans-serif",
				],
			},
		},
	},
	safelist: [
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
