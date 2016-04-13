var getSentences = require( "../stringProcessing/getSentences" );

/**
 * Get sentences from the text.
 * @param {Paper} paper The Paper object to get text from.
 * @returns {Array} The sentences from the text.
 */
module.exports = function( paper ) {
	return getSentences( paper.getText() );
};
