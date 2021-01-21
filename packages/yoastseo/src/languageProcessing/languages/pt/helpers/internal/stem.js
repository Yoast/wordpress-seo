/* eslint-disable max-statements, complexity */

/*
Copyright (c) 2015, Luís Rodrigues
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

import { findMatchingEndingInArray } from "../../../../helpers/morphology/findMatchingEndingInArray";


/**
 * Checks whether the character is a vowel.
 *
 * @param {string}	    character	The character to check.
 * @param {string[]}    vowels      The Portuguese vowels.
 *
 * @returns {boolean}	Whether the character is a vowel.
 */
const isVowel = function( character, vowels ) {
	return vowels.includes( character );
};

/**
 * Finds the first vowel in a string after the specified index and returns the index of the character following that vowel
 * (if found).
 *
 * @param {string}	    word	    The word to check.
 * @param {string[]}    vowels      The Portuguese vowels.
 * @param {number}	    start       The index at which the search for a vowel should begin.
 *
 * @returns {number} The index of the character following the found vowel. If this is not found, the length of the word.
 */
const nextVowelPosition = function( word, vowels, start ) {
	const length = word.length;

	for ( let position = start; position < length; position++ ) {
		if ( isVowel( word[ position ], vowels ) ) {
			return position;
		}
	}

	return length;
};

/**
 * Finds the first consonant in a string after the specified index and returns the index of the character following that
 * consonant (if found).
 *
 * @param {string}	    word	The word to check.
 * @param {string[]}    vowels  The Portuguese vowels.
 * @param {number}	    start	The index at which the search for a consonant should begin.
 *
 * @returns {number} The index of the character following the found consonant. If this is not found, the length of the word.
 */
const nextConsonantPosition = function( word, vowels, start ) {
	const length = word.length;

	for ( let position = start; position < length; position++ ) {
		if ( ! isVowel( word[ position ], vowels ) ) {
			return position;
		}
	}

	return length;
};

/**
 * Replaces characters with other characters if found in a word.
 *
 * @param {string}		word				The word to check.
 * @param {string[]}	charactersToReplace	The characters to replace.
 * @param {string[]}	replacements		The replacement characters.
 *
 * @returns {string}	The word with the replacement characters, or the original word if no characters to replace were found.
 */
const replaceCharacters = function( word, charactersToReplace, replacements ) {
	for ( let i = 0; i < charactersToReplace.length; i++ ) {
		word = word.replace( charactersToReplace[ i ], replacements[ i ] );
	}

	return word;
};

/**
 * Looks for the longest suffix in each group and removes it if it is found within the specified region (R1, R2 or RV).
 * Once a suffix is found and removed, stops searching further.
 *
 * For some of the suffix groups, replaces the suffix with another string after removing it (e.g. -logia is replaced with
 * -log).
 *
 * @param {string}	word	            The word to check.
 * @param {Object}  standardSuffixData  The data for stemming standard suffixes.
 * @param {string}	r1Text	            The text in the R1 region.
 * @param {string}	r2Text	            The text in the R2 region.
 * @param {string}	rvText	            The text in the RV region.
 *
 * @returns {string} The stemmed word or the original word if no suffix was removed.
 */
const stemStandardSuffixes = function( word, standardSuffixData, r1Text, r2Text, rvText ) {
	const regions = {
		r1: r1Text,
		r2: r2Text,
		rv: rvText,
	};

	for ( const suffixGroup of standardSuffixData.standardGroups ) {
		const foundSuffix = findMatchingEndingInArray( regions[ suffixGroup.region ], suffixGroup.suffixes );

		if ( foundSuffix ) {
			return word.slice( 0, -foundSuffix.length ) + suffixGroup.replacement;
		}
	}

	const specialEnding = findMatchingEndingInArray( regions[ standardSuffixData.specialClass.region ], standardSuffixData.specialClass.suffixes );
	if ( findMatchingEndingInArray( word, standardSuffixData.specialClass.wordEndingsToCheck ) && specialEnding  ) {
		word = word.slice( 0, -specialEnding.length ) + standardSuffixData.specialClass.replacement;
	}

	return word;
};

/**
 * Stems verb suffixes.
 *
 * @param {string}      word            The original word.
 * @param {string[]}    verbSuffixes    The verb suffixes to check.
 * @param {string}      rvText          The text of the RV.
 *
 * @returns {string} The word with the verb suffixes removed (if applicable).
 */
const stemVerbSuffixes = function( word, verbSuffixes, rvText ) {
	const verbSuffix = findMatchingEndingInArray( rvText, verbSuffixes );

	if ( verbSuffix !== "" ) {
		word = word.slice( 0, -verbSuffix.length );
	}

	return word;
};

/**
 * Stems residual suffixes.
 *
 * @param {string}	word	            The word to check.
 * @param {Object}  residualSuffixData  The data used to stem residual suffixes.
 * @param {string}	rvText	            The text in the RV region.
 *
 * @returns {string} The word with a removed suffix, or the original input word if no suffix was removed.
 */
