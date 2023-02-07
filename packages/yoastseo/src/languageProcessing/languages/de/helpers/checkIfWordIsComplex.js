const suffixes = "(en|e|s)$";
const suffixesRegex = new RegExp( suffixes );

/**
 * Checks if a word is complex.
 * This is a helper for the premium assessment Word Complexity. As such, this helper is registered from the premium repository.
 *
 * @param {object} wordComplexityConfig The config needed for assessing the word complexity.
 * @param {string} word The word to check.
 * @param {object} functionWords The function words list.
 *
 * @returns {boolean} Whether or not a word is complex.
 */
export default function checkIfWordIsComplex( wordComplexityConfig, word, functionWords ) {
	const lengthLimit = wordComplexityConfig.wordLength;
	const frequencyList = wordComplexityConfig.frequencyList;
	// All words are converted to lower case before processing to avoid excluding complex words that start with a capital letter.
	word = word.toLowerCase();

	// The German word is not complex if its length is 10 characters or less.
	if ( word.length <= lengthLimit ) {
		return false;
	}
	// The word is not complex if it's in the frequency list or the function words list.
	if ( frequencyList.includes( word ) || functionWords.includes( word )  ) {
		return false;
	}
	/*
	* If a word is longer than 10 characters and has a plural ending in -e, -s, or -en, we remove the ending
	* and check if the singular form can be found in the frequency list.
	* The word is not complex if the singular form is in the list.
	*/
	if ( suffixesRegex.test( word ) ) {
		word = word.replace( suffixesRegex, "" );
		return ! frequencyList.includes( word );
	}
	return true;
}
