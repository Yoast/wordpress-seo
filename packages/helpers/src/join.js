/**
 * Joins strings using the separator. Filters falsy values.
 *
 * @param {string[]} strings   The array of string to join.
 * @param {string}   separator The separator. Defaults to "-".
 *
 * @returns {string} The id with separator.
 */
export default function join( strings, separator = "-" ) {
	return strings.filter( Boolean ).join( separator );
}
