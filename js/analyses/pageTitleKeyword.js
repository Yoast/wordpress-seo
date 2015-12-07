var wordMatch = require( "../stringProcessing/wordMatch.js" );
var stringPosition = require( "../stringProcessing/stringPosition.js" );

/**
 * Counts the occurrences of the keyword in the pagetitle. Returns the number of matches
 * and the position of the keyword.
 *
 * @param {String} text The text to match the keyword in.
 * @param {String} keyword The keyword to match for.
 * @returns {Object} result with the matches and position.
 */

module.exports = function( text, keyword ) {
	var result = {};
	result.matches = wordMatch( text, keyword );
	result.position = stringPosition( text, keyword );
	return result;
};
