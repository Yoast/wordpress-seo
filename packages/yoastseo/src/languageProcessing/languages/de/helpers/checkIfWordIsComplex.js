import wordComplexity from "../config/internal/wordComplexity";
import functionWords from "../config/functionWords";

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
	word = word.toLowerCase();

	// The German word is not complex if its length is 10 characters or less.
	if ( word.length <= lengthLimit ) {
		return false;
	}
	// The word is not complex if it's in the frequency list or the function words list.
	if ( frequencyList.includes( word ) || functionWords.all.includes( word )  ) {
		return false;
	}
	/*
	* If a word is longer than 10 characters and has a plural ending in -e, -s, or -en, we remove the ending
	* and check if the singular form can be found in the frequency list.
	* The word is not complex if the singular form is in the list.
	*/
	const suffixes = "(en|e|s)$";
	const suffixesRegex = new RegExp( suffixes );

	if ( suffixesRegex.test( word ) ) {
		word = word.replace( suffixesRegex, "" );
		return ! frequencyList.includes( word );
	}
	return true;
}
