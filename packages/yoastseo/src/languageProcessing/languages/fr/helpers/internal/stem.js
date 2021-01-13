/* eslint-disable max-statements, complexity */
import { checkIfWordEndingIsOnExceptionList } from "../../../../helpers/morphology/exceptionListHelpers";
import { applyAllReplacements } from "../../../../helpers/morphology/regexHelpers";

/*
 * MIT License
 *
 * Copyright (c) 2017 Bastien Botella
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
 */
/*
 * Author: Kasun Gajasinghe, University of Moratuwa
 * E-Mail: kasunbg AT gmail DOT com
 * Date: 09.08.2010
 *
 * LICENSE:
 *
 * Copyright (c) 2010, Kasun Gajasinghe. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 *    1. Redistributions of source code must retain the above copyright notice,
 *       this list of conditions and the following disclaimer.
 *
 *    2. Redistributions in binary form must reproduce the above copyright notice,
 *       this list of conditions and the following disclaimer in the documentation
 *       and/or other materials provided with the distribution.
 *
 *
 * THIS SOFTWARE IS PROVIDED BY KASUN GAJASINGHE ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL KASUN GAJASINGHE BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR
 * BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE
 * USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

/**
 * Determines R1, R2 and RV.
 *
 * @param {string} word The word for which to determine the R regions.
 * @param {Object} rIntervalsData The regexes that cover French RV and R1 intervals.
 *
 * @returns {[number]} The R1, R2 and RV.
 */
const determineRs = function( word, rIntervalsData ) {
	let rvIndex;

	if ( word.search( new RegExp( rIntervalsData.rvRegex1 ) ) !== -1 || word.search( new RegExp( rIntervalsData.rvRegex2 ) ) !== -1 ) {
		rvIndex = 3;
	} else {
		rvIndex = word.substring( 1 ).search( new RegExp( rIntervalsData.rvRegex3 ) );
		if ( rvIndex === -1 ) {
			rvIndex = word.length;
		} else {
			// +2 is to supplement the substring(1) used to find rvIndex
			rvIndex += 2;
		}
	}
	/*
	 * R1 is the region after the first non-vowel following a vowel, or the end of the word if there is no such non-vowel.
	 * R2 is the region after the first non-vowel following a vowel in R1, or the end of the word if there is no such non-vowel.
	 */
	const r1Regex = new RegExp( rIntervalsData.r1Regex );
	let r1Index = word.search( r1Regex );
	let r1 = "";
	if ( r1Index === -1 ) {
		r1Index = word.length;
	} else {
		r1Index += 2;
		r1 = word.substring( r1Index );
	}

	let r2Index = r1.search( r1Regex );
	if ( r2Index === -1 ) {
		r2Index = word.length;
	} else {
		r2Index += 2;
		r2Index += r1Index;
	}

	if ( r1Index !== -1 && r1Index < 3 ) {
		r1Index = 3;
	}

	return [
		r1Index,
		r2Index,
		rvIndex,
	];
};

/**
 * Removes or normalizes standard suffixes.
 *
 * @param {string} word               The word for which to remove suffixes.
 * @param {Object} standardSuffixData The French morphology data covering standard suffixes.
 * @param {number} r1Index            The start index of R1.
 * @param {number} r2Index            The start index of R2.
 * @param {number} rvIndex            The start index of RV.
 *
 * @returns {string} The word with standard suffixes removed or normalized.
 */
