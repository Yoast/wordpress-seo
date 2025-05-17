import buildFormRule from "../../../helpers/morphology/buildFormRule";
import createRulesFromArrays from "../../../helpers/morphology/createRulesFromArrays";

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

	// Whether uppercased beginning of a word decreases its complexity.
	const doesUpperCaseDecreaseComplexity = config.doesUpperCaseDecreaseComplexity;

	// The word is not complex if it's less than or the same as the length limit, i.e. 7 characters for English.
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

	// The word is not complex if its singular form is in the frequency list.
	if ( premiumData ) {
		const singular = buildFormRule( word, createRulesFromArrays( premiumData.nouns.regexNoun.singularize ) );
		return ! frequencyList.includes( singular );
	}

	return true;
}
