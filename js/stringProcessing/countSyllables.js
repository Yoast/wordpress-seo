var cleanTextFunction = require( "../stringProcessing/cleanText.js" );
var basicSyllableFunction = require( "../stringProcessing/basicSyllable.js" );
var advancedSyllableFunction = require( "../stringProcessing/advancedSyllable.js" );
var exclusionSyllableFunction = require( "../stringProcessing/exclusionSyllable.js" );
var removeExclusionWordsFunction = require( "../stringProcessing/removeExclusionWords.js" );



/**
 * Counts the number of syllables in a textstring, calls exclusionwordsfunction, basic syllable
 * counter and advanced syllable counter.
 *
 * @param {String} textString The text to count the syllables from.
 * @returns {int} syllable count
 */
module.exports = function( text ) {
	var count = 0;
	count += exclusionSyllableFunction( text );

	text = removeExclusionWordsFunction( text );
	text = cleanTextFunction( text );
	text.replace( /[.]/g, " " );

	count += basicSyllableFunction( text );
	count += advancedSyllableFunction( text, "add" );
	count -= advancedSyllableFunction( text, "subtract" );

	return count;
};
