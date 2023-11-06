const suffixes = "(en|e|s)$";
const suffixesRegex = new RegExp( suffixes );

/**
 * Checks if a word is complex.
 * This is a helper for the Word Complexity assessment. As such, this helper is not bundled in Yoast SEO.
 *
 * @param {object}	config The configuration needed for assessing the word's complexity, e.g., the frequency list.
 * @param {string}	word The word to check.
 * @param {object}	premiumData The object that contains data for the assessment including the frequency list.
 *
 * @returns {boolean} Whether or not a word is complex.
 */
export default function checkIfWordIsComplex( config, word, premiumData ) {
	const lengthLimit = config.wordLength;
	const frequencyList = premiumData.frequencyList.list;
	// All words are converted to lower case before processing to avoid excluding complex words that start with a capital letter.
	word = word.toLowerCase();

	// The German word is not complex if its length is 10 characters or fewer.
	if ( word.length <= lengthLimit ) {
		return false;
	}

	// The word is not complex if it's in the frequency list.
	if ( frequencyList.includes( word ) ) {
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
