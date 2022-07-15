const preset = require( "@yoast/postcss-preset" );
const rtlCss = require( "postcss-rtlcss" );

module.exports = {
	...preset,
	plugins: [
		...preset.plugins,
		rtlCss(),
	],
};
