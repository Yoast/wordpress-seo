var filter = require( "lodash/filter" );
var isSentenceTooLong = require( "../helpers/isValueTooLong" );

/**
 * Checks for too long sentences.
 * @param {object} sentences The object containing the text's sentences and their lengths.
 * @param {number} recommendedValue The recommended maximum length of sentence.
 * @returns {array} Array of too long sentences.
 */
module.exports = function( sentences, recommendedValue ) {
	var tooLongSentences = filter( sentences, function( sentence ) {
		return isSentenceTooLong( recommendedValue, sentence.sentenceLength );
	} );

	return tooLongSentences;
};
