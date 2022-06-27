/** @module stringProcessing/countWords */

import getWords from "./getWords.js";

/**
 * Calculates the word count of a certain text.
 *
 * @param {string} text The text to be counted.
 *
 * @returns {number} The word count of the given text.
 */
export default function( text ) {
	return getWords( text ).length;
}
