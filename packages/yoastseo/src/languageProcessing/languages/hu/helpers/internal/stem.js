/*
 * Copyright (c) 2001, Dr Martin Porter,
 * Copyright (c) 2002, Richard Boulton.
 *
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided
 * that the following conditions are met:
 * 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products
 * derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 * IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
 * OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * Checks if the input character is a Hungarian vowel.
 *
 * @param {Object} morphologyData   The Hungarian morphology data.
 * @param {string} word             The word to check
 * @returns {number} Whether the input character is a Hungarian vowel.
 */
const isVowel = function( morphologyData, word ) {
	const vowels = morphologyData.externalStemmer.vowels;
	const regex = new RegExp( vowels );
	return word.search( regex );
};

/**
 * Defines consonants or digraphs position.
 *
 * @param {Object} morphologyData   Morphology data file
 * @param {string} word             The word to check
 * @returns {number} the position of the digraph or consonant
 */
const consonantOrDigraphPosition = function( morphologyData, word ) {
	const digraphRegex = new RegExp( morphologyData.externalStemmer.digraphs );
	const consonantRegex = new RegExp( morphologyData.externalStemmer.consonants );
	const digraphPosition = word.search( digraphRegex );
	const consonantPosition = word.search( consonantRegex );
	if ( digraphPosition === consonantPosition ) {
		return digraphPosition + 1;
	}
	return consonantPosition;
};

/**
 * Defines the R1 region: Checks if the word begins with a vowel: defines R1 as the region after the first consonant or diagraph
 * Checks if the word begins with a consonant: defines R1 as the region after the first vowel
 *
 * @param {Object} morphologyData   The Morphology data file
 * @param {string} word             The word to stem
 * @returns {number} The R1 region index.
 */
const findR1Position = function( morphologyData, word ) {
	const vowelPosition = isVowel( morphologyData, word );
	if ( vowelPosition === 0 ) {
		const consonantOrDigraph = consonantOrDigraphPosition( morphologyData, word );
		return ( consonantOrDigraph + 1 );
	}
	return ( vowelPosition + 1 );
};

/**
 * Searches on of the following noun case suffixes: al, el and stems the suffix if found in R1 and preceded by a double consonant
 * and removes one of the double consonants
 *
 * @param {string} word             The word to stem
 * @param {Object} morphologyData   The morphology data file with suffix list
 *
 * @returns {string}    The stemmed word.
 *
 */
const stemSuffixes1 = function( word, morphologyData ) {
	if ( word.length < 3 ) {
		return word;
	}
	const r1Position = findR1Position( morphologyData, word );
	const suffix = word.search( new RegExp( morphologyData.externalStemmer.suffixes1 ) );
	if ( suffix >= r1Position ) {
		let wordAfterStemming = word.slice( 0, -2 );

		const doubleConsonantRegex = new RegExp( morphologyData.externalStemmer.doubleConsonants );
		const checkIfWordEndsOnDoubleConsonant = wordAfterStemming.search( doubleConsonantRegex );
		if ( checkIfWordEndsOnDoubleConsonant !== -1 ) {
			wordAfterStemming = wordAfterStemming.slice( 0, -1 );
		}

		const tripleConsonantsRegex = new RegExp( morphologyData.externalStemmer.tripleDoubleConsonants );
		const checkIfWordEndsOnTripleDoubleConsonant = wordAfterStemming.search( tripleConsonantsRegex );
		if ( checkIfWordEndsOnTripleDoubleConsonant !== -1 ) {
			wordAfterStemming = wordAfterStemming.slice( 0, -2 ) + wordAfterStemming.charAt( wordAfterStemming.length - 1 );
		}

		if ( wordAfterStemming.length !== word.slice( 0, -2 ).length ) {
			return wordAfterStemming;
		}
	}
	return word;
};

