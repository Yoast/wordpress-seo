var transitionWords = require( "../config/transitionWords.js" )();
var toRegex = require( "../stringProcessing/stringToRegex.js" );

/**
 * Checks a text to see if there are any transition words that are defined in the transition words config.
 *
 * @param {string} text The input text to match transition words.
 * @returns {Array} An array with all transition words found in the text.
 */

module.exports = function( text ) {
	var i, matches = [];

	for ( i = 0; i < transitionWords.length; i++ ) {
		if ( text.match( toRegex( transitionWords[ i ] ) ) !== null ) {
			matches.push( transitionWords[ i ] );
		}
	}
	return matches;
};
