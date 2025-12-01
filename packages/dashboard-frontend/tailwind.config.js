module.exports = {
	presets: [ require( "@yoast/tailwindcss-preset" ) ],
	content: [
		"./src/**/*.js",
		"./stories/**/*.js",
		// Should be replaced with node_modules if outside of the monorepo.
		"../../packages/ui-library/src/**/*.js",
	],
};
