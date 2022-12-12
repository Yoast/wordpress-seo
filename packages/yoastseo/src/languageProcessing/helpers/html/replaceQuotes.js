/**
 * Replaces single quotes around HTML attribute values with double quotes.
 * Double quotes are the standard, but we convert these to single quotes when parsing the HTML in `yoastseo` package.
 * Here, we change them back to double quotes so by parsing the HTML and then outputting it again.
 *
 * @param {string} str The input string.
 *
 * @returns {string} The string with single quotes around HTML attributes replaced with double quotes.
 */
export default function( str ) {
	const element = document.createElement( "body" );
	element.innerHTML = str;
	return element.innerHTML;
}
