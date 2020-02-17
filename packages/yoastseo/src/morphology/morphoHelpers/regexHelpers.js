/**
 * Checks whether a word is matched with a regex.
 *
 * @param {string} word		The word to check.
 * @param {string} regex	The regex.
 * @returns {boolean}		Whether or not there was a match.
 */
export function doesWordMatchRegex( word, regex ) {
	const regexObject = RegExp( regex );
	return regexObject.test( word );
}

/**
 * Loops through a nested array with pairs of regexes and replacements, and performs the needed replacement if a match is found.
 *
 * @param {string} word 							The word that may need to be modified.
 * @param {string[]} groupOfRegexAndReplacements 	The array with the regexes and the required replacements.
 * @returns {?string} The modified stem or null if no match was found.
 */
export function searchAndReplaceWithRegex( word, groupOfRegexAndReplacements ) {
	for ( const regexAndReplacement of groupOfRegexAndReplacements ) {
		if ( word.search( new RegExp( regexAndReplacement[ 0 ] ) ) !== -1 ) {
			word = word.replace( new RegExp( regexAndReplacement[ 0 ] ), regexAndReplacement[ 1 ] );
			return word;
		}
	}
}
