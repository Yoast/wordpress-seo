/* eslint-disable complexity */
/*
Copyright (c) 2012, Leonardo Fenu, Chris Umbel
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
 * Determines whether a letter is a vowel.
 *
 * @param {string} letter                  The letter that has to be checked.
 *
 * @returns {boolean}                      True if the letter is a vowel.
 */
function isVowel( letter ) {
	return [ "a", "e", "i", "o", "u", "à", "è", "ì", "ò", "ù" ].includes( letter );
}

/**
 * Determines the next position in a word that is a vowel.
 *
 * @param {string}   word           The word to be checked.
 * @param {number}   start          The position of the word where you start checking.
 *
 * @returns {number}                 The next position in a word that is a vowel, or the final position if no vowel is found.
 */
function getNextVowelPos( word, start ) {
	start = start + 1;
	const length = word.length;

	for ( let i = start; i < length; i++ ) {
		if ( isVowel( word[ i ] ) ) {
			return i;
		}
	}

	return length;
}

/**
 * Determines the next position in a word that is a consonant.
 *
 * @param {string}   word           The word that has to be checked.
 * @param {number}   start          The position of the word where you start checking.
 *
 * @returns {number}                The next position in a word that is a consonant, or the final position if no consonant is found.
 */
function getNextConsonantPos( word, start ) {
	const length = word.length;

	for ( let i = start; i < length; i++ ) {
		if ( ! isVowel( word[ i ] ) ) {
			return i;
		}
	}

	return length;
}

/**
 * Checks whether a word ends in a suffix and if so it returns the suffix.
 *
 * @param {string}       word           The word that has to be checked.
 * @param {string[]}     suffixes       The suffixes that have to be checked.
 *
 * @returns {string}                    The suffix that the word ends in or an empty string if the word does not end in any of the suffixes.
 */
function endsinArr( word, suffixes ) {
	for ( let i = 0; i < suffixes.length; i++ ) {
		if ( word.endsWith( suffixes[ i ] ) ) {
			return suffixes[ i ];
		}
	}

	return "";
}

/**
 * Turns acute accents into grave ones.
 *
 * @param   {string}       word              The word that has to be checked.
 *
 * @returns {string}                         The word with acute accents replaced by grave ones.
 */
function replaceAcute( word ) {
	word = word.replace( /á/gi, "à" );
	word = word.replace( /é/gi, "è" );
	word = word.replace( /í/gi, "ì" );
	word = word.replace( /ó/gi, "ò" );
	word = word.replace( /ú/gi, "ù" );
	return word;
}

/**
 * Turns an i or u in between vowels into upper case.
 *
 * @param   {string}       word              The word that has to be checked.
 *
 *  @returns {string}                        The word with either i or u turned into upper case.
 */
function vowelMarking( word ) {
	return word.replace(
		/([aeiou])(i|u)([aeiou])/g,
		( match, p1, p2, p3 ) => p1 + p2.toUpperCase() + p3
	);
}

/**
 * Pre-process the word for stemming by setting it to lower case and replacing some letters.
 *
 * @param {string}  word    The word to pre-process.
 *
 * @returns {string} The pre-processed word.
 */
function preProcess( word ) {
	word = word.toLowerCase();
	word = replaceAcute( word );
	word = word.replace( /qu/g, "qU" );
	word = vowelMarking( word );

	return word;
}

/**
 * Determines R1, R2 and RV in the word.
 *
 * @param   {string}       word                         The word for which Rs have to be determined.
 *
 * @returns {{r2: number, rv: number, r1: number}}     R1, R2 and RV in the word.
 */
const determineRs = function( word ) {
	let r1 = word.length;
	let r2 = word.length;
	let rv = word.length;

	// R1 is the region after the first non-vowel following a vowel,
	for ( let i = 0; i < word.length - 1 && r1 === word.length; i++ ) {
		if ( isVowel( word[ i ] ) && ! isVowel( word[ i + 1 ] ) ) {
			r1 = i + 2;
		}
	}

	// R2 is the region after the first non-vowel following a vowel in R1
	for ( let i = r1; i < word.length - 1 && r2 === word.length; i++ ) {
		if ( isVowel( word[ i ] ) && ! isVowel( word[ i + 1 ] ) ) {
			r2 = i + 2;
		}
	}

	if ( word.length > 3 ) {
		if ( ! isVowel( word[ 1 ] ) ) {
			// If the second letter is a consonant, RV is the region after the next following vowel.
			rv = getNextVowelPos( word, 1 ) + 1;
		} else if ( isVowel( word[ 0 ] ) && isVowel( word[ 1 ] ) ) {
			// Or if the first two letters are vowels, RV is the region after the next consonant.
			rv = getNextConsonantPos( word, 2 ) + 1;
		} else {
			/*
			 * Otherwise (consonant-vowel case) RV is the region after the third letter.
			 * But RV is the end of the word if these positions cannot be found.
			 */
			rv = 3;
		}
	}

	return { r1, r2, rv };
};

