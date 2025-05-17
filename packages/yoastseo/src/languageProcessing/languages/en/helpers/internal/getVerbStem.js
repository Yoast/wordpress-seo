// "use strict";
import { isUndefined } from "lodash";
import { languageProcessing } from "yoastseo";
const { buildFormRule, createRulesFromArrays } = languageProcessing;

const vowelRegex = /([aeiouy])/g;

/**
 * Checks if the input word has one of the standard verb prefixes and if so returns a prefix and a de-prefixed verb to be
 * further used to compare with the list of irregular verbs.
 *
 * @param {string} word             The word for which to determine if it has one of the standard verb prefixes.
 * @param {Object} verbPrefixes     The collection of verb prefixes to be used for normalization
 *
 * @returns {Array} Array of word forms from the exception list.
 */
const normalizePrefixed = function( word, verbPrefixes ) {
	for ( const property in verbPrefixes ) {
		if ( verbPrefixes.hasOwnProperty ) {
			verbPrefixes[ property ] = new RegExp( verbPrefixes[ property ], "i" );
		}
	}

	if ( verbPrefixes.sevenLetterHyphenPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( verbPrefixes.sevenLetterHyphenPrefixes, "" ),
			prefix: word.substring( 0, 8 ),
		};
	}

	if ( verbPrefixes.sevenLetterPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( verbPrefixes.sevenLetterPrefixes, "" ),
			prefix: word.substring( 0, 7 ),
		};
	}

	if ( verbPrefixes.fiveLetterHyphenPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( verbPrefixes.fiveLetterHyphenPrefixes, "" ),
			prefix: word.substring( 0, 6 ),
		};
	}

	if ( verbPrefixes.fiveLetterPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( verbPrefixes.fiveLetterPrefixes, "" ),
			prefix: word.substring( 0, 5 ),
		};
	}

	if ( verbPrefixes.fourLetterHyphenPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( verbPrefixes.fourLetterHyphenPrefixes, "" ),
			prefix: word.substring( 0, 5 ),
		};
	}

	if ( verbPrefixes.fourLetterPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( verbPrefixes.fourLetterPrefixes, "" ),
			prefix: word.substring( 0, 4 ),
		};
	}

	if ( verbPrefixes.threeLetterHyphenPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( verbPrefixes.threeLetterHyphenPrefixes, "" ),
			prefix: word.substring( 0, 4 ),
		};
	}

	if ( verbPrefixes.threeLetterPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( verbPrefixes.threeLetterPrefixes, "" ),
			prefix: word.substring( 0, 3 ),
		};
	}

	if ( verbPrefixes.twoLetterHyphenPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( verbPrefixes.twoLetterHyphenPrefixes, "" ),
			prefix: word.substring( 0, 3 ),
		};
	}

	if ( verbPrefixes.twoLetterPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( verbPrefixes.twoLetterPrefixes, "" ),
			prefix: word.substring( 0, 2 ),
		};
	}

	if ( verbPrefixes.oneLetterPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( verbPrefixes.oneLetterPrefixes, "" ),
			prefix: word.substring( 0, 1 ),
		};
	}
};

/**
 * Checks if the input word occurs in the list of exception verbs and if so returns all its irregular forms.
 * If not checks if it is an irregular verb with one of the standard verb prefixes, if so returns all irregular prefixed forms.
 *
 * @param {string} word             The word for which to determine its irregular forms.
 * @param {Array} irregularVerbs    The array of irregular verbs available for this language.
 * @param {Object} verbPrefixes     The collection of verb prefixes to be used for normalization of irregular verbs.
 *
 * @returns {Array} Array of word forms from the exception list.
 */
