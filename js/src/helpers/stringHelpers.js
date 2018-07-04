/**
 * Capitalize the first letter of a string.
 *
 * @param {string} string The string to capitalize.
 * @return {string}       The string with the first letter capitalized.
 */
export function firstToUpperCase( string ) {
	return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
}