const processStandardSuffixes = function( word, standardSuffixData, r1Index, r2Index, rvIndex ) {
	const a1Index = word.search( new RegExp( standardSuffixData.standardSuffixes1 ) ),
		a2Index = word.search( new RegExp( standardSuffixData.standardSuffixes2 ) ),
		a3Index = word.search( new RegExp( standardSuffixData.standardSuffixes3[ 0 ] ) ),
		a4Index = word.search( new RegExp( standardSuffixData.standardSuffixes4[ 0 ] ) ),
		a5Index = word.search( new RegExp( standardSuffixData.standardSuffixes5[ 0 ] ) ),
		a6Index = word.search( new RegExp( standardSuffixData.standardSuffixes6 ) ),
		a7Index = word.search( new RegExp( standardSuffixData.standardSuffixes7 ) ),
		a8Index = word.search( new RegExp( standardSuffixData.standardSuffixes8 ) ),
		a9Index = word.search( new RegExp( standardSuffixData.standardSuffixes9[ 0 ] ) ),
		a10Index = word.search( new RegExp( standardSuffixData.standardSuffixes10[ 0 ] ) ),
		a11Index = word.search( new RegExp( standardSuffixData.standardSuffixes11[ 0 ] ) ),
		a12Index = word.search( new RegExp( standardSuffixData.standardSuffixes12 ) ),
		a13Index = word.search( new RegExp( standardSuffixData.standardSuffixes13[ 0 ] ) ),
		a14Index = word.search( new RegExp( standardSuffixData.standardSuffixes14[ 0 ] ) ),
		a15Index = word.search( new RegExp( standardSuffixData.standardSuffixes15 ) );

	if ( a1Index !== -1 && a1Index >= r2Index ) {
		word = word.substring( 0, a1Index );
	} else if ( a2Index !== -1 && a2Index >= r2Index ) {
		word = word.substring( 0, a2Index );
		const a2Index2 = word.search( new RegExp( standardSuffixData.suffixesPrecedingChar1[ 0 ] ) );

		if ( a2Index2 !== -1 && a2Index2 >= r2Index ) {
			// If preceded by ic, delete if in R2
			word = word.substring( 0, a2Index2 );
		} else {
			// Else replace by iqU
			word = word.replace( new RegExp( standardSuffixData.suffixesPrecedingChar1[ 0 ] ), standardSuffixData.suffixesPrecedingChar1[ 1 ] );
		}
	} else if ( a3Index !== -1 && a3Index >= r2Index ) {
		// Replace with log if in R2
		word = word.slice( 0, a3Index ) + standardSuffixData.standardSuffixes3[ 1 ];
	} else if ( a4Index !== -1 && a4Index >= r2Index ) {
		// Replace with u if in R2
		word = word.slice( 0, a4Index ) + standardSuffixData.standardSuffixes4[ 1 ];
	} else if ( a5Index !== -1 && a5Index >= r2Index ) {
		// Replace with ent if in R2
		word = word.slice( 0, a5Index ) + standardSuffixData.standardSuffixes5[ 1 ];
	} else if ( a12Index !== -1 && a12Index >= r1Index ) {
		// +1- amendment to non-vowel
		word = word.substring( 0, a12Index + 1 );
	} else if ( a6Index !== -1 && a6Index >= rvIndex ) {
		word = word.substring( 0, a6Index );

		const precedingCharacter2 =  word.search( new RegExp( standardSuffixData.suffixesPrecedingChar2[ 0 ] ) );
		const a6Index2 = word.search( new RegExp( standardSuffixData.suffixesPrecedingChar4[ 0 ] ) );
		const precedingCharacter5 = word.search( new RegExp( standardSuffixData.suffixesPrecedingChar5[ 0 ] ) );
		const precedingCharacter6 = word.search(  new RegExp( standardSuffixData.suffixesPrecedingChar6[ 0 ] ) );
		if ( precedingCharacter2 >= r2Index ) {
			word = word.slice( 0, precedingCharacter2 ) + standardSuffixData.suffixesPrecedingChar2[ 1 ];

			const precedingCharacter3 = word.search( new RegExp( standardSuffixData.suffixesPrecedingChar3[ 0 ] ) );
			if ( precedingCharacter3 >= r2Index ) {
				word = word.slice( 0, precedingCharacter3 ) + standardSuffixData.suffixesPrecedingChar3[ 1 ];
			}
		} else if ( word.search( new RegExp( standardSuffixData.suffixesPrecedingChar4[ 0 ] ) ) !== -1 ) {
			if ( a6Index2 >= r2Index ) {
				word = word.substring( 0, a6Index2 );
			} else if ( a6Index2 >= r1Index ) {
				word = word.substring( 0, a6Index2 ) + standardSuffixData.suffixesPrecedingChar4[ 1 ];
			}
		} else if ( precedingCharacter5 >= r2Index ) {
			// If preceded by abl or iqU, delete if in R2
			word = word.slice( 0, precedingCharacter5 ) + standardSuffixData.suffixesPrecedingChar5[ 1 ];
		} else if ( precedingCharacter6 >= rvIndex ) {
			// If preceded by ièr, replace with i if in RV
			word = word.slice( 0, precedingCharacter6 ) + standardSuffixData.suffixesPrecedingChar6[ 1 ];
		}
	} else if ( a7Index !== -1 && a7Index >= r2Index ) {
		// Delete if in R2
		word = word.substring( 0, a7Index );

		const a7Index2 = word.search( new RegExp( standardSuffixData.suffixesPrecedingChar7[ 0 ] ) );
		const a7Index3 = word.search( new RegExp( standardSuffixData.suffixesPrecedingChar1[ 0 ] ) );
		if ( a7Index2 !== -1 ) {
			// If preceded by abil, delete if in R2, else replace by abl, otherwise
			if ( a7Index2 >= r2Index ) {
				word = word.substring( 0, a7Index2 );
			} else {
				word = word.substring( 0, a7Index2 ) + standardSuffixData.suffixesPrecedingChar7[ 1 ];
			}
		} else if ( a7Index3 !== -1 ) {
			if ( a7Index3 !== -1 && a7Index3 >= r2Index ) {
				// If preceded by ic, delete if in R2
				word = word.substring( 0, a7Index3 );
			} else {
				// Else replace by iqU
				word = word.substring( 0, a7Index3 ) + standardSuffixData.suffixesPrecedingChar1[ 1 ];
			}
		} else if ( word.search( new RegExp( standardSuffixData.suffixesPrecedingChar2[ 0 ] ) ) >= r2Index ) {
			word = word.replace( new RegExp( standardSuffixData.suffixesPrecedingChar2[ 0 ] ), standardSuffixData.suffixesPrecedingChar2[ 1 ] );
		}
	} else if ( a8Index !== -1 && a8Index >= r2Index ) {
		word = word.substring( 0, a8Index );

		if ( word.search( new RegExp( standardSuffixData.suffixesPrecedingChar3[ 0 ] ) ) >= r2Index ) {
			word = word.replace( new RegExp( standardSuffixData.suffixesPrecedingChar3[ 0 ] ), standardSuffixData.suffixesPrecedingChar3[ 1 ] );

			if ( word.search(  new RegExp( standardSuffixData.suffixesPrecedingChar1[ 0 ] ) ) >= r2Index ) {
				word = word.replace(  new RegExp( standardSuffixData.suffixesPrecedingChar1[ 0 ] ), "" );
			} else {
				word = word.replace(  new RegExp( standardSuffixData.suffixesPrecedingChar1[ 0 ] ), standardSuffixData.suffixesPrecedingChar1[ 1 ] );
			}
		}
	} else if ( a9Index !== -1 ) {
		word = word.replace( new RegExp( standardSuffixData.standardSuffixes9[ 0 ] ), standardSuffixData.standardSuffixes9[ 1 ] );
	} else if ( a10Index >= r1Index ) {
		word = word.replace( new RegExp( standardSuffixData.standardSuffixes10[ 0 ] ), standardSuffixData.standardSuffixes10[ 1 ] );
	} else if ( a11Index !== -1 ) {
		const a11Index2 = word.search( new RegExp( standardSuffixData.standardSuffixes11[ 0 ] ) );

		if ( a11Index2 >= r2Index ) {
			word = word.substring( 0, a11Index2 );
		} else if ( a11Index2 >= r1Index ) {
			word = word.substring( 0, a11Index2 ) + standardSuffixData.standardSuffixes11[ 1 ];
		}
	} else if ( a13Index !== -1 && a13Index >= rvIndex ) {
		word = word.replace( new RegExp( standardSuffixData.standardSuffixes13[ 0 ] ), standardSuffixData.standardSuffixes13[ 1 ]  );
	} else if ( a14Index !== -1 && a14Index >= rvIndex ) {
		word = word.replace( new RegExp( standardSuffixData.standardSuffixes14[ 0 ] ), standardSuffixData.standardSuffixes14[ 1 ] );
	} else if ( a15Index !== -1 && a15Index >= rvIndex ) {
		word = word.substring( 0, a15Index + 1 );
	}

	return word;
};

