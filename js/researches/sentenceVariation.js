var getSentences = require( "../stringProcessing/getSentences.js" );
var sentencesLength = require( "../stringProcessing/sentencesLength.js" );
var fixFloatingPoint = require( "../helpers/fixFloatingPoint" );
var sum = require( "lodash/sum" );

/**
 * Calculates the standard deviation of a text
 *
 * @param {Paper} paper the Paper object to use in this count.
 * @returns {number} The calculated standard deviation
 */
module.exports = function( paper ) {
	var text = paper.getText();

	var sentences = getSentences( text );
	var wordCountPerSentence = sentencesLength( sentences );
	var totalSentences = wordCountPerSentence.length;
	var totalWords = sum( wordCountPerSentence );
	var average = totalWords / totalSentences;

	// Calculate the variations per sentence.
	var variation;
	var variations = [];
	wordCountPerSentence.map( function( wordCount ) {
		variation = wordCount - average;
		variations.push( Math.pow( variation, 2 ) );
	} );

	var totalOfSquares = sum( variations );

	if ( totalOfSquares > 0) {
		var dividedSquares = totalOfSquares / ( totalSentences - 1 );

		return fixFloatingPoint( Math.sqrt( dividedSquares ) );
	}

	return 0;
};
