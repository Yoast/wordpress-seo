var getSentences = require( "../stringProcessing/getSentences" );
var sentencesLength = require( "./sentencesLength.js" );

/**
 * Get sentences from the text.
 * @param {Paper} paper The Paper object to get description from.
 * @returns {Array} The sentences from the text.
 */
module.exports = function( paper ) {
	var sentences = getSentences( paper.getDescription() );
	return sentencesLength( sentences );
};