/**
 * Removes verb suffixes starting with i.
 *
 * @param {string} word                       The word for which to remove suffixes.
 * @param {string} originalWord               The unprocessed word.
 * @param {number} rvIndex                    The start index of RV.
 * @param {string} verbSuffixesWithIBeginning Data for checking French suffixes starting with I.
 *
 * @returns {{step2aDone: boolean, word: string}} The word and information about whether the conditions for step 2a were met.
 */
const removeVerbSuffixesStartingWithI = function( word, originalWord, rvIndex, verbSuffixesWithIBeginning ) {
	let step2aDone = false;
	if ( originalWord === word.toLowerCase() || checkIfWordEndingIsOnExceptionList( originalWord, verbSuffixesWithIBeginning.exceptions ) ) {
		step2aDone = true;

		const b1Regex = new RegExp( verbSuffixesWithIBeginning.suffixes[ 0 ] );
		if ( word.search( b1Regex ) >= rvIndex ) {
			word = word.replace( b1Regex, verbSuffixesWithIBeginning.suffixes[ 1 ] );
		}
	}

	return { word, step2aDone };
};

/**
 * Removes other verb suffixes.
 *
 * @param {string}  word              The word for which to remove suffixes.
 * @param {boolean} step2aDone        Whether step 2a was done.
 * @param {string}  wordAfterStep1    The word after step 1 was done.
 * @param {number}  r2Index           The start index of R2.
 * @param {number}  rvIndex           The start index of RV.
 * @param {Object}  morphologyData    The French morphology data.
 *
 * @returns {string} The word after other verb suffixes were removed.
 */
