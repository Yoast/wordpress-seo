/* eslint-disable complexity */
/* eslint-disable max-statements */
/*
Copyright (c) 2012, Leonardo Fenu, Chris Umbel
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

import { languageProcessing } from "yoastseo";
const { createSingleRuleFromArray, createRulesFromArrays } = languageProcessing;

/**
 * Determines whether a letter is a vowel.
 *
 * @param {string} letter           The letter that has to be checked.
 * @param {Object} morphologyData   The Italian morphology data file.
 *
 * @returns {boolean} True if the letter is a vowel.
 */
function isVowel( letter, morphologyData ) {
	return morphologyData.externalStemmer.vowels.includes( letter );
}

/**
 * Determines the next position in a word that is a vowel.
 *
 * @param {string}  word            The word to be checked.
 * @param {Object}  morphologyData  The Italian morphology data file.
 * @param {number}  start           The position of the word where you start checking.
 *
 * @returns {number} The next position in a word that is a vowel, or the final position if no vowel is found.
 */
function getNextVowelPos( word, morphologyData, start ) {
	start = start + 1;
	const length = word.length;

	for ( let i = start; i < length; i++ ) {
		if ( isVowel( word[ i ], morphologyData ) ) {
			return i;
		}
	}

	return length;
}

/**
 * Determines the next position in a word that is a consonant.
 *
 * @param {string}  word            The word that has to be checked.
 * @param {Object}  morphologyData  The Italian morphology data file.
 * @param {number}  start           The position of the word where you start checking.
 *
 * @returns {number} The next position in a word that is a consonant, or the final position if no consonant is found.
 */
function getNextConsonantPos( word, morphologyData, start ) {
	const length = word.length;

	for ( let i = start; i < length; i++ ) {
		if ( ! isVowel( word[ i ], morphologyData ) ) {
			return i;
		}
	}

	return length;
}

/**
 * Checks whether a word ends in a suffix and if so it returns the suffix.
 *
 * @param {string}       word           The word that has to be checked.
 * @param {string[]}     suffixes       The suffixes that have to be checked.
 *
 * @returns {string}                    The suffix that the word ends in or an empty string if the word does not end in any of the suffixes.
 */
function endsinArr( word, suffixes ) {
	for ( let i = 0; i < suffixes.length; i++ ) {
		if ( word.endsWith( suffixes[ i ] ) ) {
			return suffixes[ i ];
		}
	}

	return "";
}

/**
 * Turns acute accents into grave ones.
 *
 * @param {string}  word            The word that has to be checked.
 * @param {Object}  morphologyData  The Italian morphology data file.
 *
 * @returns {string} The word with acute accents (e.g. é) replaced by grave ones (e.g. è).
 */
function replaceAcute( word, morphologyData ) {
	const acuteReplacements = createRulesFromArrays(
		morphologyData.externalStemmer.preProcessing.acuteReplacements,
		"gi"
	);

	for ( const acuteReplacement of acuteReplacements ) {
		word = word.replace( acuteReplacement.reg, acuteReplacement.repl );
	}

	return word;
}

/**
 * Turns an i or u in between vowels into upper case.
 *
 * @param {string}  word            The word that has to be checked.
 * @param {Object}  morphologyData  The Italian morphology data file.
 *
 *  @returns {string} The word with either i or u turned into upper case.
 */
function vowelMarking( word, morphologyData ) {
	return word.replace(
		new RegExp( morphologyData.externalStemmer.preProcessing.vowelMarking, "g" ),
		( match, p1, p2, p3 ) => p1 + p2.toUpperCase() + p3
	);
}

/**
 * Pre-process the word for stemming by setting it to lower case and replacing some letters.
 *
 * @param {string} word            The word to pre-process.
 * @param {Object} morphologyData  The Italian morphology data file.
 *
 * @returns {string} The pre-processed word.
 */
function preProcess( word, morphologyData ) {
	word = word.toLowerCase();
	word = replaceAcute( word, morphologyData );
	const quReplacement = createSingleRuleFromArray(
		morphologyData.externalStemmer.preProcessing.quReplacement,
		"g"
	);
	word = word.replace( quReplacement.reg, quReplacement.repl );
	word = vowelMarking( word, morphologyData );

	return word;
}

/**
 * Determines R1, R2 and RV in the word.
 *
 * @param {string}  word            The word for which Rs have to be determined.
 * @param {Object}  morphologyData  The Italian morphology data file.
 *
 * @returns {{r2: number, rv: number, r1: number}} R1, R2 and RV in the word.
 */
