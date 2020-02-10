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
