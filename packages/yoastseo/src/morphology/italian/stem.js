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

const verbSuffixes = [
	"erebbero",
	"irebbero",
	"assero",
	"assimo",
	"eranno",
	"erebbe",
	"eremmo",
	"ereste",
	"eresti",
	"essero",
	"iranno",
	"irebbe",
	"iremmo",
	"ireste",
	"iresti",
	"iscano",
	"iscono",
	"issero",
	"arono",
	"avamo",
	"avano",
	"avate",
	"eremo",
	"erete",
	"erono",
	"evamo",
	"evano",
	"evate",
	"iremo",
	"irete",
	"irono",
	"ivamo",
	"ivano",
	"ivate",
	"ammo",
	"ando",
	"asse",
	"assi",
	"emmo",
	"enda",
	"ende",
	"endi",
	"endo",
	"erai",
	"Yamo",
	"iamo",
	"immo",
	"irai",
	"irei",
	"isca",
	"isce",
	"isci",
	"isco",
	"erei",
	"uti",
	"uto",
	"ita",
	"ite",
	"iti",
	"ito",
	"iva",
	"ivi",
	"ivo",
	"ono",
	"uta",
	"ute",
	"ano",
	"are",
	"ata",
	"ate",
	"ati",
	"ato",
	"ava",
	"avi",
	"avo",
	"erà",
	"ere",
	"erò",
	"ete",
	"eva",
	"evi",
	"evo",
	"irà",
	"ire",
	"irò",
	"ar",
	"ir" ];


function isVowel( letter ) {
	return ( letter === "a" || letter === "e" || letter === "i" || letter === "o" || letter === "u" || letter === "à" ||
		letter === "è" || letter === "ì" || letter === "ò" || letter === "ù" );
}

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

function getNextConsonantPos( word, start ) {
	const length = word.length;
	for ( let i = start; i < length; i++ ) {
		if ( ! isVowel( word[ i ] ) ) {
			return i;
		}
	}
	return length;
}


function endsin( word, suffix ) {
	if ( word.length < suffix.length ) {
		return false;
	}
	return ( word.slice( -suffix.length ) === suffix );
}

function endsinArr( word, suffixes ) {
	for ( let i = 0; i < suffixes.length; i++ ) {
		if ( endsin( word, suffixes[ i ] ) ) {
			return suffixes[ i ];
		}
	}
	return "";
}

function replaceAcute( word ) {
	let str = word.replace( /á/gi, "à" );
	str = str.replace( /é/gi, "è" );
	str = str.replace( /í/gi, "ì" );
	str = str.replace( /ó/gi, "ò" );
	str = str.replace( /ú/gi, "ù" );
	return str;
}

function vowelMarking( word ) {
	function replacer( match, p1, p2, p3 ) {
		return p1 + p2.toUpperCase() + p3;
	}

	return word.replace( /([aeiou])(i|u)([aeiou])/g, replacer );
}


