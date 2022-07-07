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

	// The word is not complex if it's less than the length limit, i.e. 10 characters for German.
	if ( word.length <= lengthLimit ) {
		return false;
	}
	// The word is not complex if it's in the frequency list.
	if ( frequencyList.includes( word ) ) {
		return false;
	}
	/*
	* If a word is longer than 10 characters and has a plural ending in -e or -s, we remove the ending
	* and check if the singular word can be found in the frequency list.
	* The word is not complex if the singular form is in the list.
	*/
	if ( word.endsWith( "s" || "e" ) ) {
		word = word.substring( 0, word.length - 1 );
		return ! frequencyList.includes( word );
	}
	return true;
}
