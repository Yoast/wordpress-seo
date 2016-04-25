var filter = require( "lodash/filter" );

/**
 * Checks if a sentence is longer than the recommended value.
 * @param {number} recommendedValue The recommended maximum length of the sentence.
 * @param  {number} sentenceLength The length of the sentence.
 * @returns {boolean} True if the sentence is longer than recommended value.
 */
function isSentenceTooLong( recommendedValue, sentenceLength ) {
	return sentenceLength > recommendedValue;
}

/**
 * Counts number of too long sentences.
 * @param {array} sentences The array containing sentence lengths.
 * @param {number} recommendedValue The recommended maximum length of sentence.
 * @returns {number} Number of too long sentences.
 */
module.exports = function ( sentences, recommendedValue ) {
	var tooLongSentences = filter( sentences, isSentenceTooLong.bind( null, recommendedValue ) );
	return tooLongSentences.length;
};
