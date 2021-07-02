/* eslint-disable max-statements,complexity */
/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Marek Šuppa
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
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * Takes care of palatalisation.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Slovak morphology data.
 *
 * @returns {string}      The non-palatalised word or the original word if no such suffix is found.
 */
function palatalise( word, morphologyData ) {
	const palatalEndingsRegexes = morphologyData.externalStemmer.palatalEndingsRegexes;
	// Check if word ends in a palatal ending and return the regex if it does.
	const checkPalatalEnding = palatalEndingsRegexes.find( regex => new RegExp( regex[ 0 ] ).test( word ) );
	if ( checkPalatalEnding ) {
		return word.replace( new RegExp( checkPalatalEnding[ 0 ] ), checkPalatalEnding[ 1 ] );
	}
	return word.slice( 0, -1 );
}

/**
 * Removes case suffixes.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Slovak morphology data.
 *
 * @returns {string}     The word without case suffixes or the original word if no such suffix is found.
 */
function removeCases( word, morphologyData ) {
	const caseSuffixes = morphologyData.externalStemmer.caseSuffixes;
	const caseRegexes = morphologyData.externalStemmer.caseRegexes;

	if ( word.length > 7 && word.endsWith( caseSuffixes.caseSuffix1 ) ) {
		// Return the word without the suffix
		return word.slice( 0, -5 );
	}
	if ( word.length > 6 && word.endsWith( caseSuffixes.caseSuffix2 ) ) {
		return palatalise( word.slice( 0, -3 ), morphologyData );
	}
	if ( word.length > 5 ) {
		if ( caseSuffixes.caseSuffixes3.includes( word.slice( -3 ) ) ) {
			return palatalise( word.slice( 0, -2 ), morphologyData );
		} else if ( caseSuffixes.caseSuffixes4.includes( word.slice( -3 ) ) ) {
			return word.slice( 0, -3 );
		}
	}
	if ( word.length > 4 ) {
		if ( word.endsWith( caseSuffixes.caseSuffix5 ) ) {
			return palatalise( word.slice( 0, -1 ), morphologyData );
		} else if ( caseSuffixes.caseSuffixes6.includes( word.slice( -2 ) ) ) {
			return palatalise( word.slice( 0, -2 ), morphologyData );
		} else if ( caseSuffixes.caseSuffixes7.includes( word.slice( -2 ) ) ) {
			return word.slice( 0, -2 );
		}
	}
	if ( word.length > 3 ) {
		if ( new RegExp( caseRegexes.caseRegex1 ).test( word ) ) {
			return  palatalise( word, morphologyData );
		} else if ( new RegExp( caseRegexes.caseRegex2 ).test( word ) ) {
			return word.slice( 0, -1 );
		}
	}
	return word;
}

/**
 * Removes possessive suffixes.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Slovak morphology data.
 *
 * @returns {string}     The word without possessive suffixes or the original word if no such suffix is found.
 */
function removePossessives( word, morphologyData ) {
	const possessiveSuffixes = morphologyData.externalStemmer.possessiveSuffixes;

	if ( word.length > 5 ) {
		if ( word.endsWith( possessiveSuffixes.posSuffixOv ) ) {
			return word.slice( 0, -2 );
		}
		if ( word.endsWith( possessiveSuffixes.posSuffixIn ) ) {
			return palatalise( word.slice( 0, -1 ), morphologyData );
		}
	}
	return word;
}

/**
 * Removes comparative and superlative affixes.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Slovak morphology data.
 *
 * @returns {string}     The word without comparative and superlative affixes or the original word if no such suffix is found.
 */
