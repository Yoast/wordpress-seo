/**
 * Loops through an array of word endings and returns the longest ending that was matched at the end of the string.
 *
 * @param {string}      string       The string to check.
 * @param {string[]}    endings    The word endings to check.
 * @returns {string}    The longest matched ending.
 */
export function findMatchingEndingInArray( string, endings ) {
	const matches = [];
	for ( const i in endings ) {
		if ( string.endsWith( endings[ i ] ) ) {
			matches.push( endings[ i ] );
		}
	}

	const longest = matches.sort( function( a, b ) {
		return b.length - a.length;
	} )[ 0 ];

	if ( longest ) {
		return longest;
	}
	return "";
}
