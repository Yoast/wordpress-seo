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

import { findMatchingEndingInArray } from "../morphoHelpers/findMatchingEndingInArray";


/**
 * Checks whether the character is a vowel.
 *
 * @param {string}	character	The character to check.
 *
 * @returns {boolean}	Whether the character is a vowel.
 */
const isVowel = function( character ) {
	const regex = /[aeiouáéíóúâêô]/gi;

	return regex.test( character );
};

/**
 * Finds the first vowel in a string after the specified index and returns the index of the character following that vowel
 * (if found).
 *
 * @param {string}	word	    The word to check.
 * @param {number}	[start=0]   The index at which the search for a vowel should begin.
 *
 * @returns {number} The index of the character following the found vowel. If this is not found, the length of the word.
 */
const nextVowelPosition = function( word, start = 0 ) {
	const length = word.length;

	for ( let position = start; position < length; position++ ) {
		if ( isVowel( word[ position ] ) ) {
			return position;
		}
	}

	return length;
};

/**
 * Finds the first consonant in a string after the specified index and returns the index of the character following that
 * consonant (if found).
 *
 * @param {string}	word	    The word to check.
 * @param {number}	[start=0]	The index at which the search for a consonant should begin.
 *
 * @returns {number} The index of the character following the found consonant. If this is not found, the length of the word.
 */
