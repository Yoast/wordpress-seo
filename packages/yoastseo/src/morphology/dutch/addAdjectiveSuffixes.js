import { modifyStem } from "../morphoHelpers/suffixHelpers";

/**
 * Returns the inflected suffix depending on the ending of the stem.
 *
 * @param {Object}  morphologyDataAdjectives    The Dutch morphology data for adjectives.
 * @param {string}  stemmedWord                 The stemmed word for which to get suffixes.
 *
 * @returns {string} The correct inflected suffixes for the given stem.
 */
export function getSuffixesInflected( morphologyDataAdjectives, stemmedWord ) {
	const takesTremaEnding = morphologyDataAdjectives.takesTremaEnding.slice();

	if ( stemmedWord.search( new RegExp( takesTremaEnding ) ) !== -1 ) {
		return morphologyDataAdjectives.inflectedSuffixTremaE;
	}

	return morphologyDataAdjectives.inflectedSuffixE;
}

/**
 * Returns a set of comparative suffixes depending on the ending of the stem.
 *
 * @param {Object}  morphologyDataAdjectives    The Dutch morphology data.
 * @param {string}  stemmedWord                 The stemmed word for which to get suffixes.
 *
 * @returns {string[]} The correct comparative suffixes for the given stem.
 */
export function getSuffixesComparative( morphologyDataAdjectives, stemmedWord ) {
	const takesDerEnding = morphologyDataAdjectives.takesComparativeDerEnding.slice();
	const takesREnding = morphologyDataAdjectives.takesComparativeREnding.slice();
	const takesTremaEnding = morphologyDataAdjectives.takesTremaEnding.slice();

	if ( stemmedWord.endsWith( takesDerEnding ) ) {
		return morphologyDataAdjectives.comparativeSuffixesDer;
	} else if ( stemmedWord.search( new RegExp( takesREnding ) ) !== -1 ) {
		return morphologyDataAdjectives.comparativeSuffixesR;
	} else if ( stemmedWord.search( new RegExp( takesTremaEnding ) ) !== -1 ) {
		return morphologyDataAdjectives.comparativeSuffixesTrema;
	}

	return morphologyDataAdjectives.comparativeSuffixesEr;
}
/**
 * Returns a set of superlative suffixes depending on the ending of the stem.
 *
 * @param {Object}  morphologyDataAdjectives    The Dutch morphology data for adjectives.
 * @param {string}  stemmedWord                 The stemmed word for which to get suffixes.
 *
 * @returns {string[]} The correct superlative suffixes for the given stem.
 */
export function getSuffixesSuperlative( morphologyDataAdjectives, stemmedWord ) {
	const takesTEnding = morphologyDataAdjectives.takesSuperlativeTEnding.slice();

	if ( stemmedWord.endsWith( takesTEnding ) ) {
		return morphologyDataAdjectives.superlativeSuffixesT;
	}

	return morphologyDataAdjectives.superlativeSuffixesSt;
}

/**
 * Creates the second stem of words that have two possible stems (this includes stem ending in -ieel or -iël;
 * stem with double or single vowel; ending in double or single consonant; ending in s/f or z/v). The inflected and comparative
 * suffixes are then added to the modified stem.
 *
 * @param {string} stemmedWord 					   The stem
 * @param {string[]} typeSuffix 				   The type of suffix that should be added to the inputted stem.
 * @param {object} morphologyDataStemModifications The Dutch stem modifications data.
 * @returns {string} The modified stem, or the original stem if no modifications were made.
 */
export function findAndApplyModifications( stemmedWord, typeSuffix, morphologyDataStemModifications ) {
	const triedToChangeIeelToIel = modifyStem( stemmedWord, morphologyDataStemModifications.ieelToIel );
	if ( triedToChangeIeelToIel ) {
		return triedToChangeIeelToIel;
	}

	const triedToDoubleConsonant = modifyStem( stemmedWord, morphologyDataStemModifications.doublingConsonant );
	if ( triedToDoubleConsonant ) {
		return triedToDoubleConsonant;
	}

	const triedToVoiceConsonant = modifyStem( stemmedWord, morphologyDataStemModifications.consonantVoicing );
	if ( triedToVoiceConsonant ) {
		return triedToVoiceConsonant;
	}

	if ( ! typeSuffix.includes( "der" ) ) {
		const triedToUndoubleVowel = modifyStem( stemmedWord, morphologyDataStemModifications.vowelUndoubling );
		if ( triedToUndoubleVowel ) {
			return triedToUndoubleVowel;
		}
	}
	return stemmedWord;
}


