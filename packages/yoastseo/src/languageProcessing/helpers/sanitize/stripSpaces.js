/** @module stringProcessing/stripSpaces */

/**
 * Replaces multiple spaces with single space.
 * Removes spaces followed by a period and spaces in the beginning or ending of a string.
 *
 * @param {String} text The text to strip spaces from.
 * @returns {String} The text without double spaces
 */
export default function( text ) {
	// Replace multiple spaces with single space
	text = text.replace( /\s{2,}/g, " " );

	// Replace spaces followed by periods with only the period.
	text = text.replace( /\s\./g, "." );

	// Remove first/last character if space
	text = text.replace( /^\s+|\s+$/g, "" );

	// Replace spaces followed by Japanese periods with only the period.
	text = text.replace( /\s。/g, "。" );

	// Replace spaces after Japanese periods with only the period.
	text = text.replace( /。\s/g, "。" );

	return text;
}