const determineRs = function( word, morphologyData ) {
	let r1 = word.length;
	let r2 = word.length;
	let rv = word.length;

	// R1 is the region after the first non-vowel following a vowel,
	for ( let i = 0; i < word.length - 1 && r1 === word.length; i++ ) {
		if ( isVowel( word[ i ], morphologyData ) && ! isVowel( word[ i + 1 ], morphologyData ) ) {
			r1 = i + 2;
		}
	}

	// R2 is the region after the first non-vowel following a vowel in R1
	for ( let i = r1; i < word.length - 1 && r2 === word.length; i++ ) {
		if ( isVowel( word[ i ], morphologyData ) && ! isVowel( word[ i + 1 ], morphologyData ) ) {
			r2 = i + 2;
		}
	}

	if ( word.length > 3 ) {
		if ( ! isVowel( word[ 1 ], morphologyData ) ) {
			// If the second letter is a consonant, RV is the region after the next following vowel.
			rv = getNextVowelPos( word, morphologyData, 1 ) + 1;
		} else if ( isVowel( word[ 0 ], morphologyData ) && isVowel( word[ 1 ], morphologyData ) ) {
			// Or if the first two letters are vowels, RV is the region after the next consonant.
			rv = getNextConsonantPos( word, morphologyData, 2 ) + 1;
		} else {
			/*
			 * Otherwise (consonant-vowel case) RV is the region after the third letter.
			 * But RV is the end of the word if these positions cannot be found.
			 */
			rv = 3;
		}
	}

	return { r1, r2, rv };
};

/**
 * Removes pronoun suffixes.
 *
 * @param {string}  word            The word from which suffixes have to be removed.
 * @param {Object}  morphologyData  The Italian morphology data file.
 * @param {string}  rvText          The content of the RV.
 *
 * @returns {string} The word without pronoun suffixes.
 */
const removePronounSuffixes = function( word, morphologyData, rvText ) {
	const foundSuffix = endsinArr( word, morphologyData.externalStemmer.pronounSuffixes.suffixes );

	if ( foundSuffix !== "" ) {
		const foundSuffixPre1 = endsinArr(
			rvText.slice( 0, -foundSuffix.length ),
			morphologyData.externalStemmer.pronounSuffixes.preSuffixesGerund
		);
		const foundSuffixPre2 = endsinArr(
			rvText.slice( 0, -foundSuffix.length ),
			morphologyData.externalStemmer.pronounSuffixes.preSuffixesInfinitive
		);

		if ( foundSuffixPre1 !== "" ) {
			word = word.slice( 0, -foundSuffix.length );
		}
		if ( foundSuffixPre2 !== "" ) {
			word = word.slice( 0, -foundSuffix.length ) + morphologyData.externalStemmer.pronounSuffixes.infinitiveCompletion;
		}
	}
	return word;
};

/**
 * Removes standard suffixes.
 *
 * @param {string}  word            The word from which standard suffixes have to be removed.
 * @param {Object}  morphologyData  The Italian morphology data file.
 * @param {string}  r2Text          The content of the R2.
 * @param {string}  r1Text          The content of the R1.
 * @param {string}  rvText          The content of the RV.
 *
 * @returns {string} The word without standard suffixes.
 */
const removeStandardSuffixes = function( word, morphologyData, r2Text, r1Text, rvText ) {
	const regions = {
		r1: r1Text,
		r2: r2Text,
		rv: rvText,
	};

	for ( const suffixGroup of morphologyData.externalStemmer.standardSuffixes ) {
		const foundSuffix = endsinArr( regions[ suffixGroup.region ], suffixGroup.suffixes );

		if ( foundSuffix ) {
			return word.slice( 0, -foundSuffix.length ) + suffixGroup.replacement;
		}
	}

	return word;
};

/**
 *  Removes verb suffixes.
 *
 * @param {string}  word            The word from which verb suffixes have to be removed.
 * @param {Object}  morphologyData  The Italian morphology data file.
 * @param {string}  rvText          The content of the RV.
 *
 * @returns {string} The word without verb suffixes.
 */
const removeVerbSuffixes = function( word, morphologyData, rvText ) {
	const foundSuffix  = endsinArr( rvText, morphologyData.externalStemmer.verbSuffixes );

	if ( foundSuffix ) {
		word = word.slice( 0, -foundSuffix.length );
	}

	return word;
};

/**
 * Normalizes digraphs ch/gh to c/g.
 *
 * @param {string}  word    The word to normalize.
 * @param {Object}  morphologyData  The Italian morphology data file.
 * @param {string}  rvText          The content of the RV.
 *
 * @returns {string} The normalized word.
 */
