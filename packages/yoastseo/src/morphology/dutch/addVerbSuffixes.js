import { applySuffixesToStem, removeSuffixesBeforeAdding } from "../morphoHelpers/suffixHelpers";
import { findAndApplyModificationsVerbsNouns } from "./suffixHelpers";

/**
 * Add all of the verb suffixes that are needed for the given stem.
 *
 * @param {string} stemmedWord					The stem.
 * @param {Object} morphologyDataAddSuffixes  	The Dutch morphology data for adding suffixes.
 * @param {Object} morphologyDataVerbs  		The Dutch verb morphology data.
 *
 * @returns {string[]} The suffixed forms.
 */
export function addVerbSuffixes( stemmedWord, morphologyDataAddSuffixes, morphologyDataVerbs ) {
	const suffixDeletions = morphologyDataVerbs.suffixDeletions;
	const allSuffixesNoStemModification = morphologyDataVerbs.suffixesNoStemModification;

	// Remove suffixes that should not be added based on the stem ending.
	const suffixesWithoutStemModification = removeSuffixesBeforeAdding( suffixDeletions, allSuffixesNoStemModification, stemmedWord );

	// If the stem has a ending that is not possible in a verb, do not add verb suffixes.
	const nonVerbEndings = morphologyDataVerbs.notTakingAnySuffixes;
	for ( const ending of nonVerbEndings ) {
		if ( stemmedWord.endsWith( ending ) ) {
			return [];
		}
	}
	// Create a second stem (this is possibly the same as the original stem).
	const secondStem = findAndApplyModificationsVerbsNouns( stemmedWord, morphologyDataAddSuffixes );

	// Add -t or -d suffixes to the first stem.
	const tAndDForms = applySuffixesToStem( stemmedWord, suffixesWithoutStemModification );

	const enAndEndForms = [];

	// Add the -en and -end suffixes to the second stem.
	enAndEndForms.push( applySuffixesToStem( secondStem, morphologyDataVerbs.suffixesWithStemModification ) );
	// Return all suffixed forms.
	const allVerbForms = tAndDForms.concat( enAndEndForms );
	return  flatten( allVerbForms );
}