// Perform full stemming algorithm on a single word.
export default function stem( word ) {
	word = word.toLowerCase();
	word = replaceAcute( word );
	word = word.replace( /qu/g, "qU" );
	word = vowelMarking( word );

	if ( word.length < 3 ) {
		return word;
	}

	let r1 = word.length;
	let r2 = word.length;
	let rv = word.length;
	const len = word.length;
	// R1 is the region after the first non-vowel following a vowel,
	for ( let i = 0; i < word.length - 1 && r1 === len; i++ ) {
		if ( isVowel( word[ i ] ) && ! isVowel( word[ i + 1 ] ) ) {
			r1 = i + 2;
		}
	}
	// Or is the null region at the end of the word if there is no such non-vowel.

	// R2 is the region after the first non-vowel following a vowel in R1
	for ( let i = r1; i < word.length - 1 && r2 === len; i++ ) {
		if ( isVowel( word[ i ] ) && ! isVowel( word[ i + 1 ] ) ) {
			r2 = i + 2;
		}
	}

	// Or is the null region at the end of the word if there is no such non-vowel.

	// If the second letter is a consonant, RV is the region after the next following vowel,

	// RV as follow

	if ( len > 3 ) {
		if ( ! isVowel( word[ 1 ] ) ) {
			// If the second letter is a consonant, RV is the region after the next following vowel
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

	let r1Text = word.substring( r1 );
	let r2Text = word.substring( r2 );
	let rvText = word.substring( rv );

	const originalWord = word;

	// Step 0: Attached pronoun

	const pronounSuffixes = new Array( "glieli", "glielo", "gliene", "gliela", "gliele", "sene", "tene", "cela", "cele", "celi", "celo", "cene", "vela", "vele", "veli", "velo", "vene", "mela", "mele", "meli", "melo", "mene", "tela", "tele", "teli", "telo", "gli", "ci", "la", "le", "li", "lo", "mi", "ne", "si", "ti", "vi" );
	const pronounSuffixesPre1 = new Array( "ando", "endo" );
	const pronounSuffixesPre2 = new Array( "ar", "er", "ir" );
	let suf = endsinArr( word, pronounSuffixes );

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

	if ( word !== originalWord ) {
		r1Text = word.substring( r1 );
		r2Text = word.substring( r2 );
		rvText = word.substring( rv );
	}

	const wordAfter0 = word;

	// Step 1:  Standard suffix removal

	const mixedSuffixes1 = [ "atrice", "atrici", "abile", "abili", "ibile", "ibili", "mente", "ante", "anti",
		"anza", "anze", "iche", "ichi", "ismo", "ismi", "ista", "iste", "isti", "istà",
		"istè", "istì", "ico", "ici", "ica", "ice", "oso", "osi", "osa", "ose" ];

	const mixedSuffixes2 = [ "icativa", "icativo", "icativi", "icative", "ativa",
		"ativo", "ativi", "ative", "iva", "ivo", "ivi", "ive" ];

	if ( ( suf = endsinArr( r2Text, [ "ativamente", "abilamente", "ivamente", "osamente", "icamente" ] ) ) !== "" ) {
		// Delete suffix.
		word = word.slice( 0, -suf.length );
	} else if ( ( suf = endsinArr( r2Text, [ "icazione", "icazioni", "icatore", "icatori", "azione", "azioni", "atore", "atori" ] ) ) !== "" ) {
		// Delete suffix.
		word = word.slice( 0, -suf.length );
	} else if ( ( suf = endsinArr( r2Text, [ "logia", "logie" ] ) ) !== "" ) {
		// Replace with log.
		word = word.slice( 0, -suf.length ) + "log";
	} else if ( ( suf = endsinArr( r2Text, [ "uzione", "uzioni", "usione", "usioni" ] ) ) !== "" ) {
		// Replace with u.
		word = word.slice( 0, -suf.length ) + "u";
	} else if ( ( suf = endsinArr( r2Text, [ "enza", "enze" ] ) ) !== "" ) {
		// Replace with ente.
		word = word.slice( 0, -suf.length ) + "ente";
	} else if ( ( suf = endsinArr( rvText, [ "amento", "amenti", "imento", "imenti" ] ) ) !== "" ) {
		// Delete suffix.
		word = word.slice( 0, -suf.length );
	} else if ( ( suf = endsinArr( r1Text, [ "amente" ] ) ) !== "" ) {
		// Delete suffix.
		word = word.slice( 0, -suf.length );
	} else if ( ( suf = endsinArr( r2Text, mixedSuffixes1 ) ) !== "" ) {
		// Delete suffix.
		word = word.slice( 0, -suf.length );
	} else if ( ( suf = endsinArr( r2Text, [ "abilità", "icità", "ività", "ità" ] ) ) !== "" ) {
		// Delete suffix.
		word = word.slice( 0, -suf.length );
	} else if ( ( suf = endsinArr( r2Text, mixedSuffixes2 ) ) !== "" ) {
		word = word.slice( 0, -suf.length );
	}


	if ( word !== wordAfter0 ) {
		r1Text = word.substring( r1 );
		r2Text = word.substring( r2 );
		rvText = word.substring( rv );
	}


	const wordAfter1 = word;

	// Step 2:  Verb suffixes

	if ( wordAfter0 === wordAfter1 ) {
		if ( ( suf = endsinArr( rvText, verbSuffixes ) ) !== "" ) {
			word = word.slice( 0, -suf.length );
		}
	}


	r1Text = word.substring( r1 );
	r2Text = word.substring( r2 );
	rvText = word.substring( rv );

	// Always do step 3.

	if ( ( suf = endsinArr( rvText, [ "ia", "ie", "ii", "io", "ià", "iè", "iì", "iò", "a", "e", "i", "o", "à", "è", "ì", "ò" ] ) ) !== "" ) {
		word = word.slice( 0, -suf.length );
	}

	r1Text = word.substring( r1 );
	r2Text = word.substring( r2 );
	rvText = word.substring( rv );

	if ( ( suf = endsinArr( rvText, [ "ch" ] ) ) !== "" ) {
		// Replace with c.
		word = word.slice( 0, -suf.length ) + "c";
	} else if ( ( suf = endsinArr( rvText, [ "gh" ] ) ) !== "" ) {
		// Replace with g.
		word = word.slice( 0, -suf.length ) + "g";
	}


	r1Text = word.substring( r1 );
	r2Text = word.substring( r2 );
	rvText = word.substring( rv );

	return word.toLowerCase();
}
