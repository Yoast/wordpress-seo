/**
 * Checks if the input word qualifies for the input regex and if so builds a required form.
 * This function is used for other more specific functions.
 *
 * @param {string} word The word to build forms for.
 * @param {Array} regexes The regex-based array of rules to compare the word against.
 *
 * @returns {string} The newly built form of the word.
 */
export function buildOneFormFromRegex( word, regexes ) {
	if ( regexes.includes( null ) ) {
		return word;
	}
	for ( let i = 0; i < regexes.length; i++ ) {
		if ( regexes[ i ].reg.test( word ) === true ) {
			return word.replace( regexes[ i ].reg, regexes[ i ].repl );
		}
	}
}
