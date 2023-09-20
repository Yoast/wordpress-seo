/**
 * Replaces single quotes around HTML attribute values with double quotes.
 * Double quotes are the standard, but we convert these to single quotes when parsing the HTML in `yoastseo` package.
 * Here, we change them back to double quotes so by parsing the HTML and then outputting it again.
 * Note that this function does more than just replacing single quotes with double quotes. It also restores corrupted HTML.
 * @param {string} str The input string.
 *
 * @returns {string} The string with single quotes around HTML attributes replaced with double quotes.
 */
export default function( str ) {
	const doc = new DOMParser().parseFromString( str, "text/html" );
	const normalizedHTML = doc.body.innerHTML;

	// Replace `&nbsp;` with an actual non breaking space (U+00A0).
	return normalizedHTML.replace( /&nbsp;/g, "\u00A0" );
}
