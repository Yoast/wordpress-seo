/**
 * Checks whether the word is started with one of the words in a given list of exceptions
 * and ends in one of the suffixes in a given suffixes list. If so, deletes the suffix.
 *
 * @param {string[]}    exceptions  The exception list.
 * @param {string[]}    suffixes      The suffixes that needs to be deleted.
 * @param {string}      word        The word to check.
 * @returns {string}	The stemmed word.
 */
export function removeSuffixesFromFullForm( exceptions, suffixes, word ) {
	for ( let i = 0; i < exceptions.length; i++ ) {
		if ( word.startsWith( exceptions[ i ] ) ) {
			const suffixRetrieved = word.substring( exceptions[ i ].length );
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