/**
 * Searches for the longer of the following suffixes: ban   ben   ba   be   ra   re   nak   nek   val   vel   tól   tõl
 * ról   rõl   ból   bõl   hoz   hez   höz   nál   nél   ig   at   et   ot   öt   ért   képp   képpen   kor   ul   ül
 * vá   vé   onként   enként   anként   ként   en   on   an   ön   n   t and stems the suffix if found in R1
 * If the suffix is preceded by á replaces with a. If the suffix is preceded by é replaces with e
 *
 * @param {string} word             The word to stem
 * @param {string} suffixes2        The suffixes from group 2
 * @param {Object} morphologyData   The Morphology data file
 *
 * @returns {string}    The stemmed word
 */
const stemSuffixes2 = function( word, suffixes2, morphologyData ) {
	if ( word.length < 3 ) {
		return word;
	}
	const r1Position = findR1Position( morphologyData, word );
	const suffix2 = word.search( new RegExp( suffixes2 ) );
	if ( suffix2 >= r1Position ) {
		const wordAfterStemming = word.substring( 0, suffix2 );
		if ( wordAfterStemming.endsWith( "á" ) ) {
			return wordAfterStemming.replace( /á$/i, "a" );
		}
		if ( wordAfterStemming.endsWith( "é" ) ) {
			return wordAfterStemming.replace( /é$/i, "e" );
		}
		return wordAfterStemming;
	}
	return word;
};

/**
 * Searches for the longest among the following suffixes in R1: án   ánként and replace by a
 * Search for én in R1 and replace with e
 *
 * @param {string} word             The word to check for the suffix.
 * @param {string} suffixes3        The suffixes to check.
 * @param {Object} morphologyData   The Morphology data file
 *
 * @returns {string} The word without the suffix.
 */
const stemSuffixes3 = function( word, suffixes3, morphologyData ) {
	if ( word.length < 3 ) {
		return word;
	}
	const r1Position = findR1Position( morphologyData, word );
	const suffix3 = word.search( new RegExp( suffixes3 ) );
	if ( suffix3 >= r1Position ) {
		return ( word.substring( 0, suffix3 ) + "a" );
	}

	return word;
};

/**
 * Searches for the longest among following suffixes astul   estül   stul   stül in R1 and delete.
 *
 * @param {string} word             The word to check for the suffix.
 * @param {string} suffixes4        The suffixes to check.
 * @param {Object} morphologyData   The Morphology data file
 *
 * @returns {string} The word without the suffix.
 */
const stemSuffixes4 = function( word, suffixes4, morphologyData ) {
	if ( word.length < 3 ) {
		return word;
	}
	const r1Position = findR1Position( morphologyData, word );
	const suffix4 = word.search( new RegExp( suffixes4 ) );
	if ( suffix4 >= r1Position ) {
		return ( word.substring( 0, suffix4 ) );
	}
	return word;
};

/**
 * Searches for one of the suffixes Search for one of the following suffixes: á   é and delete. If preceded by double
 * Consonant, remove one of the double consonants.
 *
 * @param {string} word             The word to check for the suffix.
 * @param {string} suffixes6        The suffixes to check.
 * @param {Object} morphologyData   The Morphology data file
 *
 * @returns {string} The word without the suffix.
 */
const stemSuffixes5 = function( word, suffixes6, morphologyData ) {
	if ( word.length < 3 ) {
		return word;
	}
	const r1Position = findR1Position( morphologyData, word );
	const suffix6 = word.search( new RegExp( suffixes6 ) );
	if ( suffix6 >= r1Position ) {
		let wordAfterStemming = word.slice( 0, -1 );
		const doubleConsonantRegex = new RegExp( morphologyData.externalStemmer.doubleConsonants );
		const checkIfWordEndsOnDoubleConsonant = wordAfterStemming.search( doubleConsonantRegex );
		if ( checkIfWordEndsOnDoubleConsonant !== -1 ) {
			wordAfterStemming = wordAfterStemming.slice( 0, -1 );
		}
		return wordAfterStemming;
	}
	return word;
};

