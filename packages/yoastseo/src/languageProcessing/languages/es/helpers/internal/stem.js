/* eslint-disable max-statements, complexity */
// The original stemmer is available at https://github.com/dmarman/lorca/blob/master/src/stemmer.js.
import { languageProcessing } from "yoastseo";
import checkVerbStemModifications from "./checkVerbStemModifications";

const {
	buildFormRule,
	createRulesFromArrays,
	findMatchingEndingInArray,
} = languageProcessing;

/**
 * Copyright (C) 2018 Domingo Martín Mancera
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 */


/**
 * Checks if the input character is a Spanish vowel.
 *
 * @param {string} letter The character to be checked.
 *
 * @returns {boolean} Whether the input character is a Spanish vowel.
 */
const isVowel = function( letter ) {
	const regex = /[aeiouáéíóú]/gi;

	return regex.test( letter );
};

/**
 * Checks what the position number of the next vowel is. The function starts searching starting from a position specified
 * in the start parameter.
 *
 * @param {string} word         The word to be analyzed.
 * @param {int}    [start=0]    The first position in the word to start checking from.
 *
 * @returns {int} The position at which the next vowel occurs.
 */
const nextVowelPosition = function( word, start ) {
	const length = word.length;

	for ( let position = start; position < length; position++ ) {
		if ( isVowel( word[ position ] ) ) {
			return position;
		}
	}

	return length;
};

/**
 * Checks what the position number of the next consonant is. The function starts searching starting from a position specified
 * in the start parameter.
 *
 * @param {string} word         The word to be analyzed.
 * @param {int}    [start=0]    The first position in the word to start checking from.
 *
 * @returns {int} The position at which the next consonant occurs.
 */
const nextConsonantPosition = function( word, start ) {
	const length = word.length;

	for ( let position = start; position < length; position++ ) {
		if ( ! isVowel( word[ position ] ) ) {
			return position;
		}
	}

	return length;
};

/**
 * Replaces accented vowels with non-accented vowels in the input string.
 *
 * @param {string}   word     The word to be de-accentified.
 *
 * @returns {string} The de-accentified input word.
 */
const removeAccent = function( word ) {
	const accentedVowels = [ "á", "é", "í", "ó", "ú" ];
	const vowels = [ "a", "e", "i", "o", "u" ];

	for ( let i = 0; i < accentedVowels.length; i++ ) {
		word = word.replace( accentedVowels[ i ], vowels[ i ] );
	}

	return word;
};

/**
 * Checks whether the input word ends with the input suffix.
 *
 * @param {string} word   The word to be analyzed.
 * @param {string} suffix The suffix to check for.
 *
 * @returns {boolean} Whether the word ends with the suffix provided.
 */
const endsIn = function( word, suffix ) {
	if ( word.length < suffix.length ) {
		return false;
	}

	return ( word.slice( -suffix.length ) === suffix );
};

/**
 * Checks whether the input word ends with one of the input suffixes and returns the longest suffix matched.
 *
 * @param {string}   word     The word to be analyzed.
 * @param {string[]} suffixes The suffix to check for.
 *
 * @returns {string} The longest suffix matched in the word from the input list of suffixes.
 */
