import { flattenSortLength } from "./flattenSortLength";

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
 * Checks whether a word is on the list of words that can have a prefix or not. Before checking the list, checks whether the word has a prefix
 * and if it does, removes it.
 *
 * @param {string}	 	word					The word to check.
 * @param {string[]}	exceptionList			The list of exceptions.
 * @param {Object}		prefixesObject	        An Object that contains the arrays of prefixes.
 *
 * @returns {boolean}	Whether the word was found on the exception list or not.
 */
export function checkIfWordIsOnListThatCanHavePrefix( word, exceptionList, prefixesObject ) {
	const prefixes = flattenSortLength( prefixesObject );

	// Check whether the inputted word starts with one of the prefixes
	const foundPrefix = prefixes.find( prefix => word.startsWith( prefix ) );
	let stemmedWordWithoutPrefix = "";

	if ( typeof( foundPrefix ) === "string" ) {
		stemmedWordWithoutPrefix = word.slice( foundPrefix.length );
		// At least 3 characters left after prefix deletion so that e.g. "be" is not treated as a prefix if found in the word "berg".
		if ( stemmedWordWithoutPrefix.length > 2 ) {
			word = stemmedWordWithoutPrefix;
		}
	}

	return exceptionList.includes( word );
}

/**
 * Checks whether the word ends in one of the words in an exception list with two stems.
 *
 * @param {Array} exceptionListWithTwoStems The exception list with two stems.
 * @param {string} word	The word to check.
 *
 * @returns {string} The stem.
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
