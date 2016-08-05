var getSentences = require( "../stringProcessing/getSentences" );
var sentencesLength = require( "./../stringProcessing/sentencesLength.js" );

/**
 * Counts sentences in the description..
 * @param {Paper} paper The Paper object to get description from.
 * @returns {Array} The sentences from the text.
 */
module.exports = function( paper ) {
	var sentences = getSentences( paper.getDescription() );
	return sentencesLength( sentences );
};