function removeComparativeAndSuperlative( word, morphologyData ) {
	const superlativePrefix = morphologyData.externalStemmer.superlativePrefix;
	if ( word.length > 6 && word.startsWith( superlativePrefix ) ) {
		word = word.slice( 3, word.length );
	}

	if ( word.length > 5 ) {
		const comparativeSuffixes = morphologyData.externalStemmer.comparativeSuffixes;
		if ( comparativeSuffixes.includes( word.slice( -3 ) ) ) {
			word = palatalise( word.slice( 0, -2 ), morphologyData );
		}
	}
	return word;
}

/**
 * Removes diminutive suffixes.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Slovak morphology data.
 *
 * @returns {string}      The word without diminutive suffixes or the original word if no such suffix is found.
 */
function removeDiminutives( word, morphologyData ) {
	const diminutiveSuffixes = morphologyData.externalStemmer.diminutiveSuffixes;
	if ( word.length > 7 && word.endsWith( diminutiveSuffixes.diminutiveSuffix1 ) ) {
		return word.slice( 0, -5 );
	}
	if ( word.length > 6 ) {
		if ( diminutiveSuffixes.diminutiveSuffixes2.includes( word.slice( -4 ) ) ) {
			return palatalise( word.slice( 0, -3 ), morphologyData );
		}
		if ( diminutiveSuffixes.diminutiveSuffixes3.includes( word.slice( -4 ) ) ) {
			return palatalise( word.slice( 0, -4 ), morphologyData );
		}
	}
	if ( word.length > 5 ) {
		if ( diminutiveSuffixes.diminutiveSuffixes4.includes( word.slice( -3 ) ) ) {
			return palatalise( word.slice( 0, -3 ), morphologyData );
		}
		if ( diminutiveSuffixes.diminutiveSuffixes5.includes( word.slice( -3 ) ) ) {
			return word.slice( 0, -3 );
		}
	}
	if ( word.length > 4 ) {
		if ( diminutiveSuffixes.diminutiveSuffixes6.includes( word.slice( -2 ) ) ) {
			return palatalise( word.slice( 0, -1 ), morphologyData );
		}
		if ( diminutiveSuffixes.diminutiveSuffixes7.includes( word.slice( -2 ) ) ) {
			return word.slice( 0, -1 );
		}
	}
	if ( word.length > 3 && word.endsWith( "k" ) && ! word.endsWith( "isk" ) ) {
		return word.slice( 0, -1 );
	}
	return word;
}

/**
 * Removes augmentative suffixes.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Slovak morphology data.
 *
 * @returns {string}      The word without augmentative suffixes or the original word if no such suffix is found.
 */
function removeAugmentatives( word, morphologyData ) {
	const augmentativeSuffixes = morphologyData.externalStemmer.augmentativeSuffixes;
	if ( word.length > 6 && word.endsWith( augmentativeSuffixes.augmentativeSuffix1 ) ) {
		return word.slice( 0, -4 );
	}
	if ( word.length > 5 && augmentativeSuffixes.augmentativeSuffixes2.includes( word.slice( -3 ) ) ) {
		return palatalise( word.slice( 0, -2 ), morphologyData );
	}
	return word;
}

/**
 * Removes derivational suffixes.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Slovak morphology data.
 *
 * @returns {string}       The word without derivational suffixes or the original word if no such suffix is found.
 */
