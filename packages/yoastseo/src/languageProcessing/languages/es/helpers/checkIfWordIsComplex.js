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

	// The Spanish word is not complex if its length is 7 characters or fewer.
	if ( word.length <= lengthLimit ) {
		console.log("TEST lengthlimit", word);
		return false;
	}

	// The Spanish word starts with a capital and thus is assumed to be a named entity.
	if ( word[ 0 ].toLowerCase() !== word[ 0 ] ) {
		console.log("TEST isuppercase", word);
		return false;
	}

	// The word is not complex if it's in the frequency list or the function words list.
	if ( frequencyList.includes( word ) || functionWords.all.includes( word )  ) {
		console.log("TEST inwordlist", word);
		return false;
	}
	/*
	* If a word is longer than 7 characters and has a plural ending in -es or -s, we remove the ending
	* and check if the singular form can be found in the frequency list.
	* The word is not complex if the singular form is in the list.
	*/
	// const vowels = "aeiuoy";
	// const consonants = "bcdfghjklmnpqrstvwxz";
	const suffixes = "(s|es)$";
	const suffixesRegex = new RegExp( suffixes );

	if ( suffixesRegex.test( word ) ) {
		const normalizedWord = word.normalize( "NFD" );
		word = normalizedWord.replace( suffixesRegex, "" );
		console.log("TEST plural and in wordlist", word);
		return ! frequencyList.includes( word );
	}
	console.log("TEST iscomplex", word);
	return true;
}
