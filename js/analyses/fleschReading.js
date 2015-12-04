var cleanTextFunction = require( "../stringProcessing/cleanText.js" );
var sentenceCountFunction = require( "../stringProcessing/sentenceCount.js" );
var wordCountFunction = require( "../stringProcessing/wordCount.js" );
var syllableCountFunction = require( "../stringProcessing/countSyllable.js" );


/**
 * This calculates the fleschreadingscore for a given text
 * The formula used:
 * 206.835 - 1.015 (total words / total sentences) - 84.6 ( total syllables / total words);
 *
 * @param {String} text The text to analyze the fleschreading score.
 * @returns {int} the score of the fleschreading test
 */
module.exports = function( text ) {
	var wordcount = wordCountFunction( cleanTextFunction( text ) );
	var sentencecount = sentenceCountFunction( text );
	var syllablecount = syllableCountFunction( text );
	var score = 206.835 - ( 1.015 * ( wordcount / sentencecount ) ) - ( 84.6 * ( syllablecount / wordcount ) );

	return score.toFixed(1);
};
