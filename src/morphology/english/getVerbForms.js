// "use strict";
const irregularVerbs = require( "./irregularVerbs.js" );
const verbPrefixesRegex = require( "./regexVerb.js" ).verbPrefixes;
const sFormToInfinitiveRegex = require( "./regexVerb.js" ).sFormToInfinitive;
const ingFormToInfinitiveRegex = require( "./regexVerb.js" ).ingFormToInfinitive;
const edFormToInfinitiveRegex = require( "./regexVerb.js" ).edFormToInfinitive;
const infinitiveToSFormRegex = require( "./regexVerb.js" ).infinitiveToSForm;
const infinitiveToIngFormRegex = require( "./regexVerb.js" ).infinitiveToIngForm;
const infinitiveToEdFormRegex = require( "./regexVerb.js" ).infinitiveToEdForm;

const isUndefined = require( "lodash/isUndefined.js" );
const unique = require( "lodash/uniq" );

/**
 * Checks if the input word has one of the standard verb prefixes and if so returns a prefix and a de-prefixed verb to be
 * further used to compare with the list of irregular verbs.
 *
 * @param {string} word The word for which to determine if it has one of the standard verb prefixes.
 *
 * @returns {Array} Array of word forms from the exception list.
 */
const normalizePrefixed = function( word ) {
	if ( verbPrefixesRegex.sevenLetterHyphenPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( verbPrefixesRegex.sevenLetterHyphenPrefixes, "" ),
			prefix: word.substring( 0, 8 ),
		};
	}

	if ( verbPrefixesRegex.sevenLetterPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( verbPrefixesRegex.sevenLetterPrefixes, "" ),
			prefix: word.substring( 0, 7 ),
		};
	}

	if ( verbPrefixesRegex.fiveLetterHyphenPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( verbPrefixesRegex.fiveLetterHyphenPrefixes, "" ),
			prefix: word.substring( 0, 6 ),
		};
	}

	if ( verbPrefixesRegex.fiveLetterPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( verbPrefixesRegex.fiveLetterPrefixes, "" ),
			prefix: word.substring( 0, 5 ),
		};
	}

	if ( verbPrefixesRegex.fourLetterHyphenPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( verbPrefixesRegex.fourLetterHyphenPrefixes, "" ),
			prefix: word.substring( 0, 5 ),
		};
	}

	if ( verbPrefixesRegex.fourLetterPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( verbPrefixesRegex.fourLetterPrefixes, "" ),
			prefix: word.substring( 0, 4 ),
		};
	}

	if ( verbPrefixesRegex.threeLetterHyphenPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( verbPrefixesRegex.threeLetterHyphenPrefixes, "" ),
			prefix: word.substring( 0, 4 ),
		};
	}

	if ( verbPrefixesRegex.threeLetterPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( verbPrefixesRegex.threeLetterPrefixes, "" ),
			prefix: word.substring( 0, 3 ),
		};
	}

	if ( verbPrefixesRegex.twoLetterHyphenPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( verbPrefixesRegex.twoLetterHyphenPrefixes, "" ),
			prefix: word.substring( 0, 3 ),
		};
	}

	if ( verbPrefixesRegex.twoLetterPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( verbPrefixesRegex.twoLetterPrefixes, "" ),
			prefix: word.substring( 0, 2 ),
		};
	}

	if ( verbPrefixesRegex.oneLetterPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( verbPrefixesRegex.oneLetterPrefixes, "" ),
			prefix: word.substring( 0, 1 ),
		};
	}
};

/**
 * Checks if the input word occurs in the list of exception verbs and if so returns all its irregular forms.
 * If not checks if it is an irregular verb with one of the standard verb prefixes, if so returns all irregular prefixed forms.
 *
 * @param {string} word The word for which to determine its irregular forms.
 *
 * @returns {Array} Array of word forms from the exception list.
 */