const stemResidualSuffixes = function( word, residualSuffixData, rvText ) {
	const foundSuffixUe = findMatchingEndingInArray( rvText, residualSuffixData.groupUe.suffixes );
	const foundSuffixIe = findMatchingEndingInArray( rvText, residualSuffixData.groupIe.suffixes );
	const foundSuffixE = findMatchingEndingInArray( rvText, residualSuffixData.groupESuffixes );

	if ( foundSuffixUe && findMatchingEndingInArray( word, residualSuffixData.groupUe.wordEndingsToCheck ) ) {
		word = word.slice( 0, -foundSuffixUe.length );
	} else if ( foundSuffixIe && findMatchingEndingInArray( word, residualSuffixData.groupIe.wordEndingsToCheck ) ) {
		word = word.slice( 0, -foundSuffixIe.length );
	} else if ( foundSuffixE ) {
		word = word.slice( 0, -foundSuffixE.length );
	} else if ( word.endsWith( residualSuffixData.cCedilla[ 0 ] ) ) {
		word = word.slice( 0, -1 ) + residualSuffixData.cCedilla[ 1 ];
	}

	return word;
};

/**
 * Stems Portuguese words.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Portuguese morphology data.
 *
 * @returns {string} The stemmed word.
 */
export default function stem( word, morphologyData ) {
	word.toLowerCase();
	const vowels = morphologyData.externalStemmer.vowels;

	// Nasal vowels should be treated as a vowel followed by a consonant.
	const nasalVowels = morphologyData.externalStemmer.nasalVowels.originals;
	const nasalVowelsReplacement = morphologyData.externalStemmer.nasalVowels.replacements;
	word = replaceCharacters( word, nasalVowels, nasalVowelsReplacement, );

	const length = word.length;
	if ( length < 2 ) {
		return word;
	}

	let r1 = length;
	let r2 = length;
	let rv = length;

	/*
	 * R1 is the region after the first non-vowel following a vowel, or is the null region at the end of the word if
	 * there is no such non-vowel.
	 */
	for ( let i = 0; i < ( length - 1 ) && r1 === length; i++ ) {
		if ( isVowel( word[ i ], vowels ) && ! isVowel( word[ i + 1 ], vowels ) ) {
			r1 = i + 2;
		}
	}

	/*
	 * R2 is the region after the first non-vowel following a vowel in R1, or is the null region at the end of the
	 * word if there is no such non-vowel.
	 */
	for ( let i = r1; i < ( length - 1 ) && r2 === length; i++ ) {
		if ( isVowel( word[ i ], vowels ) && ! isVowel( word[ i + 1 ], vowels ) ) {
			r2 = i + 2;
		}
	}

	/*
	 * If the second letter is a consonant, RV is the region after the next following vowel. If the first two letters are
	 * vowels, RV is the region after the next consonant, and otherwise (consonant-vowel case) RV is the region after the
	 * third letter. But RV is the end of the word if these positions cannot be found.
	 */
	if ( length > 3 ) {
		if ( ! isVowel( word[ 1 ], vowels ) ) {
			rv = nextVowelPosition( word, vowels, 2 ) + 1;
		} else if ( isVowel( word[ 0 ], vowels ) && isVowel( word[ 1 ], vowels ) ) {
			rv = nextConsonantPosition( word, vowels, 2 ) + 1;
		} else {
			rv = 3;
		}
	}

	const r1Text = word.slice( r1 );
	const r2Text = word.slice( r2 );
	let rvText = word.slice( rv );

	// Go through the first step of removing suffixes.
	const wordAfterStep1 = stemStandardSuffixes( word, morphologyData.externalStemmer.standardSuffixes, r1Text, r2Text, rvText );

	// If no suffixes were removed in the first step, search for and remove verb suffixes.
	let wordAfterStep2 = "";

	if ( word === wordAfterStep1 ) {
		wordAfterStep2 = stemVerbSuffixes( word, morphologyData.externalStemmer.verbSuffixes, rvText );
	}

	// If suffixes were removed in one of the previous steps, replace the word with the de-suffixed word and adjust RV text.
	if ( word !== wordAfterStep1 ) {
		word = wordAfterStep1;
		rvText = word.slice( rv );
	} else if ( word !== wordAfterStep2 ) {
		word = wordAfterStep2;
		rvText = word.slice( rv );
	}

	/*
	 * If a suffix was removed in one of the two previous steps, remove -i if preceded by -c and in RV. If no suffix was
	 * removed in one of the previous steps, remove -os, -a, -i, -o, -á, í, or ó if in RV.
	 */
	if ( wordAfterStep1 !== word || wordAfterStep2 !== word ) {
		if ( word.endsWith( morphologyData.externalStemmer.ciToC[ 0 ] ) && rvText.endsWith( morphologyData.externalStemmer.ciToC[ 1 ] ) ) {
			word = word.slice( 0, -1 );
			rvText = word.slice( rv );
		}
	} else {
		const foundGeneralSuffix = findMatchingEndingInArray( rvText, morphologyData.externalStemmer.generalSuffixes );
		if ( foundGeneralSuffix !== "" ) {
			word = word.slice( 0, -foundGeneralSuffix.length );
			rvText = word.slice( rv );
		}
	}

	// Stem residual suffixes, regardless of whether a suffix was removed in any of the previous steps or not.
	word = stemResidualSuffixes( word, morphologyData.externalStemmer.residualSuffixes, rvText );

	// Change the nasal vowel replacements back into the nasal vowels.
	word = replaceCharacters( word, nasalVowelsReplacement, nasalVowels );

	return word;
}
