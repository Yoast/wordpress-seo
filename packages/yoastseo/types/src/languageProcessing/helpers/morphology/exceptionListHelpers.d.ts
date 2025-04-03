/**
 * Checks whether the word ends in one of the words in an exception list that is a simple array.
 *
 * @param {string}	    word            The word to check.
 * @param {string[]}	exceptionList	The list of exceptions.
 *
 * @returns {boolean}	Whether the checked word ends in one of the words in the exception list.
 */
export function checkIfWordEndingIsOnExceptionList(word: string, exceptionList: string[]): boolean;
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
export function checkIfWordIsOnListThatCanHavePrefix(word: string, exceptionList: string[], prefixesObject: Object): boolean;
/**
 * Checks whether the word ends in one of the words in an exception list with two stems.
 *
 * @param {Array} exceptionListWithTwoStems The exception list with two stems.
 * @param {string} word	The word to check.
 *
 * @returns {string} The stem.
 */
export function checkExceptionListWithTwoStems(exceptionListWithTwoStems: any[], word: string): string;
