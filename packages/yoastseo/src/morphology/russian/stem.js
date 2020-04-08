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
 * @returns {int[]} The array of RV and R2.
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
 * @param {string|string[]} regex	The regex or an array of regexes to match.
 * @param {int}             region	The word region
 *
 * @returns {boolean}	Whether the word ends in one of the endings or not.
 */
const removeEndings = function( word, regex, region ) {
	const prefix = word.substr( 0, region );
	const ending = word.substr( prefix.length );

	if ( Array.isArray( regex ) ) {
		const currentRegex = new RegExp( "/.+[ая]" + regex[ 0 ] + "/ui" );
		if ( currentRegex.test( ending ) ) {
			word = prefix + ending.replace( currentRegex, "" );
			return true;
		}
	}

	const currentRegex = new RegExp( "/.+[ая]" + regex[ 1 ] + "/ui" );
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

	// Step 1: Найти окончание PERFECTIVE GERUND. Если оно существует – удалить его и завершить этот шаг.
	if ( ! removeEndings( word, [ regexPerfectiveGerunds1, regexPerfectiveGerunds2 ], rv ) ) {
		// Иначе, удаляем окончание REFLEXIVE (если оно существует).
		removeEndings( word, regexReflexives, rv );

		// Затем в следующем порядке пробуем удалить окончания: ADJECTIVAL, VERB, NOUN. Как только одно из них найдено – шаг завершается.
		if ( ! ( removeEndings( word, [ regexParticiple1 + regexAdjective, regexParticiple2 + regexAdjective ], rv ) ||
				 removeEndings( word, regexAdjective, rv ) ) ) {
			if ( ! removeEndings( word, [ regexVerb1, regexVerb2 ], rv ) ) {
				removeEndings( word, regexNoun, rv );
			}
		}
	}

	// Step 2: Если слово оканчивается на и – удаляем и.
	removeEndings( word, regexI, rv );

	// Step 3: Если в R2 найдется окончание DERIVATIONAL – удаляем его.
	removeEndings( word, regexDerivational, r2 );

	// Step 4: Возможен один из трех вариантов:
	// 1. Если слово оканчивается на нн – удаляем последнюю букву.
	if ( removeEndings( word, regexNN, rv ) ) {
		word += "н";
	}

	// 2. Если слово оканчивается на SUPERLATIVE – удаляем его и снова удаляем последнюю букву, если слово оканчивается на нн.
	removeEndings( word, regexSuperlative, rv );

	// 3. Если слово оканчивается на ь – удаляем его.
	removeEndings( word, regexSoftSign, rv );

	return word;
}
