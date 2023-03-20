/** @module stringProcessing/stripSpaces */

/**
 * Replaces multiple spaces with a single space.
 * Removes spaces followed by a period (if there's no text after the period) and spaces in the beginning or end of a string.
 *
 * @param {String} text The text to strip spaces from.
 * @returns {String} The text with stripped spaces.
 */
export default function( text ) {
	// Replaces multiple spaces with a single space.
	text = text.replace( /\s{2,}/g, " " );
	// Replaces space(s) followed by a period, if the period is the last character, with only the period.
	text = text.replace( /\s\.$/, "." );
	// Removes first/last character if it's a space.
	text = text.replace( /^\s+|\s+$/g, "" );
	// Replaces spaces followed by a Japanese period with only the period.
	text = text.replace( /\s。/g, "。" );
	// Replaces spaces after a Japanese period with only the period.
	text = text.replace( /。\s/g, "。" );

	return text;
}
