import wordComplexity from "../config/internal/wordComplexity";

/**
 * Checks if a word is complex.
 *
 * @param {string} word The word to check.
 *
 * @returns {boolean} Whether or not a word is complex.
 */
export default function checkIfWordIsComplex( word ) {
	const wordComplexityConfig = wordComplexity;
	const lengthLimit = wordComplexityConfig.wordLength;
	const frequencyList = wordComplexityConfig.frequencyList;
	// Whether uppercased beginning of a word decreases its complexity.
	const doesUpperCaseDecreaseComplexity = wordComplexityConfig.doesUpperCaseDecreaseComplexity;

	// The word is not complex if it's less than the length limit, i.e. 7 characters for English.
	if ( word.length <= lengthLimit ) {
		return false;
	}

	// The word is not complex if it's in the frequency list.
	if ( frequencyList.includes( word ) ) {
		return false;
	}

	/*
	 * In English where capital letter beginning decreases the complexity of a word,
	 * word longer than 7 characters is not complex if it starts with capital letter.
	 */
	if ( doesUpperCaseDecreaseComplexity === true && word[ 0 ].toLowerCase() === word[ 0 ] ) {
		/*
		 * If a word is longer than 7 characters and doesn't start with capital letter,
		 * we check further whether it is a plural ending in -s. If it is, we remove the -s suffix
		 * and check if the singular word can be found in the frequency list.
		 * The word is not complex if the singular form is in the list.
		 */
		if ( word.endsWith( "s" ) ) {
			word = word.substring( 0, word.length - 1 );
			return ! frequencyList.includes( word );
		}
		return true;
	}

	return false;
}
