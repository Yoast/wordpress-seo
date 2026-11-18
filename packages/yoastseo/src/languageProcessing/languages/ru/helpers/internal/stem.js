/**
 * MIT License
 *
 * Copyright (c) 2016 Alexander Kiryukhin
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
 * https://github.com/neonxp/Stemmer/blob/master/src/NXP/Stemmer.php
 */

/**
 * Checks if the input character is a Russian vowel.
 *
 * @param {string} char             The character to be checked.
 * @param {Object} morphologyData   The Russian morphology data.
 *
 * @returns {boolean} Whether the input character is a Russian vowel.
 */
const isVowel = function( char, morphologyData ) {
	return morphologyData.externalStemmer.vowels.includes( char );
};

/**
 * Determines the RV region of the word.
 *
 * @param {string} word             The word checked.
 * @param {Object} morphologyData   The Russian morphology data.
 *
 * @returns {int} The RV region index.
 */
const findRvRegion = function( word, morphologyData ) {
	let rv = 0;
	let state = 0;
	const wordLength = word.length;

	for ( let i = 1; i < wordLength; i++ ) {
		const prevChar = word.substring( i - 1, i );
		const char = word.substring( i, i + 1 );
		switch ( state ) {
			case 0:
				if ( isVowel( char, morphologyData ) ) {
					rv = i + 1;
					state = 1;
				}
				break;
			case 1:
				if ( isVowel( prevChar, morphologyData ) && isVowel( char, morphologyData ) ) {
					state = 2;
				}
				break;
			case 2:
				if ( isVowel( prevChar, morphologyData ) && isVowel( char, morphologyData ) ) {
					return rv;
				}
				break;
		}
	}

	return rv;
};

/**
 * Removes the endings from the word.
 *
 * @param {string}          word	The word to check.
 * @param {string|string[]} regex	The regex or a pair of regexes to match.
 * @param {int}             region	The word region
 *
 * @returns {string|null}	The word if the stemming rule could be applied or null otherwise.
 */
const removeEndings = function( word, regex, region ) {
	const prefix = word.substring( 0, region );
	const ending = word.substring( prefix.length );

	let currentRegex;

	if ( Array.isArray( regex ) ) {
		currentRegex = new RegExp( regex[ 0 ], "i" );

		if ( currentRegex.test( ending ) ) {
			word = prefix + ending.replace( currentRegex, "" );
			return word;
		}

		currentRegex = new RegExp( regex[ 1 ], "i" );
	} else {
		currentRegex = new RegExp( regex, "i" );
	}

	if ( currentRegex.test( ending ) ) {
		word = prefix + ending.replace( currentRegex, "" );
		return word;
	}

	return null;
};
/**
 * Removes the perfective prefix.
 *
 * @param {string}  word	        The word to check.
 * @param {Object}  morphologyData  The morphology data.
 * @param {int}     rv	            The word region.
 *
 * @returns {string}	The stemmed word if the word has perfective prefix an verb suffix, otherwise the original word.
 */
const removePerfectivePrefix = function( word, morphologyData, rv ) {
	const prefix = word.substring( 0, rv );
	const ending = word.substring( prefix.length );

	const perfectiveEndingsRegex = new RegExp( morphologyData.externalStemmer.regexPerfectiveEndings, "i" );

	// Checks if word has perfective prefix and verb suffix
	if ( ( prefix === "по" && ! ending.startsWith( "д" ) ) || prefix === "про" ) {
		if ( perfectiveEndingsRegex.test( ending ) ) {
			word = ending;
		}
	}
	return word;
};

/**
 * Removes inflectional suffixes from the word.
 *
 * @param {string} word             The word to check.
 * @param {Object} morphologyData   The Russian morphology data.
 * @param {int}    rv               The word rv region.
 *
 * @returns {string}	The word after inflectional suffixes were removed.
 */
