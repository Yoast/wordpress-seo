var wordCount = require( "../stringProcessing/countWords.js" );

/**
 * Returns an array with the number of words in a sentence.
 * @param {Array} sentences Array with sentences from text.
 * @returns {Array} Array with amount of words in each sentence.
 */
module.exports = function( sentences ) {
	var sentencesCount = [];
	sentences.map( function( sentence ) {
		sentencesCount.push( wordCount( sentence ) );
	} );
	return sentencesCount;
};
