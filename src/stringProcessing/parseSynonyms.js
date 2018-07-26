/** @module stringProcessing/parseSynonyms */

const stripSpaces = require( "../stringProcessing/stripSpaces.js" );
const removePunctuationExceptQuotes = require( "../stringProcessing/removePunctuationExceptQuotes.js" );

/**
 * Parses synonyms from a comma-separated string into an array.
 *
 * @param {String} synonyms The text to match
 *
 * @returns {Array} An array with all synonyms.
 */
module.exports = function( synonyms ) {
	let synonymsSplit = synonyms.split( "," );

	synonymsSplit = synonymsSplit.map( function( synonym ) {
		return removePunctuationExceptQuotes( stripSpaces( synonym ) );
	} ).filter( function( synonym ) {
		return synonym;
	} );
	return synonymsSplit;
};
