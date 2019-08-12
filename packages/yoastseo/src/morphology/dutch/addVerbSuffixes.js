import { removeSuffixesBeforeAdding } from "../morphoHelpers/suffixHelpers";
import { doubleFinalLetter } from "../morphoHelpers/suffixHelpers";
import { modifyStem } from "../morphoHelpers/suffixHelpers";
import { applySuffixesToStem } from "../morphoHelpers/suffixHelpers";

const shouldConsonantBeVoiced = function( stemmedWord, stemEndings ) {
	return stemmedWord.search( new RegExp( stemEndings[ 0 ] ) === -1  ) && stemmedWord.search( new RegExp( stemEndings[ 1 ] ) === -1 )
};

/**
 * Creates the second stem of words that have two possible stems (this includes
 * stem with double or single vowel; ending in double or single consonant; ending in s/f or z/v). The -en and -end
 * suffixes are then added to the modified stem.
 *
 * @param {string} stemmedWord The stem
 * @param {object} morphologyDataNL The Dutch morphology data file
 * @returns {string} The modified stem, or the original stem if no modifications were made.
 */
const findAndApplyModifications = function( stemmedWord, morphologyDataNL ) {
	const doubleConsonantModification = modifyStem( stemmedWord, morphologyDataNL.addSuffixes.stemModifications.doublingConsonant );
	if ( doubleConsonantModification.foundModification === true ) {
		stemmedWord = doubleFinalLetter( stemmedWord );
		return stemmedWord;
	}
	if ( shouldConsonantBeVoiced( stemmedWord, morphologyDataNL.addSuffixes.otherChecks.noConsonantVoicingVerbs ) ) {
		const voiceConsonantModification = modifyStem( stemmedWord, morphologyDataNL.addSuffixes.stemModifications.consonantVoicing );
		if ( voiceConsonantModification.foundModification === true ) {
			stemmedWord = voiceConsonantModification.stemmedWord;
			return stemmedWord;
		}
	}
	const undoubleVowelModificationOther = modifyStem( stemmedWord, morphologyDataNL.addSuffixes.stemModifications.vowelUndoublingOther );
	if ( undoubleVowelModificationOther.foundModification === true ) {
		stemmedWord = undoubleVowelModificationOther.stemmedWord;
		return stemmedWord;
		}

	return stemmedWord;
};


export function addVerbSuffixes( stemmedWord, morphologyDataNL) {
	const morphologyDataVerbs = morphologyDataNL.verbs;

	const suffixesWithoutStemModification = removeSuffixesBeforeAdding( morphologyDataVerbs.suffixDeletions, morphologyDataVerbs.suffixesNoStemModification, stemmedWord );

	if ( stemmedWord.endsWith(morphologyDataVerbs.notTakingAnySuffixes.some ) ) {
		return [];
	}

	const secondStem = findAndApplyModifications( stemmedWord, morphologyDataNL );

	const tAndDForms = applySuffixesToStem( stemmedWord, suffixesWithoutStemModification );

	const enAndEndForms = applySuffixesToStem( secondStem, morphologyDataVerbs.suffixesWithStemModification );

	return tAndDForms.concat(enAndEndForms)

}