/**
 * Searches for one of the suffixes in R1 and delete oké   öké   aké   eké   ké   éi   é.
 *
 * @param {string} word             The word to check for the suffix.
 * @param {string} suffixes6        The suffixes to check.
 * @param {Object} morphologyData   The Morphology data file
 *
 * @returns {string} The word without the suffix.
 */
const stemSuffixes6 = function( word, suffixes6, morphologyData ) {
	if ( word.length < 3 ) {
		return word;
	}
	const r1Position = findR1Position( morphologyData, word );
	const suffix6 = word.search( new RegExp( suffixes6 ) );
	if ( suffix6 >= r1Position ) {
		return word.substring( 0, suffix6 );
	}
	return word;
};


/**
 * Searches for the longest one of the suffixes in R1 and delete: ünk   unk   nk   juk   jük   uk   ük   em   om   am
 * m   od   ed ad   öd   d   ja   je   a   e o
 * @param {string} word             The word to check for the suffix.
 * @param {string} suffixes7        The suffixes to check.
 * @param {Object} morphologyData   The Morphology data file
 * @returns {string} The word without the suffix.
 */
const stemSuffixes7 = function( word, suffixes7, morphologyData ) {
	if ( word.length < 3 ) {
		return word;
	}
	const r1Position = findR1Position( morphologyData, word );
	const suffix7 = word.search( new RegExp( suffixes7 ) );
	if ( suffix7 >= r1Position ) {
		return word.substring( 0, suffix7 );
	}
	return word;
};

/**
 * Searches for the longest one of these suffixes in R1: jaim, jeim, aim, eim, im, jaid, eid, aid, eid, id, jai, jei, ai,
 * ei, i, jaink, jeink, eink, aink, ink, jaitok, jeitek, aitok, eitek, itek, jeik, jaik, aik, eik, ik and stem it
 *
 * @param {string} word             The word to check.
 * @param {string} suffixes8        The suffixes to check.
 * @param {Object} morphologyData   The Morphology data file
 * @returns {string}    The stemmed word.
 */
const stemSuffixes8 = function( word, suffixes8, morphologyData ) {
	if ( word.length < 3 ) {
		return word;
	}
	const r1Position = findR1Position( morphologyData, word );
	const suffix8 = word.search( new RegExp( suffixes8 ) );
	if ( suffix8 >= r1Position ) {
		return word.substring( 0, suffix8 );
	}
	return word;
};

/**
 * Searches for the longest one of these suffixes in R1 ánk ájuk ám ád á and replace  with a
 * Searches the longest one of the suffixes in R1 énk éjük ém éd é and replace with e
 *
 * @param {string} word             The word to check for the suffix.
 * @param {Object} suffixes9     	The suffixes to check.
 * @param {Object} morphologyData	The Morphology data file
 *
 * @returns {string} The word without the suffix.
 */
const stemSuffixes9 = function( word, suffixes9, morphologyData ) {
	if ( word.length < 3 ) {
		return word;
	}
	const r1Position = findR1Position( morphologyData, word );
	const suffixes9a = word.search( new RegExp( suffixes9.suffixes9a ) );
	if ( suffixes9a >= r1Position ) {
		return word.substring( 0, suffixes9a ) + "a";
	}
	const suffixes9b = word.search( new RegExp( suffixes9.suffixes9b ) );
	if ( suffixes9b >= r1Position ) {
		return word.substring( 0, suffixes9b ) + "e";
	}
	return word;
};

/**
 * Searches for the longest one of these suffixes in R1 áim   áid   ái   áink   áitok   áik and replace with a, and
 * Search for the longest one of the suffixes in R1 éim   éid     éi   éink   éitek   éik and replace with e
 *
 * @param {string} word         	The word to check.
 * @param {string} suffixes10  		The suffixes to stem.
 * @param {string} morphologyData 	The Morphology data file
 * @returns {string}    The stemmed word.
 */
