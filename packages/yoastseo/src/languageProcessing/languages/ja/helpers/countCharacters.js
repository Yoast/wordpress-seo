import sanitizeString from "../../../helpers/sanitize/sanitizeString";

/**
 * Calculates the character count of a text, including punctuation and numbers. Is used to determine length of text.
 *
 * @param {string} text The text to be counted.
 *
 * @returns {int} The word count of the given text.
 */
export default function( text ) {
	text = sanitizeString( text );

	return text.length;
}