const endsInArr = function( word, suffixes ) {
	const matches = [];
	for ( const i in suffixes ) {
		if ( endsIn( word, suffixes[ i ] ) ) {
			matches.push( suffixes[ i ] );
		}
	}
	const longest = matches.sort( function( a, b ) {
		return b.length - a.length;
	} )[ 0 ];
	if ( longest ) {
		return longest;
	}
	return "";
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
 * The function considers if the input word can be an adjective in -ano/anos/ana/anas and if so stems it.
 *
 * @param   {string}   word     The word to stem.
 * @param   {string}   r1Text   The R1 region of the word to stem.
 *
 * @returns {string}   A stemmed adjective or the input word, if it is not an adjective on -ano/os/a/as.
 */
const stemAdjectivesOnAn = function( word, r1Text ) {
	const adjectiveSuffix = findMatchingEndingInArray( r1Text, [ "ano", "anos", "ana", "anas" ] );

	// Remove o/a/os/as
	if ( adjectiveSuffix !== "" ) {
		if ( word.endsWith( "s" ) ) {
			return word.slice( 0, word.length - 2 );
		}
		return word.slice( 0, word.length - 1 );
	}
	return word;
};

/**
 * The function considers if the input word can be an adverb in -mente and if so stems it.
 *
 * @param   {string}   word                             The word to stem.
 * @param   {string}   r1Text                           The R1 region of the word to stem.
 * @param   {Object}   menteStemming                    An object containing information about how to stem mente-adverbs.
 * @param   {string[]} menteStemming.notMenteAdverbs    An array of words that look like mente-adverbs but are not.
 * @param   {Array}    menteStemming.menteToStem        An array of pairs of regexes to match.
 *
 * @returns {string}   A stemmed adverb or the input word, if it is not an adverb.
 */
const tryStemAsMente = function( word, r1Text, menteStemming ) {
	const suffix = endsIn( r1Text, "mente" );

	// Immediately return the input word if no mente suffix is found or the word is in the stopList.
	if ( ! suffix || menteStemming.notMenteAdverbs.includes( word ) ) {
		return word;
	}

	return buildFormRule( word, createRulesFromArrays( menteStemming.menteToStem ) ) || word;
};

/**
 * The function considers if the input word can be a superlative and if so stems it.
 *
 * @param   {string}   word                                      The word to stem.
 * @param   {string}   r1Text                                    The R1 region of the word to stem.
 * @param   {Object}   superlativesStemming                      An object containing information about how to stem superlatives.
 * @param   {string[]} superlativesStemming.superlativeSuffixes  An array of suffixes possible in superlatives.
 * @param   {string[]} superlativesStemming.notSuperlatives      An array of words that look like superlatives but are not.
 * @param   {Array}    superlativesStemming.superlativeToStem    An array of pairs of regexes to match.
 *
 * @returns {string}   A stemmed superlative or the input word, if it is not a superlative.
 */
const tryStemAsSuperlative = function( word, r1Text, superlativesStemming ) {
	const superlativeSuffix = findMatchingEndingInArray( r1Text, superlativesStemming.superlativeSuffixes );

	// Immediately return the input word if no superlative suffix is found or the word is in the stopList.
	if ( superlativeSuffix === "" || superlativesStemming.notSuperlatives.includes( word ) ) {
		return word;
	}

	return buildFormRule( word, createRulesFromArrays( superlativesStemming.superlativeToStem ) );
};

/**
 * The function considers if the input word can be a diminutive and if so stems it.
 * @param   {string}   word                                         The word to stem.
 * @param   {Object}   diminutivesStemming                          An object containing information about how to stem diminutives.
 * @param   {string[]} diminutivesStemming.notDiminutives           An array of words that look like diminutives but are not.
 * @param   {Array}    diminutivesStemming.diminutiveToStem         An array of pairs of regexes to match.
 * @param   {Array}    diminutivesStemming.irregularDiminutives     An array containing data for irregular diminutives.
 *
 * @returns {string}   A stemmed diminutive or the input word, if it is not a diminutive.
 */
const tryStemAsDiminutive = function( word, diminutivesStemming ) {
	const diminutiveSuffix = findMatchingEndingInArray( word, [ "ito", "ita", "itos", "itas", "íto", "íta", "ítos", "ítas" ] );

	// Immediately return the input word if no diminutive suffix is found or the word is in the stopList.
	if ( diminutiveSuffix === "" ||  diminutivesStemming.notDiminutives.includes( word ) ) {
		return word;
	}

	// Remove o/a/os/as and check irregular diminutives ending in -it-/-ít-
	const wordWithoutEnding = word.endsWith( "s" )
		? word.slice( 0, word.length - 2 )
		: word.slice( 0, word.length - 1 );

	for ( const paradigm of diminutivesStemming.irregularDiminutives ) {
		if ( paradigm[ 1 ].includes( wordWithoutEnding ) ) {
			return paradigm[ 0 ];
		}
	}

	return buildFormRule( word, createRulesFromArrays(  diminutivesStemming.diminutiveToStem ) ) || word;
};

/**
 * Checks whether a stem is in an exception list of verbs, nouns or adjectives with multiple stems and if so returns
 * the canonical stem.
 *
 * @param {string} stemmedWord	            The stemmed word to be checked.
 * @param {Object} stemsThatBelongToOneWord The POS-specific data that shows how non-canonical stems should be canonicalized.
 *
 * @returns {null|string} The canonical stem or null if nothing was found.
 */
const canonicalizeStem = function( stemmedWord, stemsThatBelongToOneWord ) {
	// First check for nouns with multiple stems, which are only diminutives.
	for ( const paradigm of stemsThatBelongToOneWord.nouns ) {
		if ( paradigm.includes( stemmedWord ) ) {
			return paradigm[ 0 ];
		}
	}

	// Second check for adjectives with multiple stems, which are only adjectives ending in -bl/-bil.
	for ( const paradigm of stemsThatBelongToOneWord.adjectives ) {
		if ( paradigm.includes( stemmedWord ) ) {
			return paradigm[ 0 ];
		}
	}

	// Last check for verbs that have irregular forms.
	for ( const paradigm of stemsThatBelongToOneWord.verbs ) {
		if ( paradigm.includes( stemmedWord ) ) {
			return paradigm[ 0 ];
		}
	}
	return null;
};

/**
 * Stems verb suffixes.
 *
 * @param {string}  word                The original word.
 * @param {string}  wordAfter1          The word after step 1.
 * @param {string}  rvText              The text of the RV.
 * @param {number}  rv                  The start position of the RV.
 *
 * @returns {string} The word with the verb suffixes removed (if applicable).
 */
const stemVerbSuffixes = function( word, wordAfter1, rvText, rv ) {
	// Do step 2a if no ending was removed by step 1.
	const suf = findMatchingEndingInArray( rvText, [ "ya", "ye", "yan", "yen", "yeron", "yendo", "yo", "yó", "yas", "yes", "yais", "yamos" ] );

	if ( suf !== "" && ( word.slice( -suf.length - 1, -suf.length ) === "u" ) ) {
		word = word.slice( 0, -suf.length );
	}

	if ( word !== wordAfter1 ) {
		rvText = word.slice( rv );
	}

	// Do Step 2b if step 2a was done, but failed to remove a suffix.
	if ( word === wordAfter1 ) {
		const suf11 = findMatchingEndingInArray( rvText, [ "arían", "arías", "arán", "arás", "aríais", "aría", "aréis",
			"aríamos", "aremos", "ará", "aré", "erían", "erías", "erán",
			"erás", "eríais", "ería", "eréis", "eríamos", "eremos", "erá",
			"eré", "irían", "irías", "irán", "irás", "iríais", "iría", "iréis",
			"iríamos", "iremos", "irá", "iré", "aba", "ada", "ida", "ía", "ara",
			"iera", "ad", "ed", "id", "ase", "iese", "aste", "iste", "an",
			"aban", "ían", "aran", "ieran", "asen", "iesen", "aron", "ieron",
			"ado", "ido", "ando", "iendo", "ió", "ar", "er", "ir", "as", "abas",
			"adas", "idas", "ías", "aras", "ieras", "ases", "ieses", "ís", "áis",
			"abais", "íais", "arais", "ierais", "  aseis", "ieseis", "asteis",
			"isteis", "ados", "idos", "amos", "ábamos", "íamos", "imos", "áramos",
			"iéramos", "iésemos", "ásemos" ] );
		const suf12 = findMatchingEndingInArray( rvText, [ "en", "es", "éis", "emos" ] );
		if ( suf11 !== "" ) {
			word = word.slice( 0, -suf11.length );
		} else if ( suf12 !== "" ) {
			word = word.slice( 0, -suf12.length );
			if ( endsIn( word, "gu" ) ) {
				word = word.slice( 0, -1 );
			}
		}
	}

	return word;
};

/**
 * Determines the R1, R2 and RV of the word.
 *
 * @param {string} word		The word checked.
 *
 * @returns {number[]} The array of R1, R2, and RV.
 */
const determineWordRegion = function( word ) {
	let r1 = word.length;
	let r2 = word.length;
	let rv = word.length;

	/**
	 * R1 is the region after the first non-vowel following a vowel, or is the null region at the end of the word if
	 * there is no such non-vowel.
	 */
	for ( let i = 0; i < ( word.length - 1 ) && r1 === word.length; i++ ) {
		if ( isVowel( word[ i ] ) && ! isVowel( word[ i + 1 ] ) ) {
			r1 = i + 2;
		}
	}

	/**
	 * R2 is the region after the first non-vowel following a vowel in R1, or is the null region at the end of the
	 * word if there is no such non-vowel.
	 */
	for ( let i = r1; i < ( word.length - 1 ) && r2 === word.length; i++ ) {
		if ( isVowel( word[ i ] ) && ! isVowel( word[ i + 1 ] ) ) {
			r2 = i + 2;
		}
	}

	if ( word.length > 3 ) {
		if ( ! isVowel( word[ 1 ] ) ) {
			rv = nextVowelPosition( word, 2 ) + 1;
		} else if ( isVowel( word[ 0 ] ) && isVowel( word[ 1 ] ) ) {
			rv = nextConsonantPosition( word, 2 ) + 1;
		} else {
			rv = 3;
		}
	}
	return [ r1, r2, rv ];
};

/**
 * Stems enclitic pronouns.
 *
 * @param {string}  word            The word checked.
 * @param {string}  rvText	        The text of RV.
 * @param {Object}  morphologyData  The Spanish morphology data.
 *
 * @returns {string} The word without the enclitic pronoun (if applicable).
 */
const stemEncliticPronouns = function( word, rvText, morphologyData ) {
	const pronounSuffix = [ "me", "se", "sela", "selo", "selas", "selos", "la", "le", "lo", "las", "les", "los", "nos" ];
	const pronounSuffixPre1 = [ "iéndo", "ándo", "ár", "ér", "ír" ];
	const pronounSuffixPre2 = [ "iendo", "ando", "ar", "er", "ir" ];

	const suffix = findMatchingEndingInArray( word, pronounSuffix );

	if ( suffix !== "" && ! morphologyData.wordsThatLookLikeButAreNot.notVerbsEndingInPersonalPronouns.includes( word ) ) {
		let preSuffix = findMatchingEndingInArray( rvText.slice( 0, -suffix.length ), pronounSuffixPre1 );

		if ( preSuffix === "" ) {
			preSuffix = findMatchingEndingInArray( rvText.slice( 0, -suffix.length ), pronounSuffixPre2 );

			if ( preSuffix !== "" || ( endsIn( word.slice( 0, -suffix.length ), "uyendo" ) ) ) {
				word = word.slice( 0, -suffix.length );
			}
		} else {
			word = removeAccent( word.slice( 0, -suffix.length ) );
		}
	}
	return word;
};

/**
 * Stems derivational suffixes such as "anza", "anzas", "ico", "ica", "icos", "icas" etc. E.g. esperanza -> esper
 *
 * @param {string} word		The word checked.
 * @param {string} r2Text	The text of the R2.
 *
 * @returns {string} The word with removed derivational suffix.
 */
const stemDerivationalForms = function( word, r2Text ) {
	const suf1 = findMatchingEndingInArray( r2Text, [ "anza", "anzas", "ico", "ica", "icos", "icas", "ismo", "ismos",
		"able", "ables", "ible", "ibles", "ista", "istas", "oso", "osa",
		"osos", "osas", "amiento", "amientos", "imiento", "imientos" ] );
	const suf2 = findMatchingEndingInArray( r2Text, [ "icadora", "icador", "icación", "icadoras", "icadores", "icaciones",
		"icante", "icantes", "icancia", "icancias", "adora", "ador", "ación",
		"adoras", "adores", "aciones", "ante", "antes", "ancia", "ancias" ] );
	const suf3 = findMatchingEndingInArray( r2Text, [ "logía", "logías" ] );
	const suf4 = findMatchingEndingInArray( r2Text, [ "ución", "uciones" ] );
	const suf5 = findMatchingEndingInArray( r2Text, [ "encia", "encias" ] );
	const suf9 = findMatchingEndingInArray( r2Text, [ "abilidad", "abilidades", "icidad", "icidades", "ividad", "ividades", "idad", "idades" ] );
	const suf10 = findMatchingEndingInArray( r2Text, [ "ativa", "ativo", "ativas", "ativos", "iva", "ivo", "ivas", "ivos" ] );

	if ( suf1 !== "" ) {
		word = word.slice( 0, -suf1.length );
	} else if ( suf2 !== "" ) {
		word = word.slice( 0, -suf2.length );
	} else if ( suf3 !== "" ) {
		word = word.slice( 0, -suf3.length ) + "log";
	} else if ( suf4 !== "" ) {
		word = word.slice( 0, -suf4.length ) + "u";
	} else if ( suf5 !== "" ) {
		word = word.slice( 0, -suf5.length ) + "ente";
	} else if ( suf9 !== "" ) {
		word = word.slice( 0, -suf9.length );
	} else if ( suf10 !== "" ) {
		word = word.slice( 0, -suf10.length );
	}
	return word;
};

/**
 * Stems suffixes "os", "a", "o", "á", "í", "ó", "e", and "é" in RV. e.g. regla -> regl
 *
 * @param {string} word					The word checked.
 * @param {string} rvText				The text of RV.
 * @param {number} rv                  	The start position of the RV.
 * @returns {string} The word with removed suffix.
 */
const stemGenericSuffix = function( word, rvText, rv ) {
	const suf13 = endsInArr( rvText, [ "os", "a", "o", "á", "í", "ó" ] );
	if ( suf13 !== "" ) {
		word = word.slice( 0, -suf13.length );
	} else if ( ( endsInArr( rvText, [ "e", "é" ] ) ) !== "" ) {
		word = word.slice( 0, -1 );
		rvText = word.slice( rv );
		if ( endsIn( rvText, "u" ) && endsIn( word, "gu" ) ) {
			word = word.slice( 0, -1 );
		}
	}
	return word;
};

/**
 * Stems Spanish words.
 *
 * @param {string} word            The word to stem.
 * @param {Object} morphologyData  The Spanish morphology data.
 *
 * @returns {string} The stemmed word.
 */
export default function stem( word, morphologyData ) {
	word.toLowerCase();
	const ifException = checkWordInFullFormExceptions( word, morphologyData.exceptionStemsWithFullForms );
	if ( ifException ) {
		return ifException;
	}

	const nonPluralsOnS = morphologyData.wordsThatLookLikeButAreNot.nonPluralsOnS;
	if ( nonPluralsOnS.includes( word ) ) {
		return removeAccent( word );
	}

	const length = word.length;
	if ( length < 2 ) {
		return removeAccent( word );
	}

	// Determine the r1, r2 and rv of the word
	const [ r1, r2, rv ] = determineWordRegion( word );

	let r1Text = word.slice( r1 );
	let r2Text = word.slice( r2 );
	let rvText = word.slice( rv );
	const originalWord = word;

	const wordAfterAdjectiveOnAnCheck = stemAdjectivesOnAn( word, r1Text );
	if ( wordAfterAdjectiveOnAnCheck !== word ) {
		return removeAccent( wordAfterAdjectiveOnAnCheck );
	}

	/*
	 * Step 0:
	 * Stem enclitic pronouns.
	 */
	word = stemEncliticPronouns( word, rvText, morphologyData );

	if ( word !== originalWord ) {
		r1Text = word.slice( r1 );
		r2Text = word.slice( r2 );
		rvText = word.slice( rv );
	}

	// The word after removing enclitic pronouns.
	const wordAfter0 = word;

	/*
	 * Step 1:
	 * If the word ends in derivational suffixes such as "anza", "anzas", "ico", "ica", "icos", "icas" etc. the suffix will be stemmed here.
	 */
	word = stemDerivationalForms( word, r2Text );

	// Check if the word is an adverb in -mente. Stem it as a adverb if so, and immediately return the result.
	const ifMente = tryStemAsMente( word, r1Text, morphologyData.menteStemming );
	if ( ifMente !== word ) {
		return removeAccent( ifMente );
	}

	// Check if the word is a superlative. Stem it as a superlative if so, and immediately return the result.
	const ifSuperlative = tryStemAsSuperlative( word, r1Text, morphologyData.superlativesStemming );
	if ( ifSuperlative !== word ) {
		return removeAccent( ifSuperlative );
	}

	// Check if the word is a diminutive. Stem it as a diminutive if so, and immediately return the result.
	const ifDiminutive = tryStemAsDiminutive( word, morphologyData.diminutivesStemming );
	if ( ifDiminutive !== word ) {
		return removeAccent( ifDiminutive );
	}

	// Adjust RV text if the word has been changed after derivational suffixes have been removed.
	if ( word !== wordAfter0 ) {
		rvText = word.slice( rv );
	}

	// The word after removing derivational suffixes.
	const wordAfter1 = word;
	/*
	* Step 2a and 2b:
	* Stem verb suffixes.
	*/
	let isNonVerb = false;
	const notVerbForms = morphologyData.wordsThatLookLikeButAreNot.notVerbForms;

	// Stem verbal suffixes if no derivational suffix was detected and removed.
	if ( wordAfter0 === wordAfter1 ) {
		// If the word ends in -s, it is removed before checking the non-verbs list, as the list does not include plural forms.
		let wordWithoutS = word;
		if ( word.endsWith( "s" ) ) {
			wordWithoutS = word.slice( 0, -1 );
		}

		if ( notVerbForms.includes( wordWithoutS ) ) {
			/*
			 * If the word without -s is matched on the non-verbs list, we can perform the next (non-verb) stemming steps
			 * with the -s removed. This is because all possible non-verb suffixes ending in -s also have an equivalent
			 * without the -s (e.g. -as/a; -es/e), so will be stemmed after stripping the -s.
			 */
			word = wordWithoutS;
			isNonVerb = true;
		} else {
			word = stemVerbSuffixes( word, wordAfter1, rvText, rv );
		}
	}

	// Adjust RV text after derivational suffixes have been removed.
	rvText = word.slice( rv );

	/*
	 * Step 4:
	 * Stem generic suffixes;
	 * If the word ends in "os", "a", "o", "á", "í", "ó", "e", "é", the suffix will be removed here.
	 */
	word = stemGenericSuffix( word, rvText, rv );

	// Check if the stemmed word is on the list of words with multiple stems. If so, return the canonical stem.
	const canonicalStem = canonicalizeStem( word, morphologyData.stemsThatBelongToOneWord );
	if ( canonicalStem ) {
		return canonicalStem;
	}

	if ( ! isNonVerb ) {
		const modifiedVerbStem = checkVerbStemModifications( word, morphologyData );
		if ( modifiedVerbStem ) {
			// If on the list of words that look like verbs [notVerbForms] do not perform stem modification.
			// Do not perform at the beginning of the word and if word does not have verb suffix.
			return modifiedVerbStem;
		}
	}

	return removeAccent( word );
}
