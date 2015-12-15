/** @module analyses/calculateFleschReading */

var cleanText = require( "../stringProcessing/cleanText.js" );
var sentenceCount = require( "../stringProcessing/sentenceCount.js" );
var wordCount = require( "../stringProcessing/countWords.js" );
var syllableCount = require( "../stringProcessing/countSyllables.js" );

/**
 * This calculates the fleschreadingscore for a given text
 * The formula used:
 * 206.835 - 1.015 (total words / total sentences) - 84.6 ( total syllables / total words);
 *
 * @param {string} text The text to analyze the fleschreading score.
 * @returns {number} the score of the fleschreading test
 */
module.exports = function( text ) {
	var wordcount = wordCount( cleanText( text ) );
	var sentencecount = sentenceCount( text );
	var syllablecount = syllableCount( text );
	var score = 206.835 - ( 1.015 * ( wordcount / sentencecount ) ) - ( 84.6 * ( syllablecount / wordcount ) );

	return score.toFixed( 1 );
};
