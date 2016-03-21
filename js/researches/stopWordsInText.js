var stopwords = require( "../config/stopwords.js" )();
var toRegex = require( "../stringProcessing/stringToRegex.js" );

/**
 * Checks a text to see if there are any stopwords, that are defined in the stopwords config.
 *
 * @param {string} text The input text to match stopwords.
 * @returns {Array} An array with all stopwords found in the text.
 */
module.exports = function( text ) {
	var i, matches = [];

	for ( i = 0; i < stopwords.length; i++ ) {
		if ( text.match( toRegex( stopwords[i] ) ) !== null ) {
			matches.push( stopwords[i] );
		}
	}

	return matches;
};
