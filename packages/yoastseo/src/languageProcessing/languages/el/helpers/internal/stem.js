/**
 * MIT License
 *
 * Copyright (c) 2015 apmats <amatsagkas@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * https://github.com/Apmats/greekstemmerjs
 */

import { languageProcessing } from "yoastseo";
const { createSingleRuleFromArray, createRulesFromArrays } = languageProcessing;

/**
 * Checks if the input character is a Greek vowel.
 *
 * @param {string} char             The character to be checked.
 * @param {Object} morphologyData   The Greek morphology data.
 *
 * @returns {boolean} Whether the input character is a Russian vowel.
 */
const isVowel = function( char, morphologyData ) {
	return morphologyData.externalStemmer.vowels.includes( char );
};

/**
 * Checks whether the word ends in a suffix, and removes it if it does.
 *
 * @param {string}		word		The word to check.
 * @param {string[]}	suffixes	The suffixes to check.
 *
 * @returns {string}	The word with the suffix removed or the input word if no suffix was found.
 */
const removeSuffix = function removeSuffix(word, suffixes) {
	for ( const suffix of suffixes ) {
		if ( word.endsWith( suffix ) ) {
			return word.slice( 0, -suffix.length );
		}
	}
	return word;
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
 * Stems suffixes from step 1.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Greek morphology data.
 *
 * @returns {string}     The word without suffixes or the original word if no such suffix is found.
 */
function removeEndingsStep1( word, morphologyData ) {
	const suffixesStep1 = morphologyData.externalStemmer.suffixesStep1;

	if ( word.endsWith( suffixesStep1.suffixesStep1a ) ) {
		// Return the word without the suffix
		return word.slice( 0, -4 );
	}
	if ( word.endsWith( suffixesStep1.suffixesStep1b ) ) {
		// Remove suffix and add ΑΔ
		return word.slice( 0, -suffix.length ) + "ΑΔ";
	}
	if ( word.endsWith( suffixesStep1.suffixesStep1c ) ) {
		// Remove the suffix
		return word.slice( 0, -4 );
	}
	if ( word.endsWith( suffixesStep1.suffixesStep1d ) ) {
		// Remove the suffix and add ΕΔ
		return word.slice( 0, -suffix.length ) + "ΕΔ";
	}
	if ( word.endsWith( suffixesStep1.suffixesStep1e ) ) {
		// Remove the suffix
		return word.slice( 0, -5 );
	}
	if ( word.endsWith( suffixesStep1.suffixesStep1f ) ) {
		// Remove the suffix and add ΟΥΔ
		return word.slice( 0, -suffix.length ) + "ΟΥΔ";
	}
	if ( word.endsWith( suffixesStep1.suffixesStep1f ) ) {
		// Remove the suffix
		return word.slice( 0, -suffix.length );
	}
	if ( word.endsWith( suffixesStep1.suffixesStep1f ) ) {
		// Remove the suffix and add Ε
		return word.slice( 0, -suffix.length ) + "Ε";
	}
	return word;
}
/**
 * Stems suffixes from step 2.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Greek morphology data.
 *
 * @returns {string}     The word without suffixes or the original word if no such suffix is found.
 */
// 3a and 3b in orginial stemmer
function removeEndingsStep2( word, morphologyData ) {
	const suffixesStep2 = morphologyData.externalStemmer.suffixesStep2;
	// Checks if the part of the word preceding the endingis at least 4 letters
	if ( word.length >= 7 ) {
		// Removes suffix
		if ( word.endsWith( suffixesStep2.suffixesStep2a ) ) {
			return word.slice( 0, -suffix.length );
		}
		// 3b in original stemmer, not finished
		if ( word.endsWith( suffixesStep2.suffixesStep2b ) ) {
			return word.slice( 0, -suffix.length ) + "Ι";
		}
		return word;
	}
	/**
	 * Stems suffixes from step 3.
	 *
	 * @param {string} word             The word to stem.
	 * @param {Object} morphologyData   The Greek morphology data.
	 *
	 * @returns {string}     The word without suffixes or the original word if no such suffix is found.
	 */
	function removeEndingsStep3( word, morphologyData ) {
		const suffixesStep1 = morphologyData.externalStemmer.suffixesStep3;

		if ( word.endsWith( suffixesStep1.suffixesStep3a ) ) {
			// Return the word without the suffix
			return word.slice( 0, -suffix.length );
		}
		if ( word.endsWith( isVowel())  ) {
			// Remove suffix and add ΑΔ
			return word.slice( 0, -suffix.length ) + "ΑΔ";
		}
		if ( word.endsWith( suffixesStep1.suffixesStep1c ) ) {
			// Remove the suffix
			return word.slice( 0, -4 );
		}
		if ( word.endsWith( suffixesStep1.suffixesStep1d ) ) {
			// Remove the suffix and add ΕΔ
			return word.slice( 0, -suffix.length ) + "ΕΔ";
		}
		if ( word.endsWith( suffixesStep1.suffixesStep1e ) ) {
			// Remove the suffix
			return word.slice( 0, -5 );
		}
		if ( word.endsWith( suffixesStep1.suffixesStep1f ) ) {
			// Remove the suffix and add ΟΥΔ
			return word.slice( 0, -suffix.length ) + "ΟΥΔ";
		}
		if ( word.endsWith( suffixesStep1.suffixesStep1f ) ) {
			// Remove the suffix
			return word.slice( 0, -suffix.length );
		}
		if ( word.endsWith( suffixesStep1.suffixesStep1f ) ) {
			// Remove the suffix and add Ε
			return word.slice( 0, -suffix.length ) + "Ε";
		}
		return word;
	}
