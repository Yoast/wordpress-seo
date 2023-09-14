import { languageProcessing } from "yoastseo";
import { isUndefined } from "lodash-es";
import { endsWithIng } from "./internal/getVerbStem";
const { buildFormRule, createRulesFromArrays } = languageProcessing;

/**
 * Checks if a word is complex.
 * This is a helper for the Word Complexity assessment. As such, this helper is not bundled in Yoast SEO.
 *
 * @param {object} config The configuration needed for assessing the word's complexity, e.g., the frequency list.
 * @param {string} word The word to check.
 * @param {Object} morphologyData morphology data for the language
 *
 * @returns {boolean} Whether or not a word is complex.
 */
export default function checkIfWordIsComplex( config, word, morphologyData ) {
	const lengthLimit = config.wordLength;
	const frequencyList = config.frequencyList;
	// Whether uppercased beginning of a word decreases its complexity.
	const doesUpperCaseDecreaseComplexity = config.doesUpperCaseDecreaseComplexity;

	// The word is not complex if it's less than the length limit, i.e. 7 characters for English.
	if ( word.length <= lengthLimit ) {
		return false;
	}

	// The word is not complex if it's in the frequency list.
	if ( frequencyList.includes( word ) ) {
		return false;
	}
	/*
	 * In English where capital letter beginning decreases the complexity of a word,
	 * word longer than 7 characters is not complex if it starts with capital letter.
	 */
	if ( doesUpperCaseDecreaseComplexity === true && word[ 0 ].toLowerCase() === word[ 0 ] ) {
		/*
		 * If a word is longer than 7 characters and doesn't start with capital letter,
		 * we check further whether it is a plural ending in -s. If it is, we singularize it using the stemmer
		 * and check if the singular word can be found in the frequency list.
		 * The word is not complex if the singular form is in the list.
		 */
		const regexVerb = morphologyData.verbs.regexVerb;
		const singularizeIfPlural = buildFormRule( word, createRulesFromArrays( morphologyData.nouns.regexNoun.singularize ) );
		if ( ! isUndefined( singularizeIfPlural ) ) {
			// Bring ing-nouns to base forms ("blessings" -> "bless").
			if ( endsWithIng( singularizeIfPlural ) ) {
				word = buildFormRule( singularizeIfPlural, createRulesFromArrays( regexVerb.ingFormToInfinitive ) );
			}
			word = singularizeIfPlural;
		}
		if ( ! frequencyList.includes( word ) ) {
			return true;
		}
		return true;
	}
	return false;
}
