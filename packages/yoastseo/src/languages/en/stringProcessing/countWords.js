/** @module stringProcessing/countWords */

import getWords from "../stringProcessing/getWords.js";

/**
 * Calculates the wordcount of a certain text.
 *
 * @param {string} text The text to be counted.
 * @returns {int} The word count of the given text.
 */
export default function( text ) {
	return getWords( text ).length;
}
