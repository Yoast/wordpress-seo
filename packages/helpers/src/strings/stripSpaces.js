/** @module stringProcessing/stripSpaces */

/**
 * Strips spaces from text
 *
 * @param {String} text The text to strip spaces from.
 * @returns {String} The text without double spaces
 */
export default function( text ) {
	// Replaces multiple spaces with a single space.
	text = text.replace( /\s{2,}/g, " " );

	// Removes first/last character if it's a space.
	text = text.replace( /^\s+|\s+$/g, "" );

	return text;
}
