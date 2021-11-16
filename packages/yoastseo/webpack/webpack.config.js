const { readdirSync } = require( "fs" );
const path = require( "path" );

const externals = {
	jed: "jed",
	"lodash-es": "lodash",
	lodash: "lodash",
	yoastseo: [ "yoast", "analysis" ],
};

const languages = readdirSync( "./src/languageProcessing/languages" );

/**
 * Replaces any import from `@wordpress/{xyz}` with `wp.{xyz}`.
 *
 * @param {string} context The directory of the file that contains the import.
 * @param {string} request The requested import.
 * @param {Function} callback The callback function to generate the external.
 *
 * @returns {*} The external.
 */
const wordPressExternals = function( context, request, callback ) {
	if ( /^@wordpress\//.test( request ) ) {
		return callback( null, [ "wp", request.replace( "@wordpress/", "" ) ] );
	}
	callback();
};

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

const mainConfig = {
	entry: "./index.js",
	externals: [ externals, wordPressExternals ],
	plugins: [],
};

const languageConfig = {
	entry: languageMap,
	externals: [ externals, wordPressExternals ],
	output: {
		path: path.resolve( "dist", "languages" ),
		library: [ "yoast", "Researcher" ],
		libraryTarget: "window",
	},
};

module.exports = [ mainConfig, languageConfig ];
