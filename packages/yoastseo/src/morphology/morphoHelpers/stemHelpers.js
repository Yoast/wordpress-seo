/**
 * Checks whether the word is in a given list of exceptions and if so, deletes a given suffix.
 *
 * @param {string[]}    exceptions  The exception list.
 * @param {string}      suffix      The suffix that needs to be deleted.
 * @param {string}      word        The word to check.
 *
 * @returns {string} The stemmed word.
 */
const removeSuffixFromFullForm = function( exceptions, suffix, word ) {
	for ( let i = 0; i < exceptions.length; i++ ) {
		if ( word.endsWith( exceptions[ i ] ) ) {
			return word.slice( 0, -suffix.length );
		}
	}
};

export {
	removeSuffixFromFullForm,
};
