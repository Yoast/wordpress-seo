/**
 * Checks if the input word qualifies for the input regex and if so builds a required form.
 * This function is used for other more specific functions.
 *
 * @param {string} word The word to build forms for.
 * @param {Array} regex The regex-based array of rules to compare the word against.
 *
 * @returns {string} The newly built form of the word.
 */
const buildOneFormFromRegex = function( word, regex ) {
	for ( let i = 0; i < regex.length; i++ ) {
		if ( regex[ i ].reg.test( word ) === true ) {
			return word.replace( regex[ i ].reg, regex[ i ].repl );
		}
	}
};

/**
 * Checks if the input word qualifies for the input regex and if so builds two required forms.
 * This function is used for other more specific functions.
 *
 * @param {string} word The word for which to determine its forms.
 * @param {Array} regex The regex-based array of rules to compare the word against.
 *
 * @returns {Array} Array of word forms.
 */
const buildTwoFormsFromRegex = function( word, regex ) {
	for ( let i = 0; i < regex.length; i++ ) {
		if ( regex[ i ].reg.test( word ) === true ) {
			return [
				word.replace( regex[ i ].reg, regex[ i ].repl1 ),
				word.replace( regex[ i ].reg, regex[ i ].repl2 ),
			];
		}
	}
};

module.exports = {
	buildOneFormFromRegex: buildOneFormFromRegex,
	buildTwoFormsFromRegex: buildTwoFormsFromRegex,
};
