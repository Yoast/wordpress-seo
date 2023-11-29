import { normalizeSingle } from "../../../helpers/sanitize/quotes";

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
		const standardSPluralSuffixesRegex = new RegExp( premiumData.suffixGroupsComplexity.standardSuffixesWithSplural );
		const standardXPluralSuffixesRegex = new RegExp( premiumData.suffixGroupsComplexity.standardSuffixesWithXplural );
		const irregularPluralSingularSuffixes = premiumData.suffixGroupsComplexity.irregularPluralSingularSuffixes;
		const irregularPluralSuffixRegex = new RegExp( irregularPluralSingularSuffixes[ 0 ] );

		/*
		 * If a word is longer than 9 characters and doesn't start with capital letter,
		 * we check further whether it is a plural that ends on the -s or -x plural suffix. If it is, we remove the plural suffix
		 * and check if the singular word can be found in the frequency list.
		 * if it is a plural that does not end on -s or -x but on -aux, we replace the plural -aux suffix with the singular suffix -al.
		 * The word is not complex if the singular form is in the list.
		 */
		if ( standardSPluralSuffixesRegex.test( word ) || standardXPluralSuffixesRegex.test( word ) ) {
			word = word.substring( 0, word.length - 1 );
		} else if ( irregularPluralSuffixRegex.test( word ) ) {
			word = word.replace( irregularPluralSuffixRegex, irregularPluralSingularSuffixes[ 1 ] );
		}
		return ! frequencyList.includes( word );
	}

	return false;
}
