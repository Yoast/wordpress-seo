/**
 * Checks whether the word starts with one of the words in a given list and ends in one of the suffixes
 * in a given suffixes list. If so, deletes the suffix.
 *
 * @param {string[]}    list  The list of words to check against.
 * @param {string[]}    suffixes    The suffixes that needs to be deleted.
 * @param {string}      word        The word to check.
 * @returns {string}	The stemmed word.
 */
export function removeSuffixesFromFullForm( list, suffixes, word ) {
	for ( let i = 0; i < list.length; i++ ) {
		if ( word.startsWith( list[ i ] ) ) {
			const suffixRetrieved = word.substring( list[ i ].length );
			for ( let j = 0; j < suffixes.length; j++ ) {
				if ( suffixes[ j ] === suffixRetrieved ) {
					return word.slice( 0, -suffixRetrieved.length );
				}
			}
		}
	}
}

/**
 * Checks whether the word is in a given list of exceptions and if so, deletes a given suffix.
 *
 * @param {string[]}    exceptions  The exception list.
 * @param {string}      suffix      The suffix that needs to be deleted.
 * @param {string}      word        The word to check.
 *
 * @returns {string} The stemmed word.
 */
export function removeSuffixFromFullForm( exceptions, suffix, word ) {
	for ( let i = 0; i < exceptions.length; i++ ) {
		if ( word.endsWith( exceptions[ i ] ) ) {
			return word.slice( 0, -suffix.length );
		}
	}
}
