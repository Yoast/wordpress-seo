/**
 *  MIT License
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
const REGEX_PERFECTIVE_GERUNDS1 = '(в|вши|вшись)$';
const REGEX_PERFECTIVE_GERUNDS2 = '(ив|ивши|ившись|ыв|ывши|ывшись)$';
const REGEX_ADJECTIVE = '(ее|ие|ые|ое|ими|ыми|ей|ий|ый|ой|ем|им|ым|ом|его|ого|ему|ому|их|ых|ую|юю|ая|яя|ою|ею)$';
const REGEX_PARTICIPLE1 = '(ем|нн|вш|ющ|щ)';
const REGEX_PARTICIPLE2 = '(ивш|ывш|ующ)';
const REGEX_REFLEXIVES = '(ся|сь)$';
const REGEX_VERB1 = '(ла|на|ете|йте|ли|й|л|ем|н|ло|но|ет|ют|ны|ть|ешь|нно)$';
const REGEX_VERB2 = '(ила|ыла|ена|ейте|уйте|ите|или|ыли|ей|уй|ил|ыл|им|ым|ен|ило|ыло|ено|ят|ует|уют|ит|ыт|ены|ить|ыть|ишь|ую|ю)$';
const REGEX_NOUN = '(а|ев|ов|ие|ье|е|ьё|иями|ями|ами|еи|ии|и|ией|ей|ой|ий|й|иям|ям|ием|ем|ам|ом|о|у|ах|иях|ях|ы|ь|ию|ью|ю|ия|ья|я)$';
const REGEX_SUPERLATIVE = '(ейш|ейше)$';
const REGEX_DERIVATIONAL = '(ост|ость)$';
const REGEX_I = 'и$';
const REGEX_NN = 'нн$';
const REGEX_SOFT_SIGN = 'ь$';

/**
 * @param string char
 *
 * @return boolean
 */
const isVowel = function ( char )
{
	return vowels.includes( char );
};

/**
 * @param string word
 *
 * @return int[]
 */
const findRegions = function( word ) {
	let rv = 0;
	let state = 0;
	const wordLength = word.length;

	for ( let i = 1; i < wordLength; i++) {
		const prevChar = word.substring( i - 1, i );
		const char = word.substring( i, i + 1 );
		switch (state) {
			case 0:
				if (isVowel(char)) {
					rv = i + 1;
					state = 1;
				}
				break;
			case 1:
				if (isVowel(prevChar) && isVowel(char)) {
					state = 2;
				}
				break;
			case 2:
				if (isVowel(prevChar) && isVowel(char)) {
					return [rv, i + 1];
				}
				break;
		}
	}

	return [rv, 0];
};

/**
 * @param string          word
 * @param string|string[] regex
 * @param int             region
 *
 * @return boolean
 */
const removeEndings = function(word, regex, region) {
	const prefix = word.substr(0, region );
	const ending = word.substr( prefix.length );

	if ( Array.isArray( regex ) ) {
		const currentRegex = '/.+[ая]' + regex[0] + '/ui';
		if ( currentRegex.test ( ending ) ) {
			word = prefix + ending.replace( currentRegex, '' );
			return true;
		}
	}

	const currentRegex = '/.+[ая]' + regex[ 1 ] + '/ui';
	if ( currentRegex.test ( ending ) ) {
		word = prefix + ending.replace( currentRegex, '' );
		return true;
	}

	return false;
};

/**
 * @param string word
 *
 * @return string
 */
export default function stem( word) {
	[ rv, r2 ] = findRegions( word );

	// Step 1: Найти окончание PERFECTIVE GERUND. Если оно существует – удалить его и завершить этот шаг.
	if ( ! removeEndings( word, [ REGEX_PERFECTIVE_GERUNDS1, REGEX_PERFECTIVE_GERUNDS2], rv ) ) {
		// Иначе, удаляем окончание REFLEXIVE (если оно существует).
		removeEndings( word, REGEX_REFLEXIVES, rv );

		// Затем в следующем порядке пробуем удалить окончания: ADJECTIVAL, VERB, NOUN. Как только одно из них найдено – шаг завершается.
		if ( ! ( removeEndings( word, [ REGEX_PARTICIPLE1 + REGEX_ADJECTIVE, REGEX_PARTICIPLE2 + REGEX_ADJECTIVE ], rv ) ||
				removeEndings( word, REGEX_ADJECTIVE, rv ) )
		) {
			if ( ! removeEndings( word, [ REGEX_VERB1, REGEX_VERB2 ], rv ) ) {
				removeEndings( word, REGEX_NOUN, rv );
			}
		}
	}

	// Step 2: Если слово оканчивается на и – удаляем и.
	removeEndings( word, REGEX_I, rv );

	// Step 3: Если в R2 найдется окончание DERIVATIONAL – удаляем его.
	removeEndings( word, REGEX_DERIVATIONAL, r2 );

	// Step 4: Возможен один из трех вариантов:
	// 1. Если слово оканчивается на нн – удаляем последнюю букву.
	if ( removeEndings( word, REGEX_NN, rv ) ) {
		word += 'н';
	}

	// 2. Если слово оканчивается на SUPERLATIVE – удаляем его и снова удаляем последнюю букву, если слово оканчивается на нн.
	removeEndings( word, REGEX_SUPERLATIVE, rv);

	// 3. Если слово оканчивается на ь – удаляем его.
	removeEndings( word, REGEX_SOFT_SIGN, rv);

	return word;
};
