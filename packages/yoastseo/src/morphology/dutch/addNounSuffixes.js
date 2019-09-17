import { modifyStem } from "../morphoHelpers/suffixHelpers";
import { applySuffixesToStem } from "../morphoHelpers/suffixHelpers";

export function findSuffixes( stemmedWord, typeSuffix ) {
	const stemEndingAndSuffix = typeSuffix.find( stemSuffixPair => stemmedWord.search( new RegExp( stemSuffixPair[ 0 ] ) ) !== -1 );

	if ( typeof stemEndingAndSuffix !== "undefined" ) {
		return stemEndingAndSuffix[ 1 ];
	}
}

export function getSuffixes( stemmedWord, morphologyDataNounSuffixes ) {
	const suffixes = [];
	const predictedSuffix = findSuffixes( stemmedWord, morphologyDataNounSuffixes.predictedBasedOnStem );
	if ( typeof predictedSuffix !== "undefined" ) {
		suffixes.push( predictedSuffix );
		return suffixes;
	} return morphologyDataNounSuffixes.defaultSuffixes;
}

/**
 * Checks whether the stem has an ending for which the final consonant should not be voiced.
 *
 * @param {string} stemmedWord  The stem.
 * @param {string[]} stemEndings The endings to search for in the stem.
 * @returns {boolean} Whether the stem has one of the endings that were searched for.
 */
const shouldConsonantBeVoiced = function( stemmedWord, stemEndings ) {
	return stemmedWord.search( new RegExp( stemEndings[ 0 ] ) === -1  ) && stemmedWord.search( new RegExp( stemEndings[ 1 ] ) === -1 );
};

/**
 * Creates the second stem of words that have two possible stems (this includes
 * stem with double or single vowel; ending in double or single consonant; ending in s/f or z/v). The -en and -etje
 * suffixes should be added to the modified stem.
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
		const triedToVoiceConsonant = modifyStem( stemmedWord, morphologyDataAddSuffixes.stemModifications.consonantVoicing );
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

export function addNounSuffixes( stemmedWord, morphologyDataAddSuffixes, morphologyDataNounSuffixes ) {
	const pluralSuffixes = getSuffixes( stemmedWord, morphologyDataNounSuffixes.pluralSuffixes );

	const diminutiveSuffixes = getSuffixes( stemmedWord, morphologyDataNounSuffixes.diminutiveSuffixes );

	const suffixesForModifiedStem = [];

	const enIndex = pluralSuffixes.indexOf( "en" );
	if ( enIndex !== -1 ) {
		pluralSuffixes.splice( enIndex, 1 );
		suffixesForModifiedStem.push( "en" );
	}
	const etjeIndex = pluralSuffixes.indexOf( "etje" );
	if ( etjeIndex !== -1 ) {
		diminutiveSuffixes.splice( etjeIndex, 1 );
		suffixesForModifiedStem.push( "etje" );
	}

	const suffixesForUnmodifiedStem = pluralSuffixes.concat( diminutiveSuffixes );

	const nounForms = applySuffixesToStem( stemmedWord, suffixesForUnmodifiedStem );

	if ( suffixesForModifiedStem.length > 0 ) {
		const secondStem = findAndApplyModifications( stemmedWord, morphologyDataAddSuffixes );
		const formsWithModifiedStem = applySuffixesToStem( secondStem, suffixesForModifiedStem );
		return nounForms.concat( formsWithModifiedStem );
	}
	return nounForms;
}

