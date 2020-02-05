import { modifyStem } from "../morphoHelpers/suffixHelpers";

/**
 * Checks whether the stem has an ending for which the final consonant should be voiced or not.
 *
 * @param {string} stemmedWord  The stem.
 * @param {string[]} notVoicedStemEndings The endings to search for in the stem.
 * @returns {boolean} Whether the stem has one of the endings that were searched for.
 */
export function shouldConsonantBeVoiced( stemmedWord, notVoicedStemEndings ) {
	// Will return true if the ending of the stemmedWord is NOT one of the notVoicedEndings.
	return ! notVoicedStemEndings.find( stemEnding => new RegExp( stemEnding ).test( stemmedWord ) );
}

/**
 * Creates the second stem of words that have two possible stems (this includes
 * stem with double or single vowel; ending in double or single consonant; ending in s/f or z/v). The -en and -end
 * suffixes are then added to the modified stem.
 *
 * @param {string} stemmedWord						The stem
 * @param {string[]} dataNoVowelOrConsonantDoubling The no vowel or consonant doubling exception list.
 * @param {object} morphologyDataAddSuffixes The Dutch morphology data file
 * @returns {string} The modified stem, or the original stem if no modifications were made.
 */
export function findAndApplyModificationsVerbsNouns( stemmedWord, dataNoVowelOrConsonantDoubling, morphologyDataAddSuffixes ) {
	const triedToDoubleConsonant = modifyStem( stemmedWord, morphologyDataAddSuffixes.stemModifications.doublingConsonant );
	if ( ! dataNoVowelOrConsonantDoubling.includes( stemmedWord ) ) {
		if ( triedToDoubleConsonant ) {
			return triedToDoubleConsonant;
		}
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
}
