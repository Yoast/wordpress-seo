import unescape from "lodash/unescape";

/**
 * Wraps Lodash's unescape function to deal with PHP's escaping of the apostrophe, which is &#039; in PHP.
 * Converts &amp;, &lt;, &gt;, &quot;, and &#39; in escapedString to their corresponding characters.
 *
 * @param {string}   escapedString         The string that is to be escaped.
 * @returns {string} The unescaped string.
  */
export function unescapeString( escapedString ) {
	escapedString = escapedString.replace( /&#0*39;/g, "&#39;" );
	return unescape( escapedString );
}

/**
 * Capitalize the first letter of a string.
 *
 * @param   {string} string The string to capitalize.
 *
 * @returns {string}        The string with the first letter capitalized.
 */
export function firstToUpperCase( string ) {
	return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
}