const checkIrregulars = function( word, irregularVerbs, verbPrefixes ) {
	let irregulars;

	irregularVerbs.forEach( function( paradigm ) {
		paradigm.forEach( function( wordInParadigm ) {
			if ( wordInParadigm === word ) {
				irregulars = paradigm;
			}
		} );
	} );

	if ( isUndefined( irregulars ) ) {
		const normalizedIrregular = normalizePrefixed( word, verbPrefixes );

		if ( ! isUndefined( normalizedIrregular ) ) {
			irregularVerbs.forEach( function( paradigm ) {
				paradigm.forEach( function( wordInParadigm ) {
					if ( wordInParadigm === normalizedIrregular.normalizedWord ) {
						irregulars = paradigm.map( function( verb ) {
							return normalizedIrregular.prefix.concat( verb );
						} );
					}
				} );
			} );
		}
	}

	return irregulars;
};

/**
 * Checks if the input word ends with "s".
 *
 * @param {string} word The word to check.
 *
 * @returns {boolean} True if the word ends with "s".
 */
const endsWithS = function( word ) {
	const wordLength = word.length;
	// Consider only words of four letters or more to be s-forms (otherwise, words like "its" are being treated as verb forms).
	if ( wordLength > 3 ) {
		return word[ word.length - 1 ] === "s";
	}
	return false;
};

/**
 * Checks if the input word ends with "ing".
 *
 * @param {string} word The word to check.
 *
 * @returns {boolean} True if the word ends with "ing".
 */
const endsWithIng = function( word ) {
	const vowelCount = ( word.match( vowelRegex ) || [] ).length;

	// Consider only words that have at least one more vowel besides "i" in "ing" (otherwise, words like "ping" are being treated as verb forms).
	if ( vowelCount > 1 && word.length > 4 ) {
		return word.substring( word.length - 3, word.length ) === "ing";
	}
	return false;
};

/**
 * Checks if the input word ends with "ed".
 *
 * @param {string} word The word to check.
 *
 * @returns {boolean} True if the word ends with "ed".
 */
const endsWithEd = function( word ) {
	const vowelCount = ( word.match( vowelRegex ) || [] ).length;

	// Consider only words that have at least one more vowel besides "e" in "ed" (otherwise, words like "red" are being treated as verb forms).
	if ( vowelCount > 1 || ( vowelCount === 1 && word.substring( word.length - 3, word.length - 2 ) !== "e" ) ) {
		return word.substring( word.length - 2, word.length ) === "ed";
	}
	return false;
};

/**
 * Forms the infinitive from an input word.
 *
 * @param {string} word                               The word to build the infinitive for.
 * @param {Object} regexVerb                          The list of regex rules used to bring verb forms to infinitive.
 * @param {Array}  regexVerb.sFormToInfinitiveRegex   The array of regex-based rules used to bring -s forms to infinitive.
 * @param {Array}  regexVerb.ingFormToInfinitiveRegex The array of regex-based rules used to bring -ing forms to infinitive.
 * @param {Array}  regexVerb.edFormToInfinitiveRegex  The array of regex-based rules used to bring -ed forms to infinitive.
 *
 * @returns {Object} The infinitive of the input word.
 */
const getInfinitive = function( word, regexVerb ) {
	const sFormToInfinitiveRegex = createRulesFromArrays( regexVerb.sFormToInfinitive );
	const ingFormToInfinitiveRegex = createRulesFromArrays( regexVerb.ingFormToInfinitive );
	const edFormToInfinitiveRegex = createRulesFromArrays( regexVerb.edFormToInfinitive );

	if ( endsWithS( word ) ) {
		return {
			infinitive: buildFormRule( word, sFormToInfinitiveRegex ),
			guessedForm: "s",
		};
	}

	if ( endsWithIng( word ) ) {
		return {
			infinitive: buildFormRule( word, ingFormToInfinitiveRegex ),
			guessedForm: "ing",
		};
	}

	if ( endsWithEd( word ) ) {
		return {
			infinitive: buildFormRule( word, edFormToInfinitiveRegex ) || word,
			guessedForm: "ed",
		};
	}
	return {
		infinitive: word,
		guessedForm: "inf",
	};
};

export {
	getInfinitive,
	checkIrregulars,
	endsWithIng,
	normalizePrefixed,
};
