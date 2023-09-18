import { languageProcessing } from "yoastseo";
const { buildFormRule, createRulesFromArrays } = languageProcessing;

/**
 * Checks if a word is complex.
 * This is a helper for the Word Complexity assessment. As such, this helper is not bundled in Yoast SEO.
 *
 * @param {object} config The configuration needed for assessing the word's complexity, e.g., the frequency list.
 * @param {string} word The word to check.
 * @param {Object} [morphologyData] Optional morphology data.
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

	// The word is not complex if it starts with a capital and thus is assumed to be a named entity.
	if ( doesUpperCaseDecreaseComplexity && word[ 0 ].toLowerCase() !== word[ 0 ] ) {
		return false;
	}

	// The word is not complex if it's in the frequency list.
	if ( frequencyList.includes( word ) ) {
		return false;
	}

	// The word is not complex if it's singular form is in the frequency list.
	if ( morphologyData ) {
		const singular = buildFormRule( word, createRulesFromArrays( morphologyData.nouns.regexNoun.singularize ) );
		return ! frequencyList.includes( singular );
	}

	return true;
}
