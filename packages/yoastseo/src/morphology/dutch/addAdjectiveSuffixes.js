import { uniq as unique } from "lodash-es";


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

	if ( takesUmlautEnding.some( ending => stemmedWord.endsWith( ending ) ) ) {
		return "ë";
	}

	return "e";
}

/**
 * Returns a set of comparative suffixes depending on the ending of the stem.
 *
 * @param {Object}  morphologyDataAdjectives    The Dutch morphology data for adjectives.
 * @param {string}  stemmedWord                 The stemmed word for which to get suffixes.
 *
 * @returns {string[]} The correct comparative suffixes for the given stem.
 */
export function getSuffixesComparative( morphologyDataAdjectives, stemmedWord ) {
	const takesREnding = morphologyDataAdjectives.takesComparativeREnding.slice();
	const takesDerEnding = morphologyDataAdjectives.takesComparativeDerEnding.slice();
	const takesUmlautEnding = morphologyDataAdjectives.takesUmlautEnding.slice();

	if ( takesREnding.some( ending => stemmedWord.endsWith( ending ) ) ) {
		return morphologyDataAdjectives.comparativeSuffixesR;
	} else if ( takesDerEnding.some( ending => stemmedWord.endsWith( ending ) ) ) {
		return morphologyDataAdjectives.comparativeSuffixesDer;
	} else if ( takesUmlautEnding.some( ending => stemmedWord.endsWith( ending ) ) ) {
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
	const takesTEnding = morphologyDataAdjectives.takesSuperlativeEstTEnding.slice();

	if ( takesTEnding.some( ending => stemmedWord.endsWith( ending ) ) ) {
		return morphologyDataAdjectives.superlativeSuffixesT;
	}

	return morphologyDataAdjectives.superlativeSuffixesT;
}

/**
 * Undoubles vowel in the last syllable of the stem before adding the inflected suffix.
 * @param {string} stemmedWord The stemmed word that should have the vowel undoubled.
 * @returns {string} The stem with the undoubled vowel.
 */
const undoubleVowelInflected = function( stemmedWord ) {
	stemmedWord = stemmedWord.replace( /(aa)([^i])$/, "a$2" );
	stemmedWord = stemmedWord.replace( /(oo)([^i])$/, "o$2" );
	stemmedWord = stemmedWord.replace( /(uu)([^i])$/, "u$2" );
	stemmedWord = stemmedWord.replace( /(ee)([^i])$/, "e$2" );

	return stemmedWord;
};

/**
 * Undoubles vowel in the last syllable of the stem before adding comparative suffixes.
 * @param {string} stemmedWord The stemmed word that should have the vowel undoubled.
 * @returns {string} The stem with the undoubled vowel.
 */
const undoubleVowelComparative = function( stemmedWord ) {
	stemmedWord = stemmedWord.replace( /(aa)([^ir])$/, "a$2" );
	stemmedWord = stemmedWord.replace( /(oo)([^ir])$/, "o$2" );
	stemmedWord = stemmedWord.replace( /(uu)([^ir])$/, "u$2" );
	stemmedWord = stemmedWord.replace( /(ee)([^ir])$/, "e$2" );

	return stemmedWord;
};

/**
 * Doubles the consonant at the end of the stem.
 * @param {string} stemmedWord The stemmed word that should have the consonant doubled.
 * @returns {string} The stem with the doubled consonant.
 */
const doubleConsonant = function( stemmedWord ) {
	const finalConsonant = stemmedWord.slice( -1 );

	return stemmedWord.concat( finalConsonant );
};

/**
 * Changes word-final f to v, and s to z.
 * @param {string} stemmedWord The stemmed word that should have the consonant replaced.
 * @returns {string} The stem with the replaced consonant.
 */
const voiceConsonant = function( stemmedWord ) {
	stemmedWord = stemmedWord.replace( /f$/, "v" );
	stemmedWord = stemmedWord.repace( /s$/, "z" );

	return stemmedWord;
};

/**
 * Creates the second stem of words that have two possible stems (this includes stem ending in -ieel or -iël;
 * stem with double or single vowel; double or single consonant; s/f or z/v).
 *
 * @param {string} stemmedWord The stem
 * @param {string} typeSuffix The type of suffix that should be added to the inputted stem.
 * @returns {string} The modified stem, or the original stem if no modifications had to be made.
 */
const modifyStem = function( stemmedWord, typeSuffix ) {
	if ( stemmedWord.endsWith( "ieel" ) ) {
		stemmedWord = stemmedWord.replace( "ieel", "iël" );
	} else if ( stemmedWord.search( /([aeoiuyèäüëïöáéíóú]?)([^aeoiuyèäüëïöáéíóú])([aeoiuáéíóú])([bdfgklmnpst])$/ ) ) {
		stemmedWord = doubleConsonant( stemmedWord );
	} else if ( stemmedWord.search( /(aa|oo|uu|ee)(^i)$/ ) ) {
		if ( typeSuffix === "e" ) {
			stemmedWord = undoubleVowelInflected( stemmedWord );
		}   stemmedWord = undoubleVowelComparative( stemmedWord );

		if ( stemmedWord.endsWith( "f" ) || stemmedWord.endsWith( "s" ) ) {
			stemmedWord = voiceConsonant( stemmedWord );
		}
	} else if ( stemmedWord.search( /(ie|eu|ij|oe)([fs])/ ) ) {
		stemmedWord = voiceConsonant( stemmedWord );
	}
	return stemmedWord;
};

/**
 * Adds partitive suffix to the stem.
 *
 * @param {string}      stemmedWord                 The stemmed word for which to get suffixes.
 *
 * @returns {string} The suffixed adjective form.
 */
export function addPartitiveSuffix( stemmedWord ) {
	if ( stemmedWord.endsWith( "s" ) ) {
		return stemmedWord;
	}
	const partitiveSuffix = "s";
	return stemmedWord.concat( partitiveSuffix );
}

/**
 * Adds the inflected suffix to the stem.
 *
 * @param {Object}      morphologyDataAdjectives    The Dutch morphology data for adjectives.
 * @param {string}      stemmedWord                 The stemmed word for which to get suffixes.
 *
 * @returns {string} The suffixed adjective form.
 */
export function addInflectedSuffix( morphologyDataAdjectives, stemmedWord ) {
	const inflectedSuffix = getSuffixesInflected( morphologyDataAdjectives, stemmedWord );

	stemmedWord = modifyStem( stemmedWord, inflectedSuffix );

	return stemmedWord.concat( inflectedSuffix );
}

/**
 * Adds the comparative suffixes to the stem. Before adding the suffixes, the stem is modified if needed.
 *
 * @param {Object}      morphologyDataAdjectives    The Dutch morphology data for adjectives.
 * @param {string}      stemmedWord                 The stemmed word for which to get suffixes.
 *
 * @returns {string[]} The suffixed adjective forms.
 */
export function addComparativeSuffixes( morphologyDataAdjectives, stemmedWord ) {
	const comparativeSuffixes = getSuffixesComparative( morphologyDataAdjectives, stemmedWord );

	stemmedWord = modifyStem( stemmedWord, comparativeSuffixes );

	return unique( comparativeSuffixes.map( suffix => stemmedWord.concat( suffix ) ) );
}

/**
 * Adds the superlative suffixes to the stem. Before adding the suffixes, the stem is modified if needed.
 *
 * @param {Object}      morphologyDataAdjectives    The Dutch morphology data for adjectives.
 * @param {string}      stemmedWord                 The stemmed word for which to get suffixes.
 *
 * @returns {string[]} The suffixed adjective forms.
 */
export function addSuperlativeSuffixes( morphologyDataAdjectives, stemmedWord ) {
	const superlativeSuffixes = getSuffixesSuperlative( morphologyDataAdjectives, stemmedWord );

	return unique( superlativeSuffixes.map( suffix => stemmedWord.concat( suffix ) ) );
}

/**
 * Adds all suffixes (partitive, inflected, comparative, superlative) to the stem.
 *
 * @param {Object}      morphologyDataAdjectives    The German morphology data for adjectives.
 * @param {string}      stemmedWord                 The stemmed word for which to get suffixes.
 *
 * @returns {string[]} The suffixed adjective forms.
 */
export function addAllAdjectiveSuffixes( morphologyDataAdjectives, stemmedWord ) {
	const partitiveForm = addPartitiveSuffix( stemmedWord );
	const inflectedForm = addInflectedSuffix( morphologyDataAdjectives, stemmedWord );
	const comparativeForms = addComparativeSuffixes( morphologyDataAdjectives, stemmedWord );
	const superlativeForms = addSuperlativeSuffixes( morphologyDataAdjectives, stemmedWord );

	return unique( partitiveForm.concat( inflectedForm, comparativeForms, superlativeForms ) );
}
