/* eslint-disable max-statements,complexity */
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

/**
 * Matches word with an array of regexes and stems the word if there is any match. Further processes the stemmed word
 * if it matches one of the regexes in the second array by attaching an additional ending.
 *
 * @param {string}  word        The word to check.
 * @param {Array}   regexes1    The first array of regexes to check.
 * @param {Array}   regexes2    The second array of regexes to check.
 * @param {Array}   endings     The array of endings to attach to the stemmed word
 *                              if the previously stemmed word matches one of the regexes in the second array.
 * @returns {string}    The stemmed word if there is any matches or otherwise the original word.
 */
export function matchAndStemWordWithRegexArray( word, regexes1, regexes2, endings ) {
	let match;
	for ( let i = 0; i < regexes1.length; i++ ) {
		if ( ( match = new RegExp( regexes1[ i ] ).exec( word ) ) !== null ) {
			word = match[ 1 ];
			if ( new RegExp( regexes2[ i ] ).test( word ) ) {
				word += endings[ i ];
			}
		}
	}
	return word;
}

/**
 * Matches word with a regex and stems the word if there is any match.
 *
 * @param {string}  word     The word to check.
 * @param {string}   regex    The regex to match.
 *
 * @returns {string}    The stemmed word if there is any matches or otherwise the original word.
 */
export function matchAndStemWordWithOneRegex( word, regex ) {
	let match;
	if ( ( match = new RegExp( regex ).exec( word ) ) !== null ) {
		word = match[ 1 ];
	}
	return word;
}

/**
 * Matches word with a regex and stems the word if there is any match. Further processes the stemmed word
 * if it matches one of the two regexes in the second check by attaching an additional ending.
 *
 * @param {string}  word    The word to check.
 * @param {string}  regex1  The first regex to match.
 * @param {string}  regex2  The second regex to match.
 * @param {string}  regex3  The third regex to match.
 * @param {string}  ending  The ending to attach to the stemmed word
 *                          if the previously stemmed word matches one of the conditions in the second check.
 * @returns {string}    The stemmed word if there is any matches or otherwise the original word.
 */
export function matchAndStemWord( word, regex1, regex2, regex3, ending ) {
	let match;
	if ( ( match = new RegExp( regex1 ).exec( word ) ) !== null ) {
		word = match[ 1 ];
		if ( new RegExp( regex2 ).test( word ) || new RegExp( regex3 ).test( word ) ) {
			word += ending;
		}
	}
	return word;
}

/**
 * Checks if a word is in the exception list of step 1 stemming process.
 *
 * @param {string} word             The word to check.
 * @param {Object} morphologyData   The Greek morphology data.
 * @returns {string}    The stem of the word.
 */
function checkExceptionStep1( word, morphologyData ) {
	const exceptions = morphologyData.externalStemmer.step1Exceptions;
	const regex = new RegExp( "(.*)(" + Object.keys( exceptions ).join( "|" ) + ")$" );
	const match = regex.exec( word );
	if ( match !== null ) {
		word = match[ 1 ] + exceptions[ match[ 2 ] ];
	}
	return word;
}

/**
 * Stems suffixes from step 1.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Greek morphology data.
 *
 * @returns {string}     The word without suffixes or the original word if no such suffix is found.
 */
