/** @module stringProcessing/stripSpaces */

/**
 * Strip double spaces from text
 *
 * @param {String} text The text to strip spaces from.
 * @returns {String} The text without double spaces
 */
export default function( text ) {
	// Replace multiple spaces with single space.
	text = text.replace( /\s{2,}/g, " " );

	// Remove first/last character if space.
	text = text.replace( /^\s+|\s+$/g, "" );

	// Replace spaces before Japanese periods with only the period.
	text = text.replace( /\s。/g, "。" );

	// Replace spaces after Japanese periods with only the period.
	text = text.replace( /。\s/g, "。" );

	return text;
}
