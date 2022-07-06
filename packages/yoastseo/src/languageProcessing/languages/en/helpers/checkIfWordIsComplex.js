import wordComplexity from "../config/internal/wordComplexity";
/**
 * Checks if a word is complex.
 *
 * @param {string} word     The word to check.
 *
 * @returns {boolean}    Whether or not a word is complex.
 */
export default function checkIfWordIsComplex( word ) {
	const wordComplexityConfig = wordComplexity;
	const lengthLimit = wordComplexityConfig.wordLength;
	const frequencyList = wordComplexityConfig.frequencyList;
	// Whether uppercased beginning of a word decreases its complexity.
	const doesUpperCaseDecreaseComplexity = wordComplexityConfig.doesUpperCaseDecreasesComplexity;

	let isWordComplex = false;

	/*
	 * Check for each word whether it is a complex word or not.
	 * A word is complex if:
	 * its length is longer than the limit, AND
	 * the word is not in the frequency list, AND
	 * if the word does NOT start with a capital letter
	 * (for languages that see long words to be less complex if they start with a capital letter)
	 */
	if ( word.length > lengthLimit && ! frequencyList.includes( word ) ) {
		if ( doesUpperCaseDecreaseComplexity === true && word[ 0 ].toLowerCase() === word[ 0 ] ) {
			isWordComplex = true;
		}
	}
	return isWordComplex;
}
