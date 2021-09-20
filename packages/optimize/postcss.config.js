const path = require( "path" );
const tailwindCSS = require( "tailwindcss" );
const autoprefixer = require( "autoprefixer" );
const rtlCSS = require( "postcss-rtlcss" );
const importCSS = require( "postcss-import" );

module.exports = {
	plugins: [
		importCSS,
		tailwindCSS( path.resolve( __dirname, "tailwind.config.js" ) ),
		autoprefixer,
		rtlCSS( {
			processKeyFrames: true,
			useCalc: true,
		} ),
	],
};