const stemSuffixes10 = function( word, suffixes10, morphologyData ) {
	if ( word.length < 3 ) {
		return word;
	}
	const r1Position = findR1Position( morphologyData, word );
	const suffix10 = word.search( new RegExp( suffixes10 ) );
	if ( suffix10 >= r1Position ) {
		return word.substring( 0, suffix10 ) + "a";
	}
	return word;
};

/**
 * Searches for suffix ák and ék in R1 and replace with a and e respectively.
 *
 * @param {string} 	word         	The word to check.
 * @param {Object} 	suffixes11  	The suffixes to stem.
 * @param {Object} 	morphologyData 	The Morphology data file.
 *
 * @returns {string}    The stemmed word.
 */
const stemSuffixes11 = function( word, suffixes11, morphologyData ) {
	if ( word.length < 3 ) {
		return word;
	}
	const r1Position = findR1Position( morphologyData, word );
	const suffix11a = word.search( new RegExp( suffixes11.suffixes11a ) );
	if ( suffix11a >= r1Position ) {
		return ( word.slice( 0, -2 ) + "a" );
	}
	const suffix11b = word.search( new RegExp( suffixes11.suffixes11b ) );
	if ( suffix11b >= r1Position  ) {
		return ( word.slice( 0, -2 ) + "e" );
	}
	return word;
};

/**
 * Searches for the longest of these suffixes ök ok ek ak k in R1 and stem the suffix
 *
 * @param {string} word         The word to check.
 * @param {string}suffixes12  The suffixes to stem.
 * @param {Object} morphologyData Morphology data file
 * @returns {string}    The stemmed word.
 */
const stemSuffixes12 = function( word, suffixes12, morphologyData ) {
	if ( word.length < 3 ) {
		return word;
	}
	const r1Position = findR1Position( morphologyData, word );
	const suffix12 = word.search( new RegExp( suffixes12 ) );
	if ( suffix12 >= r1Position ) {
		return ( word.substring( 0, suffix12 ) );
	}
	return word;
};

/**
 * Stems Hungarian words.
 *
 * @param {string} word            The word to stem.
 * @param {Object} morphologyData  The Hungarian morphology data.
 *
 * @returns {string} The stemmed word.
 */
export default function stem( word, morphologyData ) {
	const wordAfterSuffixes1 = stemSuffixes1( word, morphologyData );
	const wordAfterSuffixes2 = stemSuffixes2( wordAfterSuffixes1, morphologyData.externalStemmer.suffixes2, morphologyData );
	const wordAfterSuffixes3 = stemSuffixes3( wordAfterSuffixes2, morphologyData.externalStemmer.suffixes3, morphologyData );
	const wordAfterSuffixes4 = stemSuffixes4( wordAfterSuffixes3, morphologyData.externalStemmer.suffixes4, morphologyData );
	const wordAfterSuffixes5 = stemSuffixes5( wordAfterSuffixes4, morphologyData.externalStemmer.suffixes5, morphologyData );
	const wordAfterSuffixes6 = stemSuffixes6( wordAfterSuffixes5, morphologyData.externalStemmer.suffixes6, morphologyData );
	const wordAfterSuffixes7 = stemSuffixes7( wordAfterSuffixes6, morphologyData.externalStemmer.suffixes7, morphologyData );
	const wordAfterSuffixes8 = stemSuffixes8( wordAfterSuffixes7, morphologyData.externalStemmer.suffixes8, morphologyData );
	const wordAfterSuffixes9 = stemSuffixes9( wordAfterSuffixes8, morphologyData.externalStemmer.suffixes9, morphologyData );
	const wordAfterSuffixes10 = stemSuffixes10( wordAfterSuffixes9, morphologyData.externalStemmer.suffixes10, morphologyData );
	const wordAfterSuffixes11 = stemSuffixes11( wordAfterSuffixes10, morphologyData.externalStemmer.suffixes11, morphologyData );

	return ( stemSuffixes12( wordAfterSuffixes11, morphologyData.externalStemmer.suffixes12, morphologyData ) );
}
