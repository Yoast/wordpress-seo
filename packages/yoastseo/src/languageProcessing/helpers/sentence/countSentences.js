/** @module stringProcessing/countSentences */

import getSentences from "./getSentences.js";

/**
 * Counts the number of sentences in a given string.
 *
 * @param {string}      text                The text used to count sentences.
 * @param {function}    memoizedTokenizer   The memoized sentence tokenizer.
 *
 * @returns {number} The number of sentences in the text.
 */
export default function( text, memoizedTokenizer ) {
	const sentences = getSentences( text, memoizedTokenizer );
	let sentenceCount = 0;
	for ( let i = 0; i < sentences.length; i++ ) {
		sentenceCount++;
	}
	return sentenceCount;
}