const removeOtherVerbSuffixes = function( word, step2aDone, wordAfterStep1, r2Index, rvIndex, morphologyData ) {
	const otherVerbSuffixes = morphologyData.regularStemmer.otherVerbSuffixes;

	if ( step2aDone && wordAfterStep1 === word ) {
		const suffixIons = new RegExp( otherVerbSuffixes[ 0 ] );
		if ( word.search( suffixIons ) >= r2Index ) {
			return word.replace( suffixIons, "" );
		}

		for ( let i = 1; i < otherVerbSuffixes.length; i++ ) {
			const regex = new RegExp( otherVerbSuffixes[ i ] );
			if ( word.search( regex ) >= rvIndex ) {
				return word.replace( regex, "" );
			}
		}
		// Check if a word ends in "ons" preceded by "i", if it is "ons" is not stemmed.
		if ( word.endsWith( "ions" ) ) {
			return word;
		}

		// Check if a word ends in "ons" preceded by other than "i" and stem it if it is in RV.
		const verbSuffixOns = new RegExp( morphologyData.regularStemmer.verbSuffixOns );
		if ( word.search( verbSuffixOns ) >= rvIndex ) {
			word = word.replace( verbSuffixOns, "" );
		}
	}

	return word;
};

/**
 * Removes residual suffixes.
 *
 * @param {string}  word                            The word for which to remove residual suffixes.
 * @param {number}  rvIndex                         The start index of RV.
 * @param {number}  r2Index                         The start index of R2.
 * @param {Object}  morphologyDataRegularStemmer    The French morphology data.
 *
 * @returns {string}                                The word after residual suffixes were removed.
 */
