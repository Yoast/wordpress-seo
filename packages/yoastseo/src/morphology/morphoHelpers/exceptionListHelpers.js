import { flattenSortLength } from "../morphoHelpers/flattenSortLength";

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
 * Checks whether a word is on a verb exception list. Before checking the list, checks whether the word has a verb prefix
 * and if it does, removes it.
 *
 * @param {string}	 	word					The word to check.
 * @param {string[]}	exceptionList			The list of exceptions
 * @param {Object}		compoundVerbPrefixes	The list of separable and inseparable verb prefixes
 * @returns {boolean}	Whether the word was found on the exception list or not
 */
export function checkIfWordIsOnVerbExceptionList( word, exceptionList, compoundVerbPrefixes ) {
	const prefixes = flattenSortLength( compoundVerbPrefixes );

	// Check whether the inputted word starts with one of the compound prefixes
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
