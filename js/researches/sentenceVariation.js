var getSentences = require( "../stringProcessing/getSentences.js" );
var sentencesLength = require( "../stringProcessing/sentencesLength.js" );
var formatNumber = require( "../helpers/formatNumber" );
var sum = require( "lodash/sum" );
var reduce = require( "lodash/reduce" );

/**
 * Calculates the standard deviation of a text
 *
 * @param {Paper} paper the Paper object to use in this count.
 * @returns {number} The calculated standard deviation
 */
module.exports = function( paper ) {
	var text = paper.getText();

	var sentences = getSentences( text );
	var sentenceLengthResults = sentencesLength( sentences );
	var totalSentences = sentenceLengthResults.length;

	var totalWords = reduce( sentenceLengthResults, function( result, sentence ) {
		return result + sentence.sentenceLength;
	}, 0 );

	var average = totalWords / totalSentences;

	// Calculate the variations per sentence.
	var variation;
	var variations = [];

	sentenceLengthResults.map( function( sentence ) {
		variation = sentence.sentenceLength - average;
		variations.push( Math.pow( variation, 2 ) );
	} );

	var totalOfSquares = sum( variations );

	if ( totalOfSquares > 0 ) {
		var dividedSquares = totalOfSquares / ( totalSentences );

		return formatNumber( Math.sqrt( dividedSquares ) );
	}

	return 0;
};
