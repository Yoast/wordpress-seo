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

	/*
	 * We want to remove the definite article l' and preposition d' from a word,
	 * since an article or preposition doesn't add any complexity to the word.
	 */
	if ( word.startsWith( "l'" ) || word.startsWith( "d'" ) ) {
		word = word.substring( 2, word.length );
	}

	// The word is not complex if it's less than the length limit, i.e. 9 characters for French.
	if ( word.length <= lengthLimit ) {
		return false;
	}

	// The word is not complex if it's in the frequency list.
	if ( frequencyList.includes( word ) || functionWords.all.includes( word ) ) {
		return false;
	}

	/*
	 * In French where capital letter beginning decreases the complexity of a word,
	 * word longer than 9 characters is not complex if it starts with capital letter.
	 */
	if ( word[ 0 ].toLowerCase() === word[ 0 ] ) {
		/*
		 * If a word is longer than 9 characters and doesn't start with capital letter,
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