const removeResidualSuffixes = function( word, rvIndex, r2Index, morphologyDataRegularStemmer ) {
	const residualSuffixes = morphologyDataRegularStemmer.residualSuffixes;
	if ( word.search( new RegExp( residualSuffixes.residualSuffixes1[ 0 ] ) ) >= rvIndex ) {
		word = word.replace( new RegExp( residualSuffixes.residualSuffixes1[ 0 ] ), residualSuffixes.residualSuffixes1[ 1 ] );
	}

	const e1Index = word.search( new RegExp( residualSuffixes.residualSuffix2 ) );

	if ( e1Index >= r2Index && word.search( new RegExp( residualSuffixes.residualSuffix3 ) ) >= rvIndex ) {
		word = word.substring( 0, e1Index );
	} else {
		let e2Index = word.search( new RegExp( residualSuffixes.residualSuffixes4[ 0 ] ) );

		if ( e2Index >= rvIndex ) {
			word = word.substring( 0, e2Index ) + residualSuffixes.residualSuffixes4[ 1 ];
		} else {
			e2Index = word.search( new RegExp( residualSuffixes.residualSuffix5 ) );
			if ( e2Index >= rvIndex ) {
				// Delete last e.
				word = word.substring( 0, e2Index );
			} else {
				e2Index = word.search( new RegExp( residualSuffixes.residualSuffix6[ 0 ] ) );
				if ( e2Index >= rvIndex ) {
					word = word.substring( 0, e2Index ) + residualSuffixes.residualSuffix6[ 1 ];
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
 * Check whether the stem is on the exception list of stems that belong to one word. If it is, returns the canonical stem.
 *
 * @param {string}	stemmedWord					The stemmed word.
 * @param {Object}	stemsThatBelongToOneWord	The list of stems that belong to one word.
 *
 * @returns {null|string}	The canonical stem if word was found on the list.
 */
const canonicalizeStem = function( stemmedWord, stemsThatBelongToOneWord ) {
	// Check the adjectives list.
	for ( const paradigm of stemsThatBelongToOneWord.adjectives ) {
		if ( paradigm.includes( stemmedWord ) ) {
			return paradigm[ 0 ];
		}
	}
	// Check the verbs list. The infinitive stem is always the canonical stem for verbs.
	for ( const paradigm of stemsThatBelongToOneWord.verbs ) {
		if ( paradigm.includes( stemmedWord ) ) {
			return paradigm[ 0 ];
		}
	}
};

/**
 * Checks whether the word is on the list of words which should be stemmed, even though the suffix would not be found in the
 * required region. If the word is found on the list, the stem specified in that list is returned.
 *
 * @param {string}	word				The word to check.
 * @param {Object}	shortWordsAndStems	The list to check.
 *
 * @returns {null|string} The stem or null if the word was not found on the list.
 */
const checkShortWordsExceptionList = function( word, shortWordsAndStems ) {
	// First check whether the word is on the sub-list of words that cannot take an extra -s suffix.
	for ( const wordStemPair of shortWordsAndStems.cannotTakeExtraSuffixS ) {
		if ( wordStemPair[ 0 ] === word ) {
			return wordStemPair[ 1 ];
		}
	}
	// If the word was not found on the first sub-list, check the second sub-list of words that can take an extra -s suffix.
	if ( word.endsWith( "s" ) ) {
		word = word.slice( 0, -1 );
	}
	for ( const wordStemPair of shortWordsAndStems.canTakeExtraSuffixS ) {
		if ( wordStemPair[ 0 ] === word ) {
			return wordStemPair[ 1 ];
		}
	}
};

/**
 * Stems French words.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The French morphology data.
 *
 * @returns {string} The stemmed word.
 */
export default function stem( word, morphologyData ) {
	word = word.toLowerCase();
	const originalWord = word;

	// Check if the word is on an exception list of words that should be stemmed even though the suffix is not in the required region.
	const wordAfterShortWordsCheck = checkShortWordsExceptionList( word, morphologyData.shortWordsAndStems );
	if ( wordAfterShortWordsCheck ) {
		return wordAfterShortWordsCheck;
	}

	// Check if the word is on an exception list for which all forms of a word and its stem are listed.
	const ifException = checkWordInFullFormExceptions( word, morphologyData.exceptionStemsWithFullForms );
	if ( ifException ) {
		return ifException;
	}

	// Check the exception list of words with plural suffix -x.
	if ( word.endsWith( "x" ) ) {
		const pluralsWithXSuffix = morphologyData.pluralsWithXSuffix;
		if ( pluralsWithXSuffix.includes( word ) ) {
			return word.slice( 0, -1 );
		}
	}

	// Check if the word is on the exception list of words for which -s should not be stemmed.
	if ( word.endsWith( "s" ) ) {
		const sShouldNotBeStemmed = morphologyData.sShouldNotBeStemmed;
		if ( sShouldNotBeStemmed.includes( word ) ) {
			return word;
		}
	}

	// Check if the word is on the exception list of words for which -ent should not be stemmed.
	const nonVerbsOnEnt = morphologyData.nonVerbsOnEnt;
	if ( word.endsWith( "ent" ) ) {
		if ( nonVerbsOnEnt.includes( word ) ) {
			return word;
		}
	}
	if ( word.endsWith( "ents" ) ) {
		if ( nonVerbsOnEnt.includes( word.slice( 0, -1 ) ) ) {
			return word.slice( 0, -1 );
		}
	}

	// Check if word is on the exception list of nouns and adjectives for which the verb suffix -ons should not be stemmed.
	const nonVerbsOnOns = morphologyData.nonVerbsOnOns;
	if ( word.endsWith( "ons" ) ) {
		if ( nonVerbsOnOns.includes( word ) ) {
			return word.slice( 0, -1 );
		}
	}

	// Pre-processing steps
	word = applyAllReplacements( word, morphologyData.regularStemmer.preProcessingStepsRegexes );

	// Determine R1, R2 & RV regions.
	const [
		r1Index,
		r2Index,
		rvIndex,
	] = determineRs( word, morphologyData.regularStemmer.rIntervals );

	/*
	 * Step 1:
	 * Remove standard suffixes
	 */
	word = processStandardSuffixes( word, morphologyData.regularStemmer.standardSuffixes, r1Index, r2Index, rvIndex );
	const wordAfterStep1 = word;

	/*
	 * Step 2a:
	 * Stem verb suffixes beginning with "i"
	 */
	const verbSuffixesStartingWithIRemoved = removeVerbSuffixesStartingWithI(
		word,
		originalWord,
		rvIndex,
		morphologyData.regularStemmer.verbSuffixesWithIBeginning
	);
	word = verbSuffixesStartingWithIRemoved.word;
	const step2aDone = verbSuffixesStartingWithIRemoved.step2aDone;

	/*
	 * Step 2b:
	 * Stem other verb suffixes
	 */
	if ( ! nonVerbsOnEnt.includes( word ) ) {
		word = removeOtherVerbSuffixes(
			word,
			step2aDone,
			wordAfterStep1,
			r2Index,
			rvIndex,
			morphologyData
		);
	}

	if ( originalWord === word.toLowerCase() ) {
		/* Step 4:
		 * Stem residual suffixes.
		 */
		word = removeResidualSuffixes( word, rvIndex, r2Index, morphologyData.regularStemmer );
	} else {
		/*
		 * Step 3 (only needs to be executed if step 4 isn't executed)
		 * Replace final Y with i or final ç with c.
		 */
		const yEnding = morphologyData.regularStemmer.yAndSoftCEndingAndReplacement.yEndingAndReplacement;
		const softCEnding = morphologyData.regularStemmer.yAndSoftCEndingAndReplacement.softCEndingAndReplacement;
		if ( word.endsWith( yEnding[ 0 ] ) ) {
			word = word.slice( 0, -1 ) + yEnding[ 1 ];
		} else if ( word.endsWith( softCEnding[ 0 ] ) ) {
			word = word.slice( 0, -1 ) + softCEnding[ 1 ];
		}
	}

	/* Step 5:
	 * Undouble final consonants
	 */
	word = applyAllReplacements( word, morphologyData.regularStemmer.finalConsonantUndoubling );

	/* Step 6:
	 * Un-accent
	 */
	const unaccentE = morphologyData.regularStemmer.unaccentERegex;
	word = word.replace( new RegExp( unaccentE[ 0 ] ), unaccentE[ 1 ] );
	word = word.toLowerCase();

	const canonicalStem = canonicalizeStem( word, morphologyData.stemsThatBelongToOneWord );
	if ( canonicalStem ) {
		return canonicalStem;
	}

	return word;
}