const checkIrregulars = function( word ) {
	let irregulars;

	irregularVerbs.forEach( function( paradigm ) {
		paradigm.forEach( function( wordInParadigm ) {
			if ( wordInParadigm === word ) {
				irregulars = paradigm;
			}
		} );
	} );

	if ( isUndefined( irregulars ) ) {
		const normalizedIrregular = normalizePrefixed( word );

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
	const wordLength = word.length;
	// Consider only words of five letters or more to be ing forms (otherwise, words like "ping" are being treated as verb forms).
	if ( wordLength > 4 ) {
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
	const wordLength = word.length;
	// Consider only words of four letters or more to be past forms (otherwise, words like "red" are being treated as verb forms).
	if ( wordLength > 3 ) {
		return word.substring( word.length - 2, word.length ) === "ed";
	}
	return false;
};

/**
 * Checks if the input word qualifies for the input regex and if so builds a required form.
 * This function is used for other more specific functions.
 *
 * @param {string} word The word to build forms for.
 * @param {string} regex The regex to compare the word against.
 *
 * @returns {string} The newly built form of the word.
 */
const buildVerbFormFromRegex = function( word, regex ) {
	for ( let i = 0; i < regex.length; i++ ) {
		if ( regex[ i ].reg.test( word ) === true ) {
			return word.replace( regex[ i ].reg, regex[ i ].repl );
		}
	}
};

/**
 * Forms the infinitive from an s-form.
 *
 * @param {string} word The word to build forms for.
 *
 * @returns {string} The infinitive formed from the input word.
 */
const sFormToInfinitive = function( word ) {
	return buildVerbFormFromRegex( word, sFormToInfinitiveRegex );
};

/**
 * Forms the infinitive from an ing-form.
 *
 * @param {string} word The word to build forms for.
 *
 * @returns {string} The infinitive formed from the input word.
 */
const ingFormToInfinitive = function( word ) {
	return buildVerbFormFromRegex( word, ingFormToInfinitiveRegex );
};

/**
 * Forms the infinitive from an ed-form.
 *
 * @param {string} word The word to build forms for.
 *
 * @returns {string} The infinitive formed from the input word.
 */
const edFormToInfinitive = function( word ) {
	return buildVerbFormFromRegex( word, edFormToInfinitiveRegex );
};

/**
 * Forms the s-form from an infinitive.
 *
 * @param {string} word The word to build forms for.
 *
 * @returns {string} The s-form from the input word.
 */
const infinitiveToSForm = function( word ) {
	return buildVerbFormFromRegex( word, infinitiveToSFormRegex );
};

/**
 * Forms the ing-form from an infinitive.
 *
 * @param {string} word The word to build forms for.
 *
 * @returns {string} The ing-form from the input word.
 */
const infinitiveToIngForm = function( word ) {
	return buildVerbFormFromRegex( word, infinitiveToIngFormRegex );
};

/**
 * Forms the ed-form from an infinitive.
 *
 * @param {string} word The word to build forms for.
 *
 * @returns {string} The ed-form from the input word.
 */
const infinitiveToEdForm = function( word ) {
	return buildVerbFormFromRegex( word, infinitiveToEdFormRegex );
};

/**
 * Forms the infinitive from an input word.
 *
 * @param {string} word The word to build the infinitive for.
 *
 * @returns {string} The infinitive of the input word.
 */
const getInfinitive = function( word ) {
	if ( endsWithS( word ) ) {
		return {
			infinitive: sFormToInfinitive( word ),
			guessedForm: "s",
		};
	}

	if ( endsWithIng( word ) ) {
		return {
			infinitive: ingFormToInfinitive( word ),
			guessedForm: "ing",
		};
	}

	if ( endsWithEd( word ) ) {
		return {
			infinitive: edFormToInfinitive( word ),
			guessedForm: "ed",
		};
	}
	return {
		infinitive: word,
		guessedForm: "inf",
	};
};

/**
 * Collects all possible verb forms for a given word through checking if it is irregular, infinitive, s-form, ing-form or ed-form.
 *
 * @param {string} word The word for which to determine its forms.
 *
 * @returns {Array} Array of word forms.
 */
const getVerbForms = function( word ) {
	const irregular = checkIrregulars( word );
	if ( ! isUndefined( irregular ) ) {
		return irregular;
	}

	let forms = [];
	let infinitive = getInfinitive( word ).infinitive;

	if ( isUndefined( infinitive ) ) {
		infinitive = word;
	}

	// const guessedForm = getInfinitive( word ).guessedForm; //Meant to be used to check if the newly built forms are built correctly.
	forms = forms.concat( word );

	forms.push( infinitive );
	forms.push( infinitiveToSForm( infinitive ) );
	forms.push( infinitiveToIngForm( infinitive ) );
	forms.push( infinitiveToEdForm( infinitive ) );

	forms = forms.filter( Boolean );

	return unique( forms );
};

module.exports = {
	getVerbForms: getVerbForms,
	normalizePrefixed: normalizePrefixed,
};
