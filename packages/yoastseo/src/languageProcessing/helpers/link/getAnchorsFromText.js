/** @module stringProcessing/getAnchorsFromText */

/**
 * Check for anchors in the text string and returns them in an array.
 *
 * @param {String} text The text to check for matches.
 *
 * @returns {Array} The matched links in text.
 */
export default function( text ) {
	let matches;

	/*
	  * Regex matches everything between <a> and </a>.
	  *
	  * There must be:
	  * - at least one whitespace after the starting `<a`, otherwise it matches `<abbr` tags.
	  * - followed by at least one not `>`, to match any attributes that are given.
	  *   This could be one or zero (`*`), but an anchor tag without an `href` attribute does not make sense.
	  *   The regex could be more precise here, by checking for the `href`, but this is less complex.
	  * - losing tag of the opening tag `>`.
	  * - content of the anchor tag. Any character, including line separators (`[\n\r\u2028\u2029]`).
	  * - the closing anchor tag.
	 */
	matches = text.match( /<a[\s]+(?:[^>]+)>((?:.|[\n\r\u2028\u2029])*?)<\/a>/ig );

	if ( matches === null ) {
		matches = [];
	}

	return matches;
}
