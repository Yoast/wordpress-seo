/** @module stringProcessing/stripSpaces */

/**
 * Replaces multiple spaces with single space.
 * Removes spaces followed by a period and spaces in the beginning or ending of a string.
 *
 * @param {String} text The text to strip spaces from.
 * @returns {String} The text without double spaces
 */
export default function( text ) {
	// Replace multiple spaces with single space.
	text = text.replace( /\s{2,}/g, " " );
	// Replace multiple spaces before a full stop, if the last character is a full stop.
	text = text.replace( /\s\.$/, "." );
	// Remove first/last character if space.
	text = text.replace( /^\s+|\s+$/g, "" );
	// Replace spaces before Japanese periods with only the period.
	text = text.replace( /\s。/g, "。" );
	// Replace spaces after Japanese periods with only the period.
	text = text.replace( /。\s/g, "。" );

	return text;
}
