/** @module stringProcessing/stripNumbers */

import stripSpaces from "./stripSpaces.js";

/**
 * Removes all words comprised only of numbers.
 *
 * @param {string} text to remove words
 * @returns {string} The text with 'numberonly' words removed.
 */
export default function( text ) {
	// Remove "words" comprised only of numbers
	text = text.replace( /\b[0-9]+\b/g, "" );

	text = stripSpaces( text );

	if ( text === "." ) {
		text = "";
	}
	return text;
}
