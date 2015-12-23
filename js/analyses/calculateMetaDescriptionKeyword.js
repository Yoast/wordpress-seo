/** @module analyses/getMetaDescriptionKeyword */

var wordMatch = require( "../stringProcessing/matchTextWithWord.js" );
/**
 * Counts the occurrences of the keyword in the metadescription, returns 0 if metadescription is
 * empty or not set. Default is -1, if the meta is empty, this way we can score for empty meta.
 *
 * @param {string} text The text to match for a keyword.
 * @param {string} keyword The keyword to match.
 * @returns {array} matches in the metadescription
 */
module.exports = function( text, keyword ) {
	return  wordMatch( text, keyword );
};
