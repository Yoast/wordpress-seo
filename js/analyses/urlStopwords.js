var stopwordsArray = require( "../config/stopwords.js" );
var arrayMatch = require( "../stringProcessing/arrayMatch.js" );

/**
 * Matches stopwords in the URL. replaces - and _ with whitespace.
 *
 * @param {String} url The URL to check for stopwords.
 * @returns {Array} matches w
 */

module.exports = function( url ) {
	url = url.replace( /[-_]/g, " " );
	return arrayMatch( url, stopwordsArray() );
};
