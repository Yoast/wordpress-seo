const { readdirSync } = require( "fs" );
const path = require( "path" );

const externals = require( "./externals/externals" );
const wordPressExternals = require( "./externals/wordpress" );

/**
 * All languages for which we have specific functionality, as an array of language ids.
 *
 * @type {string[]}
 */
const languages = readdirSync( "./src/languageProcessing/languages" );

/**
 * An object mapping target language to the path of the language specific Researcher.
 *
 * @example
 * {
 *    "default": "/src/languageProcessing/languages/_default/Researcher",
 *    ar: "/src/languageProcessing/languages/ar/Researcher",
 *    // ...
 *    tr: "/src/languageProcessing/languages/tr/Researcher"
 * }
 *
 * @type {Record<string,string>}
 */
const languageMap = languages.reduce( ( memo, language ) => {
	const name = ( language === "_default" ) ? "default" : language;
	memo[ name ] = path.resolve( "src", "languageProcessing", "languages", language, "Researcher" );
	return memo;
}, {} );

/**
 * The Webpack configuration for building the language specific JavaScript files.
 *
 * @type {Object}
 */
module.exports = {
	entry: languageMap,
	externals: [ externals, wordPressExternals ],
	output: {
		path: path.resolve( "dist", "dist", "languages" ),
		library: [ "yoast", "Researcher" ],
		libraryTarget: "window",
	},
};
