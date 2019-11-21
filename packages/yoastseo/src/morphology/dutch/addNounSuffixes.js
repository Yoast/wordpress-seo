import { modifyStem } from "../morphoHelpers/suffixHelpers";
import { applySuffixesToStem } from "../morphoHelpers/suffixHelpers";

/**
 * Searches for a match at the end of the stem, and returns the corresponding suffix if matched.
 *
 * @param {string} stemmedWord The stemmed word
 * @param {string[]} suffixType Whether plural or diminutive suffixes are being searched for.
 * @returns {string} The suffix.
 *
 */
export function findSuffixes( stemmedWord, suffixType ) {
	const stemEndingAndSuffix = suffixType.find( stemSuffixPair => stemmedWord.search( new RegExp( stemSuffixPair[ 0 ] ) ) !== -1 );

	if ( typeof stemEndingAndSuffix !== "undefined" ) {
		return stemEndingAndSuffix[ 1 ];
	}
}

/**
 * Gets the diminutive or plural suffix predicted based on stem ending or the default suffix(es) if no suffix can be predicted.
 *
 * @param {string} stemmedWord The stemmed word.
 * @param {Object} morphologyDataNounSuffixes The morphology data with either plural or diminutive noun suffixes.
 * @returns {Array} The suffixes.
 */
export function getSuffixes( stemmedWord, morphologyDataNounSuffixes ) {
	const suffixes = [];
	const predictedSuffix = findSuffixes( stemmedWord, morphologyDataNounSuffixes.predictedBasedOnStem );

	if ( typeof predictedSuffix !== "undefined" ) {
		suffixes.push( predictedSuffix );
		return suffixes;
	}

	return morphologyDataNounSuffixes.defaultSuffixes.slice();
}

/**
 * Gets the predicted or default plural suffixes. Then checks whether extra suffixes should be imported based on the stem's ending.
 * If extra suffixes are imported, they are then added to the plural suffixes array.
 *
 * @param {string} stemmedWord The stemmed word.
 * @param {Object} morphologyDataPluralSuffixes The morphology data for adding plural noun suffixes.
 * @returns {string[]} The plural suffixes.
 */
const getPluralSuffixes = function( stemmedWord, morphologyDataPluralSuffixes ) {
	let pluralSuffixes = getSuffixes( stemmedWord, morphologyDataPluralSuffixes );

	const extraPluralSuffixes = findSuffixes( stemmedWord, morphologyDataPluralSuffixes.extraSuffixes );

	if ( typeof extraPluralSuffixes !== "undefined" ) {
		pluralSuffixes = pluralSuffixes.concat( extraPluralSuffixes );
	}
	return pluralSuffixes;
};

/**
 * Checks whether the stem has an ending for which the final consonant should be voiced or not.
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
 * Creates additional modified stems if needed and adds the relevant suffixes to the stem(s) in order to create noun forms.
 *
 * @param {string} stemmedWord The stemmed word.
 * @param {Object} morphologyDataAddSuffixes The morphology data for adding suffixes.
 * @param {Object} morphologyDataNounSuffixes The morphology data for adding noun suffixes.
 * @returns {string[]} The noun forms created by adding suffixes to the stem(s).
 */
export function addNounSuffixes( stemmedWord, morphologyDataAddSuffixes, morphologyDataNounSuffixes ) {
	/* If the noun ends in -heid, create the plural form by replacing -heid with -heden and return the plural form (-heid
	nouns do not have diminutive forms). */

	const triedHeidToHeden = modifyStem( stemmedWord, morphologyDataAddSuffixes.stemModifications.heidToHeden );
	if ( triedHeidToHeden ) {
		return [ triedHeidToHeden ];
	}

	// Get plural suffixes.
	const pluralSuffixes = getPluralSuffixes( stemmedWord, morphologyDataNounSuffixes.pluralSuffixes );

	// Get diminutive suffixes.
	const diminutiveSuffixes = getSuffixes( stemmedWord, morphologyDataNounSuffixes.diminutiveSuffixes );

	// Join the diminutive and plural suffixes
	let combinedSuffixes = pluralSuffixes.concat( diminutiveSuffixes );

	const nounForms = [];

	/* If the kje suffix exists in the suffixes for this word,
	remove the last character of the stem, attach the suffix to the stem, and add the resulting
	form to the noun forms array. */
	if ( combinedSuffixes.includes( "kje" ) ) {
		combinedSuffixes = combinedSuffixes.filter( suffix => suffix !== "kje" );
		const kjeForm = stemmedWord.slice( 0, -1 ) + "kje";
		nounForms.push( kjeForm );
	}

	// Then find the suffixes that require a stem modification (except for "kje")...
	const stemModificationSuffixes = [ "en", "ers", "es", "etje" ];
	const suffixesForModifiedStem = combinedSuffixes.filter( suffix => stemModificationSuffixes.includes( suffix ) );

	// ...and remove them from the suffixesForUnmodifiedStem array;
	const suffixesForUnmodifiedStem = combinedSuffixes.filter( suffix => ! suffixesForModifiedStem.includes( suffix ) );

	// Make forms by attaching suffixes to the unmodified stem.
	nounForms.push( applySuffixesToStem( stemmedWord, suffixesForUnmodifiedStem ) );

	/* If any other suffixes that require stem modifications were found, run through the modification checks and modify the stem if needed.
	   Then attach the given suffixes to the modified stem and add the resulting forms to the noun forms. */
	if ( suffixesForModifiedStem ) {
		const secondStem = findAndApplyModifications( stemmedWord, morphologyDataAddSuffixes );
		const formsWithModifiedStem = applySuffixesToStem( secondStem, suffixesForModifiedStem );

		return nounForms.concat( formsWithModifiedStem );
	}
	return nounForms;
}

