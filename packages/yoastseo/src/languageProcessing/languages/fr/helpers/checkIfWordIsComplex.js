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

	// The word is not complex if it's less than the length limit, i.e. 9 characters for French.
	if ( word.length <= lengthLimit ) {
		return false;
	}

	// The word is not complex if it's in the frequency list.
	if ( frequencyList.includes( word ) ) {
		return false;
	}

	/*
	 * In French where capital letter beginning decreases the complexity of a word,
	 * word longer than 9 characters is not complex if it starts with capital letter.
	 */
	return word[ 0 ].toLowerCase() === word[ 0 ];
}