function stemWordStep1( word, morphologyData ) {
	const regexesStep1 = morphologyData.externalStemmer.regexesStep1;
	const regexesArrays = regexesStep1.regexesArrays;
	let match;
	if ( ( match = new RegExp( regexesStep1.regex1a ).exec( word ) ) !== null ) {
		word = match[ 1 ];
		if ( ! new RegExp( regexesStep1.regex1b ).test( word ) ) {
			word += "ΑΔ";
		}
	}
	word = matchAndStemWordWithRegexArray( word, regexesArrays[ 0 ], regexesArrays[ 1 ], regexesArrays[ 2 ] );

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
function stemWordStep2( word, morphologyData ) {
	const regexesStep2 = morphologyData.externalStemmer.regexesStep2;
	const vowelRegex1 = new RegExp( morphologyData.externalStemmer.vowelRegex1 );
	let match;
	if ( ( match = new RegExp( regexesStep2.regex2a ).exec( word ) ) !== null && match[ 1 ].length > 4 ) {
		word = match[ 1 ];
	}
	if ( ( match = new RegExp( regexesStep2.regex2b ).exec( word ) ) !== null ) {
		word = match[ 1 ];

		if ( vowelRegex1.test( word ) || word.length < 2 || new RegExp( regexesStep2.regex2c ).test( match[ 1 ] ) ) {
			word += "Ι";
		}
		if ( new RegExp( regexesStep2.regex2d ).test( match[ 1 ] ) ) {
			word += "ΑΙ";
		}
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
function stemWordStep3( word, morphologyData ) {
	const vowelRegex1 = new RegExp( morphologyData.externalStemmer.vowelRegex1 );
	const regexesStep3 = morphologyData.externalStemmer.regexesStep3;
	let match;
	if ( ( match = new RegExp( regexesStep3.regex3a ).exec( word ) ) !== null ) {
		word = match[ 1 ];
		if ( vowelRegex1.test( word ) || new RegExp( regexesStep3.regex3b ).test( word ) || new RegExp( regexesStep3.regex3c ).test( word ) ) {
			word += "ΙΚ";
		}
	}
	return word;
}

/**
 * Stems verb and nouns suffixes.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Greek morphology data.
 *
 * @returns {string}     The word without suffixes or the original word if no such suffix is found.
 */
function stemWordStep4( word, morphologyData ) {
	const regexesStep4 = morphologyData.externalStemmer.regexesStep4;
	const regexesArrays = regexesStep4.regexesArrays;
	const vowelRegex1 = morphologyData.externalStemmer.vowelRegex1;
	const vowelRegex2 = morphologyData.externalStemmer.vowelRegex2;
	let match;
	if ( word === "ΑΓΑΜΕ" ) {
		return "ΑΓΑΜ";
	}

	word = matchAndStemWordWithOneRegex( word, regexesStep4.regex4a );

	word = matchAndStemWordWithRegexArray( word, regexesArrays.arrays1[ 0 ], regexesArrays.arrays1[ 1 ], regexesArrays.arrays1[ 2 ] );

	word = matchAndStemWord( word, regexesStep4.regex4b, vowelRegex2, regexesStep4.regex4c, "ΑΝ" );

	word = matchAndStemWordWithOneRegex( word, regexesStep4.regex4d );

	if ( ( match = new RegExp( regexesStep4.regex4e ).exec( word ) ) !== null ) {
		word = match[ 1 ];
		if ( new RegExp( vowelRegex2 ).test( word ) || new RegExp( regexesStep4.regex4f ).test( word ) ||
			new RegExp( regexesStep4.regex4g ).test( word ) ) {
			word += "ΕΤ";
		}
	}

	if ( ( match = new RegExp( regexesStep4.regex4h ).exec( word ) ) !== null ) {
		word = match[ 1 ];
		if ( new RegExp( regexesStep4.regex4i ).test( match[ 1 ] ) ) {
			word += "ΟΝΤ";
		} else if ( new RegExp( regexesStep4.regex4j ).test( match[ 1 ] ) ) {
			word += "ΩΝΤ";
		}
	}
	word = matchAndStemWordWithRegexArray( word, regexesArrays.arrays2[ 0 ], regexesArrays.arrays2[ 1 ], regexesArrays.arrays2[ 2 ] );

	word = matchAndStemWordWithOneRegex( word, regexesStep4.regex4k );

	word = matchAndStemWord( word, regexesStep4.regex4l, regexesStep4.regex4m, regexesStep4.regex4n, "ΗΚ" );

	if ( ( match = new RegExp( regexesStep4.regex4o ).exec( word ) ) !== null ) {
		word = match[ 1 ];
		if ( new RegExp( vowelRegex1 ).test( word ) || new RegExp( regexesStep4.regex4p ).test( match[ 1 ] ) ||
			new RegExp( regexesStep4.regex4q ).test( match[ 1 ] ) ) {
			word += "ΟΥΣ";
		}
	}

	if ( ( match = new RegExp( regexesStep4.regex4r ).exec( word ) ) !== null ) {
		word = match[ 1 ];

		if ( new RegExp( regexesStep4.regex4s ).test( word ) ||
			( new RegExp( regexesStep4.regex4t ).test( word ) && ! new RegExp( regexesStep4.regex4u ).test( word ) ) ) {
			word += "ΑΓ";
		}
	}
	word = matchAndStemWordWithRegexArray( word, regexesArrays.arrays3[ 0 ], regexesArrays.arrays3[ 1 ], regexesArrays.arrays3[ 2 ] );

	return word;
}

/**
 * Stems adjective suffixes.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Greek morphology data.
 *
 * @returns {string}     The word without suffixes or the original word if no such suffix is found.
 */
function stemWordStep5( word, morphologyData ) {
	const regexesStep5 = morphologyData.externalStemmer.regexesStep5;
	let match;
	if ( ( match = new RegExp( regexesStep5.regex5a ).exec( word ) ) !== null ) {
		word = match[ 1 ] + "Μ";
		if ( new RegExp( regexesStep5.regex5b ).test( match[ 1 ] ) ) {
			word += "Α";
		} else if ( new RegExp( regexesStep5.regex5c ).test( match[ 1 ] ) ) {
			word += "ΑΤ";
		}
	}

	if ( ( match = new RegExp( regexesStep5.regex5d ).exec( word ) ) !== null ) {
		word = match[ 1 ] + "ΟΥ";
	}

	return word;
}

/**
 * Stems superlative and comparative suffixes.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Greek morphology data.
 *
 * @returns {string}     The word without suffixes or the original word if no such suffix is found.
 */
function stemWordStep6( word, morphologyData ) {
	const regexesStep6 = morphologyData.externalStemmer.regexesStep6;

	let match;
	if ( ( match = new RegExp( regexesStep6.regex6a ).exec( word ) ) !== null ) {
		if ( ! new RegExp( regexesStep6.regex6b ).test( match[ 1 ] ) ) {
			word = match[ 1 ];
		}
		if ( new RegExp( regexesStep6.regex6c ).test( match[ 1 ] ) ) {
			word += "ΥΤ";
		}
	}

	return word;
}

/**
 * Normalizes Greek by removing accents.
 *
 * @param {string} text The text that should be normalized.
 *
 * @returns {string} The normalized text.
 */
function normalizeGreek( text ) {
	return text.replace( /[ΆΑά]/g, "α" )
		.replace( /[ΈΕέ]/g, "ε" )
		.replace( /[ΉΗή]/g, "η" )
		.replace( /[ΊΪΙίΐϊ]/g, "ι" )
		.replace( /[ΌΟό]/g, "ο" )
		.replace( /[ΎΫΥύΰϋ]/g, "υ" )
		.replace( /[ΏΩώ]/g, "ω" )
		.replace( /[Σς]/g, "σ" );
}

/**
 * Stems Greek words
 *
 * @param {string} word           The word to stem.
 * @param {Object} morphologyData The object that contains regex-based rules and exception lists for Greek stemming.
 *
 * @returns {string} The stem of a Greek word.
 */
export default function stem( word, morphologyData ) {
	word = normalizeGreek( word );

	// We process the word in uppercase to account for the character changing in lowercase depending on its position in the word.
	word = word.toLocaleUpperCase( "el" );

	const originalWord = word;

	const doNotStemWords = morphologyData.externalStemmer.doNotStemWords;
	if ( word.length < 3 || doNotStemWords.includes( word ) ) {
		return word.toLocaleLowerCase( "el" );
	}
	// Check for exceptions first before proceeding to the next step.
	word = checkExceptionStep1( word, morphologyData );

	// Step 1
	word = stemWordStep1( word, morphologyData );

	// Step 2
	word = stemWordStep2( word, morphologyData );

	// Step 3
	word = stemWordStep3( word, morphologyData );

	// Step 4
	word = stemWordStep4( word, morphologyData );

	// Step 5
	word = stemWordStep5( word, morphologyData );

	// Handle long words.
	const longWordRegex = morphologyData.externalStemmer.longWordRegex;
	if ( originalWord.length === word.length ) {
		word = matchAndStemWordWithOneRegex( word, longWordRegex );
	}
	// Step 6
	word = stemWordStep6( word, morphologyData );

	// Make the word lowercase again after the stemming process complete.
	word = word.toLocaleLowerCase( "el" );

	return word;
}
