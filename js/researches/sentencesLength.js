var wordCount = require( "../stringProcessing/countWords.js" );
var forEach = require( "lodash/forEach" );

/**
 * Returns the number of words in a sentence.
 * @param {Array} sentences array with sentences from text.
 * @returns {Array} array with amount of words in each sentence.
 */
module.exports = function( sentences ) {
	var sentencesCount = [];
	forEach( sentences, function( sentence ) {
		var sentenceLength = wordCount( sentence );
		if( sentenceLength > 0 ) {
			sentencesCount.push( sentenceLength );
		}
	} );
	return sentencesCount;
};
