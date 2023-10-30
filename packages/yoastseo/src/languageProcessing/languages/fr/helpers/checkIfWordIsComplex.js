import { languageProcessing } from "yoastseo";
const { normalizeSingle } = languageProcessing;

const contractionPrefixes = "^(c'|d'|l'|s')";
const contractionRegex = new RegExp( contractionPrefixes );

/**
 * Checks if a word is complex.
 * This is a helper for the Word Complexity assessment. As such, this helper is not bundled in Yoast SEO.
 *
 * @param {object} config The configuration needed for assessing the word's complexity, e.g., the frequency list.
 * @param {string} word The word to check.
 * @param {object}	premiumData The object that contains data for the assessment including the frequency list.
 *
 * @returns {boolean} Whether or not a word is complex.
 */
export default function checkIfWordIsComplex( config, word, premiumData ) {
	const lengthLimit = config.wordLength;
	const frequencyList = premiumData.frequencyList.list;

	// Normalize single quotes before checking for contractions.
	word = normalizeSingle( word );

	/*
	 * We want to remove the definite article l', preposition d' from a word,
	 * since an article or preposition doesn't add any complexity to the word.
	 */
	if ( contractionRegex.test( word ) ) {
		word = word.replace( contractionRegex, "" );
	}

	// The word is not complex if it's less than or the same as the length limit, i.e. 9 characters for French.
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
