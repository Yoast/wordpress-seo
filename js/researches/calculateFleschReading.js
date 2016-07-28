/** @module analyses/calculateFleschReading */

var stripNumbers = require( "../stringProcessing/stripNumbers.js" );
var countSentences = require( "../stringProcessing/countSentences.js" );
var countWords = require( "../stringProcessing/countWords.js" );
var countSyllables = require( "../stringProcessing/countSyllables.js" );
var formatNumber = require( "../helpers/formatNumber.js" );

var getLanguage = require( "../helpers/getLanguage.js" );

/**
 * This calculates the fleschreadingscore for a given text
 * The formula used:
 * 206.835 - 1.015 (total words / total sentences) - 84.6 ( total syllables / total words);
 *
 * @param {object} paper The paper containing the text
 * @returns {number} the score of the fleschreading test
 */
module.exports = function( paper ) {
	var score;
	var text = paper.getText();
	var locale = paper.getLocale();
	var language = getLanguage( locale );
	if ( text === "" ) {
		return 0;
	}

	text = stripNumbers( text );

	var numberOfSentences = countSentences( text );

	var numberOfWords = countWords( text );

	// Prevent division by zero errors.
	if ( numberOfSentences === 0 || numberOfWords === 0 ) {
		return 0;
	}

	var numberOfSyllables = countSyllables( text, locale );
	switch( language ) {
		case "nl":
			var syllablesPer100Words = numberOfSyllables * ( 100 / numberOfWords );
			score = 206.84 - ( 0.77 * syllablesPer100Words ) - ( 0.93 * ( numberOfWords / numberOfSentences ) );
			break;
		case "en":
		default:
			score = 206.835 - ( 1.015 * ( numberOfWords / numberOfSentences ) ) - ( 84.6 * ( numberOfSyllables / numberOfWords ) );
			break;
	}


	return formatNumber( score );
};
