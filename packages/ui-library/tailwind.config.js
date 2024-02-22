/* eslint-disable global-require */
module.exports = {
	presets: [ require( "@yoast/tailwindcss-preset" ) ],
	content: [ "./src/**/*.js" ],
	safelist: [
		"yst-grow",
		"yst-gap-6",
	],
};