const normalizeDigraphs = function( word, morphologyData, rvText ) {
	const digraphCh = morphologyData.externalStemmer.digraphNormalization.digraphCh;
	const digraphGh = morphologyData.externalStemmer.digraphNormalization.digraphGh;

	if ( ( rvText.endsWith( digraphCh[ 0 ] ) ) ) {
		word = word.slice( 0, -digraphGh[ 0 ].length ) + digraphCh[ 1 ];
	} else if ( ( rvText.endsWith( digraphGh[ 0 ] ) ) ) {
		word = word.slice( 0, -digraphGh[ 0 ].length ) + digraphGh[ 1 ];
	}

	return word;
};

/**
 * Returns a canonical stem for words with multiple stems.
 *
 * @param {string}  word                       The word to canonicalize.
 * @param {Object}  stemsThatBelongToOneWord   An object of arrays of stems belonging to one word.
 *
 * @returns {string} A canonicalized stem or the original word.
 */
const canonicalizeStem = function( word, stemsThatBelongToOneWord ) {
	// Check the verbs list. The infinitive stem is always the canonical stem for verbs.
	for ( const paradigm of stemsThatBelongToOneWord.verbsWithMultipleStems ) {
		if ( paradigm.includes( word ) ) {
			return paradigm[ 0 ];
		}
	}
	// Check the diminutives list.
	for ( const paradigm of stemsThatBelongToOneWord.irregularDiminutives ) {
		if ( paradigm.includes( word ) ) {
			return paradigm[ 0 ];
		}
	}
};

/**
 * Checks whether a word is in the full-form exception list and if so returns the canonical stem.
 *
 * @param {string} word	      The word to be checked.
 * @param {Object} exceptions The list of full-form exceptions to be checked in.
 *
 * @returns {null|string} The canonical stem or null if nothing was found.
 */
const checkWordInFullFormExceptions = function( word, exceptions ) {
	for ( const paradigm of exceptions ) {
		if ( paradigm[ 1 ].includes( word ) ) {
			return paradigm[ 0 ];
		}
	}
	return null;
};

/**
 * Stems Italian words.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Italian morphology data file.
 *
 * @returns {string}               The stemmed word.
 */
export default function stem( word, morphologyData ) {
	// Check the exception list for irregular plural nouns and adjectives.
	const irregularPluralNounsAndAdjectives = checkWordInFullFormExceptions( word, morphologyData.irregularPluralNounsAndAdjectives );
	if ( irregularPluralNounsAndAdjectives ) {
		return irregularPluralNounsAndAdjectives;
	}

	// Check the exception list for irregular verbs listed in full forms.
	const irregularVerbs = checkWordInFullFormExceptions( word, morphologyData.irregularVerbs );
	if ( irregularVerbs ) {
		return irregularVerbs;
	}

	// Start word pre-processing.
	word = preProcess( word, morphologyData );

	// Don't stem words that consist of less than 3 letters.
	if ( word.length < 3 ) {
		return word;
	}

	// Determines r1 ,r2, rv.
	const { r1, r2, rv } = determineRs( word, morphologyData );

	// Determiners the content of r1, r2, and rv.
	let r1Text = word.substring( r1 );
	let r2Text = word.substring( r2 );
	let rvText = word.substring( rv );

	const originalWord = word;

	// Step 0: Attached pronoun removal.
	word = removePronounSuffixes( word, morphologyData, rvText );

	if ( word !== originalWord ) {
		r1Text = word.substring( r1 );
		r2Text = word.substring( r2 );
		rvText = word.substring( rv );
	}

	const wordAfter0 = word;

	// Step 1:  Standard suffix removal.
	word = removeStandardSuffixes( word, morphologyData, r2Text, r1Text, rvText );

	if ( word !== wordAfter0 ) {
		rvText = word.substring( rv );
	}

	const wordAfter1 = word;

	// Step 2:  Verb suffix removal.
	if ( wordAfter0 === wordAfter1 ) {
		word = removeVerbSuffixes( word, morphologyData, rvText );
	}

	rvText = word.substring( rv );

	// Always do step 3.
	let foundSuffix = "";

	// Remove general suffixes.
	if ( ( foundSuffix = endsinArr( rvText, morphologyData.externalStemmer.generalSuffixes ) ) !== "" ) {
		word = word.slice( 0, -foundSuffix.length );
	}

	rvText = word.substring( rv );

	// Normalize digraphs ch/gh.
	word = normalizeDigraphs( word, morphologyData, rvText );

	// Lowercase the word before canonicalizing stem
	word = word.toLowerCase();

	// Returns a canonical stem for words with multiple stems (e.g., verbs: chiudere–chiuso; diminutives: ovetto-uovo).
	const canonicalStem = canonicalizeStem( word, morphologyData.stemsThatBelongToOneWord );
	if ( canonicalStem ) {
		return canonicalStem;
	}
	return word.toLowerCase();
}
