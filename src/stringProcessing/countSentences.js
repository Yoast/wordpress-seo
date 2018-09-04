/** @module stringProcessing/countSentences */

import getSentences from "../stringProcessing/getSentences.js";

/**
 * Counts the number of sentences in a given string.
 *
 * @param {string} text The text used to count sentences.
 * @returns {number} The number of sentences in the text.
 */
export default function( text ) {
	var sentences = getSentences( text );
	var sentenceCount = 0;
	for ( var i = 0; i < sentences.length; i++ ) {
		sentenceCount++;
	}
	return sentenceCount;
}
