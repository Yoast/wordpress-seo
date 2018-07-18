/** @module stringProcessing/countWords */

var getWords = require( "../stringProcessing/getWords.js" );

/**
 * Calculates the wordcount of a certain text.
 *
 * @param {string} text The text to be counted.
 * @returns {int} The word count of the given text.
 */
module.exports = function( text ) {
	return getWords( text ).length;
};
