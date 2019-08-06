
/**
 * Returns the inflected suffix depending on the ending of the stem.
 *
 * @param {Object}  morphologyDataAdjectives    The Dutch morphology data for adjectives.
 * @param {string}  stemmedWord                 The stemmed word for which to get suffixes.
 *
 * @returns {string} The correct inflected suffixes for the given stem.
 */
export function getSuffixesInflected( morphologyDataAdjectives, stemmedWord ) {
	const takesUmlautEnding = morphologyDataAdjectives.takesUmlautEnding.slice();

	if ( stemmedWord.search( new RegExp( takesUmlautEnding ) ) !== -1 ) {
		return morphologyDataAdjectives.inflectedSuffixUmlautE;
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
	const takesUmlautEnding = morphologyDataAdjectives.takesUmlautEnding.slice();

	if ( stemmedWord.endsWith( takesDerEnding ) ) {
		return morphologyDataAdjectives.comparativeSuffixesDer;
	} else if ( stemmedWord.search( new RegExp( takesREnding ) ) !== -1 ) {
		return morphologyDataAdjectives.comparativeSuffixesR;
	} else if ( stemmedWord.search( new RegExp( takesUmlautEnding ) ) !== -1 ) {
		return morphologyDataAdjectives.comparativeSuffixesUmlaut;
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
 * Doubles the final letter of the word.
 *
 * @param {string} stemmedWord The stemmed word that should have its final consonant doubled.
 * @returns {string} The stem with the final letter of the word doubled.
 */
const doubleFinalLetter = function( stemmedWord ) {
	const finalLetter = stemmedWord.slice( -1 );

	return stemmedWord.concat( finalLetter );
};

/**
 * Modifies the stem if the stem ending matches one of the regexes from a given modification group.
 *
 * @param {string} stemmedWord The stem.
 * @param {string[]} modificationGroup The type of modification
 * @returns {{stemmedWord: string, foundModification: boolean}} The stem and information about whether a modification was
 * performed or not.
 */
const modifyStem = function( stemmedWord, modificationGroup ) {
	const neededReplacement = modificationGroup.find( replacement => stemmedWord.search( new RegExp( replacement[ 0 ] ) ) !== -1 );
	let foundModification = false;

	if ( typeof neededReplacement !== "undefined" ) {
		stemmedWord = stemmedWord.replace( new RegExp( neededReplacement[ 0 ] ), neededReplacement[ 1 ] );
		foundModification = true;

		return { stemmedWord, foundModification };
	}
	return { stemmedWord, foundModification };
};

/**
 * Creates the second stem of words that have two possible stems (this includes stem ending in -ieel or -iël;
 * stem with double or single vowel; ending in double or single consonant; ending in s/f or z/v). The inflected and comparative
 * suffixes are then added to the modified stem.
 *
 * @param {string} stemmedWord The stem
 * @param {string} typeSuffix The type of suffix that should be added to the inputted stem.
 * @param {object} morphologyDataNL The Dutch morphology data file
 * @returns {string} The modified stem, or the original stem if no modifications were made.
 */
const findAndApplyModifications = function( stemmedWord, typeSuffix, morphologyDataNL ) {
	const ieelToIelModification = modifyStem( stemmedWord, morphologyDataNL.addSuffixes.stemModifications.ieelToIel );
	if ( ieelToIelModification.foundModification === true ) {
		stemmedWord = ieelToIelModification.stemmedWord;
		return stemmedWord;
	}
	const doubleConsonantModification = modifyStem( stemmedWord, morphologyDataNL.addSuffixes.stemModifications.doublingConsonant );
	if ( doubleConsonantModification.foundModification === true ) {
		stemmedWord = doubleFinalLetter( stemmedWord );
		return stemmedWord;
	}
	const voiceConsonantModification = modifyStem( stemmedWord, morphologyDataNL.addSuffixes.stemModifications.consonantVoicing );
	if ( voiceConsonantModification.foundModification === true ) {
		stemmedWord = voiceConsonantModification.stemmedWord;
		return stemmedWord;
	}
	if ( typeSuffix === "e" ) {
		const undoubleVowelModificationOther = modifyStem( stemmedWord, morphologyDataNL.addSuffixes.stemModifications.vowelUndoublingOther );
		if ( undoubleVowelModificationOther.foundModification === true ) {
			stemmedWord = undoubleVowelModificationOther.stemmedWord;
			return stemmedWord;
		}
	}
	const undoubleVowelModificationComp = modifyStem( stemmedWord, morphologyDataNL.addSuffixes.stemModifications.vowelUndoublingComparative );
	if ( undoubleVowelModificationComp.foundModification === true ) {
		stemmedWord = undoubleVowelModificationComp.stemmedWord;
		return stemmedWord;
	}
	return stemmedWord;
};


/**
 * Adds partitive suffix to the stem.
 *
 * @param {object} morphologyDataAdjectives The Dutch morphology data for adjectives.
 * @param {string} stemmedWord The stemmed word for which to get suffixes.
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
 * @param {Object}      morphologyDataNL    The Dutch morphology data for adjectives.
 * @param {string}      stemmedWord                 The stemmed word for which to get suffixes.
 *
 * @returns {string} The suffixed adjective form.
 */
export function addInflectedSuffix( morphologyDataNL, stemmedWord ) {
	const inflectedSuffix = getSuffixesInflected( morphologyDataNL.adjectives, stemmedWord );

	stemmedWord = findAndApplyModifications( stemmedWord, inflectedSuffix, morphologyDataNL );

	return stemmedWord.concat( inflectedSuffix );
}

/**
 * Adds the comparative suffixes to the stem. Before adding the suffixes, the stem is modified if needed.
 *
 * @param {Object}      morphologyDataNL    The Dutch morphology data for adjectives.
 * @param {string}      stemmedWord         The stemmed word for which to get suffixes.
 *
 * @returns {string[]} The suffixed adjective forms.
 */
export function addComparativeSuffixes( morphologyDataNL, stemmedWord ) {
	const comparativeSuffixes = getSuffixesComparative( morphologyDataNL.adjectives, stemmedWord );

	stemmedWord = findAndApplyModifications( stemmedWord, comparativeSuffixes, morphologyDataNL );

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
 * @param {Object}      morphologyDataNL    The Dutch morphology data for adjectives.
 * @param {string}      stemmedWord         The stemmed word for which to get suffixes.
 *
 * @returns {string[]} The suffixed adjective forms.
 */
export function addAllAdjectiveSuffixes( morphologyDataNL, stemmedWord ) {
	const comparativeForms = addComparativeSuffixes( morphologyDataNL, stemmedWord );
	const superlativeForms = addSuperlativeSuffixes( morphologyDataNL.adjectives, stemmedWord );
	const inflectedForm = addInflectedSuffix( morphologyDataNL, stemmedWord );

	const adjectiveForms = comparativeForms.concat( superlativeForms );
	adjectiveForms.push( inflectedForm );

	if ( stemmedWord.endsWith( "s" ) ) {
		return adjectiveForms;
	}
	const partitiveForm = addPartitiveSuffix( morphologyDataNL.adjectives, stemmedWord );
	adjectiveForms.push( partitiveForm );

	return adjectiveForms;
}