const removeInflectionalSuffixes = function( word, morphologyData, rv ) {
	const removeDerivationalNounSuffix = removeEndings( word, morphologyData.externalStemmer.regexDerivationalNounSuffix, rv );
	if ( removeDerivationalNounSuffix ) {
		return removeDerivationalNounSuffix;
	}
	// Try to find a PERFECTIVE GERUND ending. If it exists, remove it and finalize the step.
	const removeGerundSuffixes = removeEndings(
		word,
		[ morphologyData.externalStemmer.regexPerfectiveGerunds1, morphologyData.externalStemmer.regexPerfectiveGerunds2 ],
		rv
	);

	if ( removeGerundSuffixes ) {
		word = removeGerundSuffixes;
	} else {
		// If there is no PERFECTIVE GERUND ending then try removing a REFLEXIVE ending.
		const removeReflexiveSuffixes = removeEndings( word, morphologyData.externalStemmer.regexReflexives, rv );

		if ( removeReflexiveSuffixes ) {
			word = removeReflexiveSuffixes;
		}
		// Try to remove following endings (in this order): ADJECTIVAL, VERB, NOUN. If one of them is found the step is finalized.
		const regexAdjective = morphologyData.externalStemmer.regexAdjective;
		const removeParticipleSuffixes = removeEndings( word, morphologyData.externalStemmer.regexParticiple + regexAdjective, rv );
		const removeAdjectiveSuffixes = removeEndings( word, regexAdjective, rv );

		if ( removeParticipleSuffixes ) {
			word = removeParticipleSuffixes;
		} else if ( removeAdjectiveSuffixes ) {
			word = removeAdjectiveSuffixes;
		} else {
			const removeVerbalSuffixes = removeEndings(
				word,
				[ morphologyData.externalStemmer.regexVerb1, morphologyData.externalStemmer.regexVerb2 ],
				rv
			);
			if ( removeVerbalSuffixes ) {
				word = removeVerbalSuffixes;
			} else {
				const removeNounSuffixes = removeEndings( word, morphologyData.externalStemmer.regexNoun, rv );
				if ( removeNounSuffixes ) {
					word = removeNounSuffixes;
				}
			}
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
 * Returns a canonical stem for verbs with multiple stems.
 *
 * @param {string}  word                    The word to canonicalize.
 * @param {Array}   wordsWithMultipleStems  An array of arrays of stems belonging to one word.
 *
 * @returns {string} A canonical stem or the original word.
 */
const canonicalizeStems = function( word, wordsWithMultipleStems ) {
	const multipleStems = wordsWithMultipleStems.find( stems => stems.includes( word ) );

	if ( multipleStems ) {
		return multipleStems[ 0 ];
	}
};

/**
 * Stems Russian words.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Russian morphology data.
 *
 * @returns {string}	The stemmed word.
 */
export default function stem( word, morphologyData ) {
	// Check if word is in the doNotStemSuffix exception list.
	if ( morphologyData.doNotStemSuffix.includes( word ) ) {
		return word;
	}

	// Check if the word is on the list of exceptions for which we listed all forms and the stem.
	const fullFormException = checkWordInFullFormExceptions( word, morphologyData.exceptionStemsWithFullForms );
	if ( fullFormException ) {
		return fullFormException;
	}

	const rv = findRvRegion( word, morphologyData );

	// Step 1: Remove perfective prefixes.
	word = removePerfectivePrefix( word, morphologyData, rv );

	// Step 2: Remove inflectional suffixes if they are present in the word.
	word = removeInflectionalSuffixes( word, morphologyData, rv );

	// Step 3: If the word ends in "и", remove it.
	const removeIEnding = removeEndings( word, morphologyData.externalStemmer.regexI, rv );
	if ( removeIEnding ) {
		word = removeIEnding;
	}

	// Step 4: There can be one of three options:
	// 1. If the word ends in нн, remove the last letter.
	if ( word.endsWith( morphologyData.externalStemmer.doubleN ) ) {
		word = word.substring( 0, word.length - 1 );
	}

	// 2. If the word ends in a SUPERLATIVE ending, remove it and then again the last letter if the word ends in "нн".
	const removeSuperlativeSuffixes = removeEndings( word, morphologyData.externalStemmer.regexSuperlative, rv );
	if ( removeSuperlativeSuffixes ) {
		word = removeSuperlativeSuffixes;
	}

	// 3. If the word ends in "ь", remove it.
	const removeSoftSignEnding = removeEndings( word, morphologyData.externalStemmer.regexSoftSign, rv );
	if ( removeSoftSignEnding ) {
		word = removeSoftSignEnding;
	}

	// Check if the stem is on the list of stems that belong to one word and if so, return the canonical stem.
	const canonicalizedStem = canonicalizeStems( word, morphologyData.stemsThatBelongToOneWord );
	if ( canonicalizedStem ) {
		return canonicalizedStem;
	}

	return word;
}
