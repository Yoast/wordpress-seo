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

/**
 * Stems Portuguese words.
 *
 * @param {string} word            The word to stem.
 *
 * @returns {string} The stemmed word.
 */

const isVowel = function( c ) {
	const regex = /[aeiouáéíóú]/gi;

	return regex.test( c );
};

const nextVowelPosition = function( word, start = 0 ) {
	const length = word.length;

	for ( let position = start; position < length; position++ ) {
		if ( isVowel( word[ position ] ) ) {
			return position;
		}
	}

	return length;
};

const nextConsonantPosition = function( word, start = 0 ) {
	const length = word.length;

	for ( let position = start; position < length; position++ ) {
		if ( ! isVowel( word[ position ] ) ) {
			return position;
		}
	}

	return length;
};

const endsIn = function( word, suffix ) {
	if ( word.length < suffix.length ) {
		return false;
	}

	return ( word.slice( -suffix.length ) === suffix );
};

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

const removeAccent = function( word ) {
	const accentedVowels = [ "á", "é", "í", "ó", "ú", "â", "ê", "ô", "ã", "õ" ];
	const vowels = [ "a", "e", "i", "o", "u", "a", "e", "o", "a", "o" ];

	for ( let i = 0; i < accentedVowels.length; i++ ) {
		word = word.replace( accentedVowels[ i ], vowels[ i ] );
	}

	return word;
};

export default function stem( word ) {
	word.toLowerCase();

	const length = word.length;
	if (length < 2) {
		return removeAccent( word );
	}

	let r1 = length;
	let r2 = length;
	let rv = length;

	/**
	 * R1 is the region after the first non-vowel following a vowel, or is the null region at the end of the word if
	 * there is no such non-vowel.
	 */
	for (let i = 0; i < ( length - 1 ) && r1 === length; i++) {
		if (isVowel( word[i] ) && !isVowel( word[i + 1] )) {
			r1 = i + 2;
		}
	}

	/**
	 * R2 is the region after the first non-vowel following a vowel in R1, or is the null region at the end of the
	 * word if there is no such non-vowel.
	 */
	for (let i = r1; i < ( length - 1 ) && r2 === length; i++) {
		if (isVowel( word[i] ) && !isVowel( word[i + 1] )) {
			r2 = i + 2;
		}
	}

	if (length > 3) {
		if (!isVowel( word[1] )) {
			rv = nextVowelPosition( word, 2 ) + 1;
		} else if (isVowel( word[0] ) && isVowel( word[1] )) {
			rv = nextConsonantPosition( word, 2 ) + 1;
		} else {
			rv = 3;
		}
	}

	let r1Text = word.slice( r1 );
	let r2Text = word.slice( r2 );
	let rvText = word.slice( rv );
	const originalWord = word;
}



