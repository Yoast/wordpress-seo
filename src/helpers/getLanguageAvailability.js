var indexOf = require( "lodash/indexOf" );

var getLanguage = require( "./getLanguage.js" );

/**
 * Checks whether the language of the locale is available.
 *
 * @param {string} locale The locale to get the language from.
 * @param {array} languages The list of languages to match.
 * @returns {boolean} Returns true if the language is found in the array.
 */
module.exports = function( locale, languages ) {
	var language = getLanguage( locale );
	return indexOf( languages, language ) > -1;
};
