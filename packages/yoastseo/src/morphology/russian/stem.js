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
 */

const vowels = [ "а", "е", "ё", "и", "о", "у", "ы", "э", "ю", "я" ];
const regexPerfectiveGerunds1 = "(в|вши|вшись)$";
const regexPerfectiveGerunds2 = "(ив|ивши|ившись|ыв|ывши|ывшись)$";
const regexAdjective = "(ее|ие|ые|ое|ими|ыми|ей|ий|ый|ой|ем|им|ым|ом|его|ого|ему|ому|их|ых|ую|юю|ая|яя|ою|ею)$";
const regexParticiple1 = "(ем|нн|вш|ющ|щ)";
const regexParticiple2 = "(ивш|ывш|ующ)";
const regexReflexives = "(ся|сь)$";
const regexVerb1 = "(ла|на|ете|йте|ли|й|л|ем|н|ло|но|ет|ют|ны|ть|ешь|нно)$";
const regexVerb2 = "(ила|ыла|ена|ейте|уйте|ите|или|ыли|ей|уй|ил|ыл|им|ым|ен|ило|ыло|ено|ят|ует|уют|ит|ыт|ены|ить|ыть|ишь|ую|ю)$";
const regexNoun = "(а|ев|ов|ие|ье|е|ьё|иями|ями|ами|еи|ии|и|ией|ей|ой|ий|й|иям|ям|ием|ем|ам|ом|о|у|ах|иях|ях|ы|ь|ию|ью|ю|ия|ья|я)$";
const regexSuperlative = "(ейш|ейше)$";
const regexDerivational = "(ост|ость)$";
const regexI = "и$";
const regexNN = "нн$";
const regexSoftSign = "ь$";

/**
 * Checks if the input character is a russian vowel.
 *
 * @param {string} char The character to be checked.
 *
 * @returns {boolean} Whether the input character is a russian vowel.
 */
const isVowel = function( char ) {
	return vowels.includes( char );
};

/**
 * Determines the region of the word.
 *
 * @param {string} word	The word checked.
 *
 * @returns {int[]} The array of R1 and RV.
 */
const findRegions = function( word ) {
	let rv = 0;
	let state = 0;
	const wordLength = word.length;

	for ( let i = 1; i < wordLength; i++ ) {
		const prevChar = word.substring( i - 1, i );
		const char = word.substring( i, i + 1 );
		switch ( state ) {
			case 0:
				if ( isVowel( char ) ) {
					rv = i + 1;
					state = 1;
				}
				break;
			case 1:
				if ( isVowel( prevChar ) && isVowel( char ) ) {
					state = 2;
				}
				break;
			case 2:
				if ( isVowel( prevChar ) && isVowel( char ) ) {
					return [ rv, i + 1 ];
				}
				break;
		}
	}

	return [ rv, 0 ];
};

/**
 * Removes the endings from the word.
 *
 * @param {string}          word	The word to check.
 * @param {string|string[]} regex	The regex or a pair of regexes to match.
 * @param {int}             region	The word region
 *
 * @returns {boolean}	Whether the word ends in one of the endings or not.
 */
const removeEndings = function( word, regex, region ) {
	const prefix = word.substr( 0, region );
	const ending = word.substr( prefix.length );

	let currentRegex;

	if ( Array.isArray( regex ) ) {
		currentRegex = new RegExp( "/.+[ая]" + regex[ 0 ] + "/ui" );
		if ( currentRegex.test( ending ) ) {
			word = prefix + ending.replace( currentRegex, "" );
			return true;
		}
	}

	currentRegex = new RegExp( "/.+[ая]" + regex[ 1 ] + "/ui" );
	if ( currentRegex.test( ending ) ) {
		word = prefix + ending.replace( currentRegex, "" );
		return true;
	}

	return false;
};

/**
 * Stems russian words.
 *
 * @param {string} word	The word to stem.
 *
 * @returns {string}	The stemmed word.
 */
export default function stem( word ) {
	const [ rv, r2 ] = findRegions( word );

	// Step 1: Try to find a PERFECTIVE GERUND ending. If it exists, remove it and finalize the step.
	if ( ! removeEndings( word, [ regexPerfectiveGerunds1, regexPerfectiveGerunds2 ], rv ) ) {
		// If there is no PERFECTIVE GERUND ending than try removing a REFLEXIVE ending.
		removeEndings( word, regexReflexives, rv );

		// Try to remove following endings (in this order): ADJECTIVAL, VERB, NOUN. If one of them is found the stem is finalized.
		if ( ! (
			removeEndings( word, [ regexParticiple1 + regexAdjective, regexParticiple2 + regexAdjective ], rv ) ||
			removeEndings( word, regexAdjective, rv )
		) ) {
			if ( ! removeEndings( word, [ regexVerb1, regexVerb2 ], rv ) ) {
				removeEndings( word, regexNoun, rv );
			}
		}
	}

	// Step 2: If the word ends in "и", remove it.
	removeEndings( word, regexI, rv );

	// Step 3: If the R2 ends in a DERIVATIONAL ending, remove it.
	removeEndings( word, regexDerivational, r2 );

	// Step 4: There can be one of three options:
	// 1. If the word ends in нн, remove the last letter.
	if ( removeEndings( word, regexNN, rv ) ) {
		word += "н";
	}

	// 2. If the word ends in a SUPERLATIVE ending, remove it and then again the last letter if the word ends in "нн".
	removeEndings( word, regexSuperlative, rv );

	// 3. If the word ends in "ь", remove it.
	removeEndings( word, regexSoftSign, rv );

	return word;
}
