import { removeSuffixesBeforeAdding } from "../morphoHelpers/suffixHelpers";
import { modifyStem } from "../morphoHelpers/suffixHelpers";
import { applySuffixesToStem } from "../morphoHelpers/suffixHelpers";

/**
 * Checks whether the stem has an ending for which the final consonant should not be voiced.
 *
 * @param {string} stemmedWord  The stem.
 * @param {string[]} notVoicedStemEndings The endings to search for in the stem.
 * @returns {boolean} Whether the stem has one of the endings that were searched for.
 */
const shouldConsonantBeVoiced = function( stemmedWord, notVoicedStemEndings ) {
	// Will return true if the ending of the stemmedWord is NOT one of the notVoicedEndings.
	return ! notVoicedStemEndings.find( stemEnding => new RegExp( stemEnding ).test( stemmedWord ) );
};

/**
 * Creates the second stem of words that have two possible stems (this includes
 * stem with double or single vowel; ending in double or single consonant; ending in s/f or z/v). The -en and -end
 * suffixes are then added to the modified stem.
 *
 * @param {string} stemmedWord The stem
 * @param {object} morphologyDataAddSuffixes The Dutch morphology data file
 * @returns {string} The modified stem, or the original stem if no modifications were made.
 */
const findAndApplyModifications = function( stemmedWord, morphologyDataAddSuffixes ) {
	const triedToDoubleConsonant = modifyStem( stemmedWord, morphologyDataAddSuffixes.stemModifications.doublingConsonant );
	if ( triedToDoubleConsonant ) {
		return triedToDoubleConsonant;
	}
	if ( shouldConsonantBeVoiced( stemmedWord, morphologyDataAddSuffixes.otherChecks.noConsonantVoicingNounsVerbs ) ) {
		const triedToVoiceConsonant = modifyStem( stemmedWord, morphologyDataAddSuffixes.stemModifications.consonantVoicingNounsVerbs );
		if ( triedToVoiceConsonant ) {
			return triedToVoiceConsonant;
		}
	}
	const triedToUndoubleVowel = modifyStem( stemmedWord, morphologyDataAddSuffixes.stemModifications.vowelUndoubling );
	if ( triedToUndoubleVowel ) {
		return triedToUndoubleVowel;
	}

	return stemmedWord;
};

/**
 * Add all of the verb suffixes that are needed for the given stem.
 *
 * @param {string} stemmedWord	The stem
 * @param {Object} morphologyDataAddSuffixes  The Dutch morphology data for adding suffixes.
 * @param {Object} morphologyDataVerbs  	The Dutch verb morphology data.
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
	const secondStem = findAndApplyModifications( stemmedWord, morphologyDataAddSuffixes );

	// Add -t or -d suffixes to the first stem.
	const tAndDForms = applySuffixesToStem( stemmedWord, suffixesWithoutStemModification );

	// Add the -en and -end suffixes to the second stem.
	const enAndEndForms = applySuffixesToStem( secondStem, morphologyDataVerbs.suffixesWithStemModification );

	// Return all suffixed forms.
	return tAndDForms.concat( enAndEndForms );
}