/**
 * Removes pronoun suffixes.
 *
 * @param   {string}       word                         The word from which suffixes have to be removed.
 * @param   {string}       rvText                       The content of the RV.
 * @returns {string}                                    The word without pronoun suffixes.
 */
const removePronounSuffixes = function( word, rvText ) {
	const pronounSuffixes = [ "glieli", "glielo", "gliene", "gliela", "gliele", "sene", "tene", "cela", "cele", "celi", "celo",
		"cene", "vela", "vele", "veli", "velo", "vene", "mela", "mele", "meli", "melo", "mene", "tela", "tele", "teli",
		"telo", "gli", "ci", "la", "le", "li", "lo", "mi", "ne", "si", "ti", "vi" ];
	const pronounSuffixesPre1 = [ "ando", "endo" ];
	const pronounSuffixesPre2 = [ "ar", "er", "ir" ];
	const suf = endsinArr( word, pronounSuffixes );

	if ( suf !== "" ) {
		const foundSuffixPre1 = endsinArr( rvText.slice( 0, -suf.length ), pronounSuffixesPre1 );
		const foundSuffixPre2 = endsinArr( rvText.slice( 0, -suf.length ), pronounSuffixesPre2 );

		if ( foundSuffixPre1 !== "" ) {
			word = word.slice( 0, -suf.length );
		}
		if ( foundSuffixPre2 !== "" ) {
			word = word.slice( 0, -suf.length ) + "e";
		}
	}
	return word;
};

/**
 * A group of standard suffixes, the word region in which they might occur and an optional replacement value.
 *
 * @param {string[]}    suffixes            The suffixes.
 * @param {string}      region              The word region in which the suffixes should be searched.
 * @param {string}      [replacement=""]    The optional replacement value.
 *
 * @constructor
 */
function StandardSuffixGroup( suffixes, region, replacement = "" ) {
	this.suffixes = suffixes;
	this.region = region;
	this.replacement = replacement;
}

/**
 * Removes standard suffixes.
 *
 * @param   {string}       word                         The word from which standard suffixes have to be removed.
 * @param   {string}       r2Text                       The content of the R2.
 * @param   {string}       r1Text                       The content of the R1.
 * @param   {string}       rvText                       The content of the RV.
 *
 * @returns {string}                                    The word without standard suffixes.
 */
const removeStandardSuffixes = function( word, r2Text, r1Text, rvText ) {
	const suffixGroups = [
		new StandardSuffixGroup( [ "ativamente", "abilamente", "ivamente", "osamente", "icamente" ], r2Text ),
		new StandardSuffixGroup( [ "icazione", "icazioni", "icatore", "icatori", "azione", "azioni", "atore", "atori" ], r2Text ),
		new StandardSuffixGroup( [ "logia", "logie" ], r2Text, "log" ),
		new StandardSuffixGroup( [ "uzione", "uzioni", "usione", "usioni" ], r2Text, "u" ),
		new StandardSuffixGroup( [ "enza", "enze" ], r2Text, "ente" ),
		new StandardSuffixGroup( [ "amento", "amenti", "imento", "imenti" ], rvText ),
		new StandardSuffixGroup( [ "amente" ], r1Text ),
		new StandardSuffixGroup( [ "atrice", "atrici", "abile", "abili", "ibile", "ibili", "mente", "ante", "anti",
			"anza", "anze", "iche", "ichi", "ismo", "ismi", "ista", "iste", "isti", "istà",
			"istè", "istì", "ico", "ici", "ica", "ice", "oso", "osi", "osa", "ose" ], r2Text ),
		new StandardSuffixGroup( [ "abilità", "icità", "ività", "ità" ], r2Text ),
		new StandardSuffixGroup( [ "icativa", "icativo", "icativi", "icative", "ativa",
			"ativo", "ativi", "ative", "iva", "ivo", "ivi", "ive" ], r2Text ),
	];

	for ( const suffixGroup of suffixGroups ) {
		const foundSuffix = endsinArr( suffixGroup.region, suffixGroup.suffixes );

		if ( foundSuffix ) {
			return word.slice( 0, -foundSuffix.length ) + suffixGroup.replacement;
		}
	}

	return word;
};

