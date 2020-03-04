/**
 * Checks whether the word ends in one of the words in an exception list that is a simple array.
 *
 * @param {string}	    word            The word to check.
 * @param {string[]}	exceptionList	The list of exceptions.
 *
 * @returns {boolean}	Whether the checked word ends in one of the words in the exception list.
 */
export function checkIfWordEndingIsOnExceptionList( word, exceptionList ) {
	for ( let i = 0; i < exceptionList.length; i++ ) {
		if ( word.endsWith( exceptionList[ i ] ) ) {
			return true;
		}
	}

	return false;
}

/**
 * Checks whether the word ends in one of the words in an exception list with two stems.
 *
 * @param {Array} exceptionListWithTwoStems The exception list with two stems
 * @param {string} word	The word to check
 * @returns {string} The stem
 */
export function checkExceptionListWithTwoStems( exceptionListWithTwoStems, word ) {
	for ( const stemSet of exceptionListWithTwoStems ) {
		const foundStem =  stemSet.find( stemWord => word.endsWith( stemWord ) );
		if ( foundStem ) {
			const precedingLexicalMaterial = word.slice( 0, word.length - foundStem.length );

			return precedingLexicalMaterial + stemSet[ 0 ];
		}
	}
}