function stemDerivational( word, morphologyData ) {
	const derivationalSuffixes = morphologyData.externalStemmer.derivationalSuffixes;
	if ( word.length > 8 && word.endsWith( derivationalSuffixes.derivationalSuffix1 ) ) {
		return word.slice( 0, -6 );
	}
	if ( word.length > 7 ) {
		if ( word.endsWith( derivationalSuffixes.derivationalSuffix2 ) ) {
			return palatalise( word.slice( 0, -4 ), morphologyData );
		}
		if ( derivationalSuffixes.derivationalSuffixes3.includes( word.slice( -5 ) ) ) {
			return word.slice( 0, -5 );
		}
	}
	if ( word.length > 6 ) {
		if ( derivationalSuffixes.derivationalSuffixes4.includes( word.slice( -4 ) ) ) {
			return word.slice( 0, -4 );
		}
		if ( derivationalSuffixes.derivationalSuffixes5.includes( word.slice( -4 ) ) ) {
			return palatalise( word.slice( 0, -3 ), morphologyData );
		}
	}
	if ( word.length > 5 ) {
		if ( word.endsWith( derivationalSuffixes.derivationalSuffix6 ) ) {
			return word.slice( 0, -3 );
		}
		if ( derivationalSuffixes.derivationalSuffixes7.includes( word.slice( -3 ) ) ) {
			return palatalise( word.slice( 0, -2 ), morphologyData );
		}
		if ( derivationalSuffixes.derivationalSuffixes8.includes( word.slice( -3 ) ) ) {
			return word.slice( 0, -3 );
		}
	}
	if ( word.length > 4 ) {
		if ( derivationalSuffixes.derivationalSuffixes9.includes( word.slice( -2 ) ) ) {
			return word.slice( 0, -2 );
		}
		if ( derivationalSuffixes.derivationalSuffixes10.includes( word.slice( -2 ) ) ) {
			return palatalise( word.slice( 0, -1 ), morphologyData );
		}
	}
	const derivationalRegex = new RegExp( morphologyData.externalStemmer.derivationalRegex );
	if ( word.length > 3 && derivationalRegex.test( word ) ) {
		return word.slice( 0, -1 );
	}
	return word;
}

/**
 * Checks whether a word is in the full-form exception list and if so returns the canonical stem.
 *
 * @param {string} word	           				The word to be checked.
 * @param {Object} exceptionListWithFullForms   The exception list to check.
 *
 * @returns {string}                The canonical stem if word was found on the list or the original word otherwise.
 */
const checkWordInFullFormExceptions = function( word, exceptionListWithFullForms ) {
	for ( const paradigm of exceptionListWithFullForms ) {
		if ( paradigm[ 1 ].includes( word ) ) {
			return paradigm[ 0 ];
		}
	}
	return null;
};

/**
 * Checks whether a stem is in an exception list of words with multiple stems and if so returns the canonical stem.
 *
 * @param {string} stemmedWord	            The stemmed word to be checked.
 * @param {Object} stemsThatBelongToOneWord The data that shows how non-canonical stems should be canonicalized.
 *
 * @returns {null|string} The canonical stem or null if nothing was found.
 */
const canonicalizeStem = function( stemmedWord, stemsThatBelongToOneWord ) {
	for ( const paradigm of stemsThatBelongToOneWord ) {
		if ( paradigm.includes( stemmedWord ) ) {
			return paradigm[ 0 ];
		}
	}
	return null;
};

/**
 * Stems Slovak words.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Slovak morphology data.
 *
 * @returns {string}    The stemmed word.
 */
export default function stem( word, morphologyData ) {
	// Return stem of words on the full forms exception list.
	const stemFromExceptionListWithFullForms = checkWordInFullFormExceptions( word, morphologyData.exceptionLists.exceptionStemsWithFullForms );
	if ( stemFromExceptionListWithFullForms ) {
		return stemFromExceptionListWithFullForms;
	}
	// Remove case suffixes
	word = removeCases( word, morphologyData );
	// Remove possessive suffixes
	word = removePossessives( word, morphologyData );
	// Remove comparative and superlative affixes
	word = removeComparativeAndSuperlative( word, morphologyData );
	// Remove diminutive suffixes
	word = removeDiminutives( word, morphologyData );
	// Remove augmentative suffixes
	word = removeAugmentatives( word, morphologyData );
	// Remove derivational suffixes
	word = stemDerivational( word, morphologyData );

	// Return canonical stem of words that get a few different stems depending on the form.
	const canonicalStem = canonicalizeStem( word, morphologyData.exceptionLists.stemsThatBelongToOneWord );
	if ( canonicalStem ) {
		return canonicalStem;
	}

	return word;
}