/**
 *  Removes verb suffixes.
 *
 * @param   {string}       word                         The word from which verb suffixes have to be removed.
 * @param   {string}       rvText                       The content of the RV.
 *
 * @returns {string}                                    The word without verb suffixes.
 */
const removeVerbSuffixes = function( word, rvText ) {
	const verbSuffixes = [ "erebbero", "irebbero", "assero", "assimo", "eranno", "erebbe", "eremmo", "ereste", "eresti", "essero", "iranno", "irebbe",
		"iremmo", "ireste", "iresti", "iscano", "iscono", "issero", "arono", "avamo", "avano", "avate", "eremo", "erete", "erono", "evamo",
		"evano", "evate", "iremo", "irete", "irono", "ivamo", "ivano", "ivate", "ammo", "ando", "asse", "assi", "emmo", "enda", "ende",
		"endi", "endo", "erai", "Yamo", "iamo", "immo", "irai", "irei", "isca", "isce", "isci", "isco", "erei", "uti", "uto", "ita",
		"ite", "iti", "ito", "iva", "ivi", "ivo", "ono", "uta", "ute", "ano", "are", "ata", "ate", "ati", "ato", "ava", "avi", "avo",
		"erà", "ere", "erò", "ete", "eva", "evi", "evo", "irà", "ire", "irò", "ar", "ir", "ai" ];

	const foundSuffix  = endsinArr( rvText, verbSuffixes );

	if ( foundSuffix ) {
		word = word.slice( 0, -foundSuffix.length );
	}

	return word;
};

/**
 * Stems Italian words.
 *
 * @param {string} word            The word to stem.
 *
 * @returns {string}               The stemmed word.
 */
export default function stem( word ) {
	word = preProcess( word );

	// Don't stem words that consist of less than 3 letters.
	if ( word.length < 3 ) {
		return word;
	}

	// Determines r1 ,r2, rv.
	const { r1, r2, rv } = determineRs( word );

	// Determiners the content of r1, r2, and rv.
	let r1Text = word.substring( r1 );
	let r2Text = word.substring( r2 );
	let rvText = word.substring( rv );

	const originalWord = word;

	// Step 0: Attached pronoun removal.
	word = removePronounSuffixes( word, rvText );

	if ( word !== originalWord ) {
		r1Text = word.substring( r1 );
		r2Text = word.substring( r2 );
		rvText = word.substring( rv );
	}

	const wordAfter0 = word;

	// Step 1:  Standard suffix removal.
	word = removeStandardSuffixes( word, r2Text, r1Text, rvText );

	if ( word !== wordAfter0 ) {
		rvText = word.substring( rv );
	}

	const wordAfter1 = word;

	// Step 2:  Verb suffix removal.
	if ( wordAfter0 === wordAfter1 ) {
		word = removeVerbSuffixes( word, rvText );
	 }

	rvText = word.substring( rv );

	// Always do step 3.
	let foundSuffix = "";

	if ( ( foundSuffix = endsinArr( rvText, [ "ia", "ie", "ii", "io", "ià", "iè", "iì", "iò", "a", "e", "i", "o", "à", "è", "ì", "ò" ] ) ) !== "" ) {
		word = word.slice( 0, -foundSuffix.length );
	}

	rvText = word.substring( rv );

	if ( ( foundSuffix = endsinArr( rvText, [ "ch" ] ) ) !== "" ) {
		// Replace with c.
		word = word.slice( 0, -foundSuffix.length ) + "c";
	} else if ( ( foundSuffix = endsinArr( rvText, [ "gh" ] ) ) !== "" ) {
		// Replace with g.
		word = word.slice( 0, -foundSuffix.length ) + "g";
	}

	return word.toLowerCase();
}
