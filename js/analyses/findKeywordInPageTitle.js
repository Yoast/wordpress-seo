/** @module analyses/findKeywordInPageTitle */

var wordMatch = require( "../stringProcessing/matchTextWithWord.js" );
var stringPosition = require( "../stringProcessing/getStringPosition.js" );

/**
 * Counts the occurrences of the keyword in the pagetitle. Returns the number of matches
 * and the position of the keyword.
 *
 * @param {string} text The text to match the keyword in.
 * @param {string} keyword The keyword to match for.
 * @returns {object} result with the matches and position.
 */

module.exports = function( text, keyword ) {
	var result = { matches: 0, position: -1 };
	result.matches = wordMatch( text, keyword );
	result.position = stringPosition( text, keyword );

	return result;
};