/**
 * Adds partitive suffix to the stem.
 *
 * @param {object} morphologyDataAdjectives The Dutch morphology data for adjectives.
 * @param {string} stemmedWord 				The stemmed word for which to get suffixes.
 *
 * @returns {string} The suffixed adjective form.
 */
export function addPartitiveSuffix( morphologyDataAdjectives, stemmedWord ) {
	const partitiveSuffix = morphologyDataAdjectives.partitiveSuffix;

	return stemmedWord.concat( partitiveSuffix );
}

/**
 * Adds the inflected suffix to the stem. Before adding the suffixes, the stem is modified if needed.
 *
 * @param {Object}      morphologyDataAdjectives   		 The Dutch morphology data for adjectives.
 * @param {Object}		morphologyDataStemModifications	 The Dutch stem modifications data.
 * @param {string}      stemmedWord        				 The stemmed word for which to get suffixes.
 *
 * @returns {string} The suffixed adjective form.
 */
export function addInflectedSuffix( morphologyDataAdjectives, morphologyDataStemModifications, stemmedWord ) {
	const inflectedSuffix = getSuffixesInflected( morphologyDataAdjectives, stemmedWord );

	stemmedWord = findAndApplyModifications( stemmedWord, inflectedSuffix, morphologyDataStemModifications );

	return stemmedWord.concat( inflectedSuffix );
}

/**
 * Adds the comparative suffixes to the stem. Before adding the suffixes, the stem is modified if needed.
 *
 * @param {Object}      morphologyDataAdjectives   		The Dutch morphology data for adjectives.
 * @param {Object}		morphologyDataStemModifications	The Dutch stem modifications data.
 * @param {string}      stemmedWord         			The stemmed word for which to get suffixes.
 *
 * @returns {string[]} The suffixed adjective forms.
 */
export function addComparativeSuffixes( morphologyDataAdjectives, morphologyDataStemModifications, stemmedWord ) {
	const comparativeSuffixes = getSuffixesComparative( morphologyDataAdjectives, stemmedWord );

	stemmedWord = findAndApplyModifications( stemmedWord, comparativeSuffixes, morphologyDataStemModifications );

	return comparativeSuffixes.map( suffix => stemmedWord.concat( suffix ) );
}

/**
 * Adds the superlative suffixes to the stem.
 *
 * @param {Object}      morphologyDataAdjectives    The Dutch morphology data for adjectives.
 * @param {string}      stemmedWord                 The stemmed word for which to get suffixes.
 *
 * @returns {string[]} The suffixed adjective forms.
 */
export function addSuperlativeSuffixes( morphologyDataAdjectives, stemmedWord ) {
	const superlativeSuffixes = getSuffixesSuperlative( morphologyDataAdjectives, stemmedWord );

	return superlativeSuffixes.map( suffix => stemmedWord.concat( suffix ) );
}

/**
 * Adds all suffixes (partitive, inflected, comparative, superlative) to the stem.
 *
 * @param {Object}      morphologyDataAdjectives    	The Dutch morphology data for adjectives.
 * @param {Object}		morphologyDataStemModifications	The Dutch stem modifications data.
 * @param {string}      stemmedWord        				The stemmed word for which to get suffixes.
 *
 * @returns {string[]} The suffixed adjective forms.
 */
export function addAllAdjectiveSuffixes( morphologyDataAdjectives, morphologyDataStemModifications, stemmedWord ) {
	const comparativeForms = addComparativeSuffixes( morphologyDataAdjectives, morphologyDataStemModifications, stemmedWord );
	const superlativeForms = addSuperlativeSuffixes( morphologyDataAdjectives, stemmedWord );
	const inflectedForm = addInflectedSuffix( morphologyDataAdjectives, morphologyDataStemModifications, stemmedWord );

	const adjectiveForms = comparativeForms.concat( superlativeForms );
	adjectiveForms.push( inflectedForm );

	if ( stemmedWord.endsWith( "s" ) ) {
		return adjectiveForms;
	}
	const partitiveForm = addPartitiveSuffix( morphologyDataAdjectives, stemmedWord );
	adjectiveForms.push( partitiveForm );

	return adjectiveForms;
}
