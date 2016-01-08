/** @module stringProcessing/findKeywordInUrl */

var keywordRegex = require( "stringProcessing/stringToRegex.js" );
/**
 *
 * @param {string} url The url to check for keyword
 * @param {string} keyword The keyword to check if it is in the URL
 * @returns {boolean} If a keyword is found, returns true
 */
module.exports = function( url, keyword ) {
	var keywordFound = false;
	var formatUrl = url.match( />(.*)/ig );

	if ( formatUrl !== null ) {
		formatUrl = formatUrl[0].replace( /<.*?>\s?/ig, "" );
		if ( formatUrl.match( keywordRegex( keyword ) ) !== null ) {
			keywordFound = true;
		}
	}

	return keywordFound;
};