const nextConsonantPosition = function( word, start = 0 ) {
	const length = word.length;

	for ( let position = start; position < length; position++ ) {
		if ( ! isVowel( word[ position ] ) ) {
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
 * @param {string}	word	The word to check.
 * @param {string}	r1Text	The text in the R1 region.
 * @param {string}	r2Text	The text in the R2 region.
 * @param {string}	rvText	The text in the RV region.
 *
 * @returns {string} The stemmed word or the original word if no suffix was removed.
 */
const stemStandardSuffixes = function( word, r1Text, r2Text, rvText ) {
	const suf1 = findMatchingEndingInArray( r2Text, [ "amentos", "imentos", "aço~es", "adoras", "adores", "amento",
		"imento", "aça~o", "adora", "ância", "antes", "ismos", "istas", "ador", "ante", "ável", "ezas", "icas", "icos", "ismo",
		"ista", "ível", "osas", "osos", "eza", "ica", "ico", "osa", "oso" ] );
	const suf2 = findMatchingEndingInArray( r2Text, [ "logias", "logia" ] );
	const suf3 = findMatchingEndingInArray( r2Text, [ "ências", "ência" ] );
	const suf4 = findMatchingEndingInArray( r2Text, [ "ativamente", "icamente", "ivamente", "osamente", "adamente" ] );
	const suf5 = findMatchingEndingInArray( r1Text, [ "amente" ] );
	const suf6 = findMatchingEndingInArray( r2Text, [ "antemente", "avelmente", "ivelmente", "mente" ] );
	const suf7 = findMatchingEndingInArray( r2Text, [ "abilidades", "abilidade", "icidades", "icidade", "ividades",
		"ividade", "idades", "idade" ] );
	const suf8 = findMatchingEndingInArray( r2Text, [ "ativas", "ativos", "ativa", "ativo", "ivas", "ivos", "iva", "ivo" ] );
	const suf9 = findMatchingEndingInArray( rvText, [ "iras", "ira" ] );

	if ( suf1 !== "" ) {
		word = word.slice( 0, -suf1.length );
	} else if ( suf2 !== "" ) {
		word = word.slice( 0, -suf2.length ) + "log";
	} else if ( suf3 !== "" ) {
		word = word.slice( 0, -suf3.length ) + "ente";
	} else if ( suf4 !== "" ) {
		word = word.slice( 0, -suf4.length );
	} else if ( suf5 !== "" ) {
		word = word.slice( 0, -suf5.length );
	} else if ( suf6 !== "" ) {
		word = word.slice( 0, -suf6.length );
	}  else if ( suf7 !== "" ) {
		word = word.slice( 0, -suf7.length );
	}  else if ( suf8 !== "" ) {
		word = word.slice( 0, -suf8.length );
	} else if ( word.endsWith( "eiras" ) || word.endsWith( "eira" ) ) {
		if ( suf9 !== "" ) {
			word = word.slice( 0, -suf9.length ) + "ir";
		}
	}
	return word;
};

/**
 * Stems verb suffixes.
 *
 * @param {string}  word                The original word.
 * @param {string}  rvText              The text of the RV.
 *
 * @returns {string} The word with the verb suffixes removed (if applicable).
 */
const stemVerbSuffixes = function( word, rvText ) {
	const suf10 = findMatchingEndingInArray( rvText, [ "aríamos", "ássemos", "eríamos", "êssemos", "iríamos", "íssemos",

		"áramos", "aremos", "aríeis", "ásseis", "ávamos", "éramos", "eremos",
		"eríeis", "ésseis", "íramos", "iremos", "iríeis", "ísseis",

		"ara~o", "ardes", "areis", "áreis", "ariam", "arias", "armos", "assem",
		"asses", "astes", "áveis", "era~o", "erdes", "ereis", "éreis", "eriam",
		"erias", "ermos", "essem", "esses", "estes", "íamos", "ira~o", "irdes",
		"ireis", "íreis", "iriam", "irias", "irmos", "issem", "isses", "istes",

		"adas", "ados", "amos", "ámos", "ando", "aram", "aras", "arás", "arei",
		"arem", "ares", "aria", "asse", "aste", "avam", "avas", "emos", "endo",
		"eram", "eras", "erás", "erei", "erem", "eres", "eria", "esse", "este",
		"idas", "idos", "íeis", "imos", "indo", "iram", "iras", "irás", "irei",
		"irem", "ires", "iria", "isse", "iste",

		"ada", "ado", "ais", "ara", "ará", "ava", "eis", "era", "erá", "iam",
		"ias", "ida", "ido", "ira", "irá",

		"am", "ar", "as", "ei", "em", "er", "es", "eu", "ia", "ir", "is", "iu", "ou" ] );

	if ( suf10 !== "" ) {
		word = word.slice( 0, -suf10.length );
	}
	return word;
};

/**
 * Stems residual suffixes.
 *
 * @param {string}	word	The word to check.
 * @param {string}	rvText	The text in the RV region.
 *
 * @returns {string} The word with a removed suffix, or the original input word if no suffix was removed.
 */
const stemResidualSuffixes = function( word, rvText ) {
	const suf12 = findMatchingEndingInArray( rvText, [ "ue", "ué", "uê" ] );
	const suf13 = findMatchingEndingInArray( rvText, [ "ie", "ié", "iê" ] );
	const suf14 = findMatchingEndingInArray( rvText, [ "e", "é", "ê" ] );

	if ( ( word.endsWith( "gue" ) || word.endsWith( "gué" ) || word.endsWith( "guê" ) ) && ( suf12 !== "" ) ) {
		word = word.slice( 0, -suf12.length );
	} else if ( ( word.endsWith( "cie" ) || word.endsWith( "cié" ) || word.endsWith( "ciê" ) ) && ( suf13 !== "" ) ) {
		word = word.slice( 0, -suf13.length );
	} else if ( suf14 !== "" ) {
		word = word.slice( 0, -suf14.length );
	} else if ( word.endsWith( "ç" ) ) {
		word = word.replace( /ç$/, "c" );
	}

	return word;
};

/**
 * Stems Portuguese words.
 *
 * @param {string} word   The word to stem.
 *
 * @returns {string} The stemmed word.
 */
export default function stem( word ) {
	word.toLowerCase();

	// Nasal vowels should be treated as a vowel followed by a consonant.
	const nasalVowels = [ "ã", "õ" ];
	const nasalVowelsReplacement = [ "a~", "o~" ];
	word = replaceCharacters( word, nasalVowels, nasalVowelsReplacement  );

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
		if ( isVowel( word[ i ] ) && ! isVowel( word[ i + 1 ] ) ) {
			r1 = i + 2;
		}
	}

	/*
	 * R2 is the region after the first non-vowel following a vowel in R1, or is the null region at the end of the
	 * word if there is no such non-vowel.
	 */
	for ( let i = r1; i < ( length - 1 ) && r2 === length; i++ ) {
		if ( isVowel( word[ i ] ) && ! isVowel( word[ i + 1 ] ) ) {
			r2 = i + 2;
		}
	}

	/*
	 * If the second letter is a consonant, RV is the region after the next following vowel. If the first two letters are
	 * vowels, RV is the region after the next consonant, and otherwise (consonant-vowel case) RV is the region after the
	 * third letter. But RV is the end of the word if these positions cannot be found.
	 */
	if ( length > 3 ) {
		if ( ! isVowel( word[ 1 ] ) ) {
			rv = nextVowelPosition( word, 2 ) + 1;
		} else if ( isVowel( word[ 0 ] ) && isVowel( word[ 1 ] ) ) {
			rv = nextConsonantPosition( word, 2 ) + 1;
		} else {
			rv = 3;
		}
	}

	const r1Text = word.slice( r1 );
	const r2Text = word.slice( r2 );
	let rvText = word.slice( rv );

	// Go through the first step of removing suffixes.
	const wordAfterStep1 = stemStandardSuffixes( word, r1Text, r2Text, rvText  );

	// If no suffixes were removed in the first step, search for an remove verb suffixes.
	let wordAfterStep2 = "";

	if ( word === wordAfterStep1 ) {
		wordAfterStep2 = stemVerbSuffixes( word, rvText );
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
		if ( word.endsWith( "ci" ) && rvText.endsWith( "i" ) ) {
			word = word.slice( 0, -1 );
			rvText = word.slice( rv );
		}
	} else {
		const suf11 = findMatchingEndingInArray( rvText, [ "os", "a", "i", "o", "á", "í", "ó" ] );
		if ( suf11 !== "" ) {
			word = word.slice( 0, -suf11.length );
			rvText = word.slice( rv );
		}
	}

	// Stem residual suffixes, regardless of whether a suffix was removed in any of the previous steps or not.
	word = stemResidualSuffixes( word, rvText );

	// Change the nasal vowel replacements back into the nasal vowels.
	word = replaceCharacters( word, nasalVowelsReplacement, nasalVowels );

	return word;
}
