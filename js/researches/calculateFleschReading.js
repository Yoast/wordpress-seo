/** @module analyses/calculateFleschReading */

var stripNumbers = require( "../stringProcessing/stripNumbers.js" );
var countSentences = require( "../stringProcessing/countSentences.js" );
var countWords = require( "../stringProcessing/countWords.js" );
var countSyllables = require( "../stringProcessing/countSyllables.js" );
var formatNumber = require( "../helpers/formatNumber.js" );

/**
 * This calculates the fleschreadingscore for a given text
 * The formula used:
 * 206.835 - 1.015 (total words / total sentences) - 84.6 ( total syllables / total words);
 *
 * @param {object} paper The paper containing the text
 * @returns {number} the score of the fleschreading test
 */
module.exports = function( paper ) {
	var text = paper.getText();
	if ( text === "" ) {
		return 0;
	}

	var numberOfSentences = countSentences( text );

	var numberOfWords = countWords( text );

	// Prevent division by zero errors.
	if ( numberOfSentences === 0 || numberOfWords === 0 ) {
		return 0;
	}

	text = stripNumbers( text );
	var numberOfSyllables = countSyllables( text );

	var score = 206.835 - ( 1.015 * ( numberOfWords / numberOfSentences ) ) - ( 84.6 * ( numberOfSyllables / numberOfWords ) );

	return formatNumber( score );
};
