import { findMatchingEndingInArray } from "../morphoHelpers/findMatchingEndingInArray";
/**
 * Checks if the input character is a Hungarian vowel.
 *
 * @param {Object} morphologyData   The Hungarian morphology data.
 * @param {string} word The word to check
 * @returns {number} Whether the input character is a Hungarian vowel.
 */
const isVowel = function( morphologyData, word ) {
	const vowels = morphologyData.externalStemmer.vowels;
	const regex = new RegExp( vowels );
	return word.search( regex );
};

/**
 * Checks if the word begins with a vowel: defines R1 as the region after the first consonant or diagraph
 * Checks if the word begsin with a consonant: defines R1 as the region after the first vowel
 *
 * @param {Object} morphologyData Morphology data file
 * @param {string} word the word to check
 * @returns {number} the position of the digraph or consonant
 */
const consonantOrDigraphPosition = function( morphologyData, word ) {
	const digraphRegex = new RegExp( morphologyData.externalStemmer.digraphs );
	const consonantRegex = new RegExp( morphologyData.externalStemmer.consonants );
	const digraphPosition = word.search( digraphRegex );
	const consonantPosition = word.search( consonantRegex );
	if ( digraphPosition < consonantPosition ) {
		return digraphPosition;
	}
	return consonantPosition;
};

/**
 * Defines the R1 region
 * @param {Object} morphologyData Morphology data file
 * @param {string} word The word to stem
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
 * @param {int} r1Position   The index of R1 region
 * @param {Object} morphologyData   The morphology data file with suffix list
 *
 * @returns {string}    The stemmed word.
 *
*/
const stemSuffixes1 = function( word, r1Position, morphologyData ) {
	const suffix = findMatchingEndingInArray( word, morphologyData.externalStemmer.suffixes1 );
	if ( word.length < 3 ) {
		return word;
	}
	if ( suffix !== "" && word.length >= r1Position ) {
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
 * @param {string} word         The word to stem
 * @param {int} r1Position   The index of R1 region
 * @param {string[]} suffixes2  suffixes from group 2
 *
 * @returns {string}    The stemmed word
 */
const stemSuffixes2 = function( word, r1Position, suffixes2 ) {
	const suffix2 = findMatchingEndingInArray( word, suffixes2 );
	if ( word.length < 3 ) {
		return word;
	}
	if ( suffix2 !== "" && word.length >= r1Position ) {
		let wordAfterStemming = word.slice( 0, -suffix2.length );
		const checkIfWordEndsOnAccentedEorE = ( wordAfterStemming.endsWith( "á" ) || wordAfterStemming.endsWith( "é" ) );
		if ( checkIfWordEndsOnAccentedEorE ) {
			wordAfterStemming = wordAfterStemming.replace( /á$/i, "a" || /é$/i, "e" );
		}
		return wordAfterStemming;
	}
	return word;
};

/** Searches for the longest among the following suffixes in R1: án   ánként and replace by a
 * Search for én in R1 and replace with e
 *
 * @param {string} word         The word to check for the suffix.
 * @param {int} r1Position   The index of R1 region
 * @param {string[]} suffixes3    The morphology data for Hungarian.
 *
 * @returns {string} The word without the suffix.
 */
const stemSuffixes3 = function( word, r1Position, suffixes3 ) {
	if ( word.length < 3 ) {
		return word;
	}
	const suffix3a = findMatchingEndingInArray( word, suffixes3.suffixes3a );
	if ( suffix3a !== "" && word.length >= r1Position ) {
		return ( word.slice( 0, -suffix3a.length ) + "a" );
	}
	const suffix3b = findMatchingEndingInArray( word, suffixes3.suffixes3b );
	if ( suffix3b !== "" && word.length >= r1Position ) {
		return ( word.slice( 0, -suffix3b.length ) + "e" );
	}
	return word;
};

/**
 * Searches for the longest among following suffixes astul   estül   stul   stül in R1 and delete.
 *
 * @param {string} word         The word to check for the suffix.
 * @param {int} r1Position   The index of R1 region
 * @param {string[]} suffixes4    The morphology data for Hungarian.
 *
 * @returns {string} The word without the suffix.
 */
const stemSuffixes4 = function( word, r1Position, suffixes4 ) {
	const suffix4 = findMatchingEndingInArray( word, suffixes4 );
	if ( word.length < 3 ) {
		return word;
	}
	if ( suffix4 !== "" && word.length >= r1Position ) {
		return ( word.slice( 0, -suffix4.length ) );
	}
	return word;
};

/**
 * Searhes for one of the suffixes ástul éstül, and replace ástul with a and éstül with e.
 *
 * @param {string} word         The word to check for the suffix.
 * @param {int} r1Position   The index of R1 region
 * @param {string[]} suffixes5    The morphology data for Hungarian.
 *
 * @returns {string} The word without the suffix.
 */
const stemSuffixes5 = function( word, r1Position, suffixes5 ) {
	if ( word.length < 3 ) {
		return word;
	}
	const suffix5a = findMatchingEndingInArray( word, suffixes5.suffixes5a );
	if ( suffix5a !== "" && word.length >= r1Position ) {
		return ( word.slice( 0, -suffix5a.length ) + "a" );
	}
	const suffix5b = findMatchingEndingInArray( word, suffixes5.suffixes5b );
	if ( suffix5b !== "" && word.length >= r1Position ) {
		return ( word.slice( 0, -suffix5b.length ) + "e" );
	}
	return word;
};

/**
 * Searches for one of the suffixes Search for one of the following suffixes: á   é and delete. If preceded by double
 * Consonant, remove one of the double consonants.
 *
 * @param {string} word         The word to check for the suffix.
 * @param {int} r1Position   The index of R1 region
 * @param {string[]} suffixes6    The morphology data for Hungarian.
 *
 * @returns {string} The word without the suffix.
 */
const stemSuffixes6 = function( word, r1Position, suffixes6 ) {
	const suffix6 = findMatchingEndingInArray( word, suffixes6 );
	if ( word.length < 3 ) {
		return word;
	}
	if ( suffix6 !== "" && word.length >= r1Position ) {
		let wordAfterStemming = word.slice( 0, -1 );
		const checkIfWordEndsOnAccentedEorE = ( wordAfterStemming.endsWith( "á" ) || wordAfterStemming.endsWith( "é" ) );
		if ( checkIfWordEndsOnAccentedEorE ) {
			wordAfterStemming = wordAfterStemming.replace( /á$/i, "a" || /é$/i, "e" );
		}
		return wordAfterStemming;
	}
	return word;
};

/**
 * Searches for one of the suffixes in R1 and delete oké   öké   aké   eké   ké   éi   é.
 *
 * @param {string} word         The word to check for the suffix.
 * @param {int} r1Position   The index of R1 region
 * @param {string[]} suffixes7    The morphology data for Hungarian.
 *
 * @returns {string} The word without the suffix.
 */
const stemSuffixes7 = function( word, r1Position, suffixes7 ) {
	const suffix7 = findMatchingEndingInArray( word, suffixes7 );
	if ( word.length < 3 ) {
		return word;
	}
	if ( suffix7 !== "" && word.length >= r1Position ) {
		return ( word.slice( 0, -suffix7.length ) );
	}
	return word;
};

/**
 * Searches for one of the suffixes if R1 : áké   áéi and replace with a, or éké   ééi   éé and replace with e.
 *
 * @param {string} word         The word to check for the suffix.
 * @param {int} r1Position   The index of R1 region
 * @param {string[]} suffixes8    The morphology data for Hungarian.
 *
 * @returns {string} The word without the suffix.
 */
const stemSuffixes8 = function( word, r1Position, suffixes8 ) {
	if ( word.length < 3 ) {
		return word;
	}
	const suffix8a = findMatchingEndingInArray( word, suffixes8.suffixes8a );
	if ( suffix8a !== "" && word.length >= r1Position ) {
		return ( word.slice( 0, -suffix8a.length ) + "a" );
	}
	const suffix8b = findMatchingEndingInArray( word, suffixes8.suffixes8b );
	if ( suffix8b !== "" && word.length >= r1Position ) {
		return ( word.slice( 0, -suffix8b.length ) + "e" );
	}
	return word;
};

/**
 * Searches for the longest one of these suffixes in R1 ánk ájuk ám ád á and replace  with a
 * Searches the longest one of the suffixes in R1 énk éjük ém éd é and replace with e
 *
 * @param {string} word         The word to check for the suffix.
 * @param {int} r1Position   The index of R1 region
 * @param {string[]} suffixes9    The morphology data for Hungarian.
 *
 * @returns {string} The word without the suffix.
 */
const stemSuffixes9 = function( word, r1Position, suffixes9 ) {
	if ( word.length < 3 ) {
		return word;
	}
	const suffix10a = findMatchingEndingInArray( word, suffixes9.suffixes9a );
	if ( suffix10a !== "" && word.length >= r1Position ) {
		return ( word.slice( 0, -suffix10a.length ) + "a" );
	}
	const suffix10b = findMatchingEndingInArray( word, suffixes9.suffixes9b );
	if ( suffix10b !== "" && word.length >= r1Position ) {
		return ( word.slice( 0, -suffix10b.length ) + "e" );
	}
	return word;
};

/**
 * Searches for the longest one of the suffixes in R1 and delete: ünk   unk   nk   juk   jük   uk   ük   em   om   am
 * m   od   ed ad   öd   d   ja   je   a   e o
 * @param {string} word         The word to check for the suffix.
 * @param {int} r1Position   The index of R1 region
 * @param {string[]} suffixes10    The morphology data for Hungarian.
 *
 * @returns {string} The word without the suffix.
 */
const stemSuffixes10 = function( word, r1Position, suffixes10 ) {
	const suffix9 = findMatchingEndingInArray( word, suffixes10 );
	if ( word.length < 3 ) {
		return word;
	}
	if ( suffix9 !== "" && word.length >= r1Position ) {
		return ( word.slice( 0, -suffix9.length ) );
	}
	return word;
};

/**
 * Searches for the longest one of these suffixes in R1: jaim, jeim, aim, eim, im, jaid, eid, aid, eid, id, jai, jei, ai,
 * ei, i, jaink, jeink, eink, aink, ink, jaitok, jeitek, aitok, eitek, itek, jeik, jaik, aik, eik, ik and stem it
 *
 * @param {string} word         The word to check.
 * @param {int} r1Position   The index of R1 region
 * @param {string[]}suffixes11  The suffixes to stem
 *
 * @returns {string}    The stemmed word.
 */
const stemSuffixes11 = function( word, r1Position, suffixes11 ) {
	const suffix11 = findMatchingEndingInArray( word, suffixes11 );
	if ( word.length < 3 ) {
		return word;
	}
	if ( suffix11 !== "" && word.length >= r1Position ) {
		return ( word.slice( 0, -suffix11.length ) );
	}
	return word;
};

/**
 * Searches for the longest one of these suffixes in R1 áim   áid   ái   áink   áitok   áik and replace with a, and
 * Search for the longest one of the suffixes in R1 éim   éid     éi   éink   éitek   éik and replace with e
 *
 * @param {string} word         The word to check.
 * @param {int} r1Position   The index of R1 region
 * @param {string[]}suffixes12  The suffixes to stem
 *
 * @returns {string}    The stemmed word.
 */
const stemSuffixes12 = function( word, r1Position, suffixes12 ) {
	if ( word.length < 3 ) {
		return word;
	}
	const suffix12a = findMatchingEndingInArray( word, suffixes12.suffix12a );
	if ( suffix12a !== "" && word.length >= r1Position ) {
		return ( word.slice( 0, -suffix12a.length ) + "a" );
	}
	const suffix12b = findMatchingEndingInArray( word, suffixes12.suffix12b );
	if ( suffix12b !== "" && word.length >= r1Position ) {
		return ( word.slice( 0, -suffix12b.length ) + "e" );
	}
	return word;
};

/**
 * Searches for suffix ák and ék in R1 and replace with a and e respectively.
 *
 * @param {string} word         The word to check.
 * @param {int} r1Position   The index of R1 region
 * @param {string[]}suffixes13  The suffixes to stem
 *
 * @returns {string}    The stemmed word.
 */
const stemSuffixes13 = function( word, r1Position, suffixes13 ) {
	if ( word.length < 3 ) {
		return word;
	}
	const suffix13a = new RegExp( suffixes13.suffixes13a );
	if ( suffix13a.test( word ) && word.length >= r1Position ) {
		return ( word.slice( 0, -2 ) + "a" );
	}
	const suffix13b = new RegExp( suffixes13.suffixes13b );
	if ( suffix13b.test( word ) && word.length >= r1Position ) {
		return ( word.slice( 0, -2 ) + "e" );
	}
	return word;
};

/**
 * Searches for the longest of these suffixes ök ok ek ak k in R1 and stem the suffix
 *
 * @param {string} word         The word to check.
 * @param {int} r1Position   The index of R1 region
 * @param {string[]}suffixes14  The suffixes to stem
 *
 * @returns {string}    The stemmed word.
 */
const stemSuffixes14 = function( word, r1Position, suffixes14 ) {
	const suffix14 = findMatchingEndingInArray( word, suffixes14 );
	if ( word.length < 3 ) {
		return word;
	}
	if ( suffix14 !== "" && word.length >= r1Position ) {
		return ( word.slice( 0, -suffix14.length ) );
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
	const r1Position = findR1Position( morphologyData, word );
	const wordAfterSuffixes1 = stemSuffixes1( word, r1Position, morphologyData );
	const wordAfterSuffixes2 = stemSuffixes2( wordAfterSuffixes1, r1Position, morphologyData.externalStemmer.suffixes2 );
	const wordAfterSuffixes3 = stemSuffixes3( wordAfterSuffixes2, r1Position, morphologyData.externalStemmer.suffixes3 );
	const wordAfterSuffixes4 = stemSuffixes4( wordAfterSuffixes3, r1Position, morphologyData.externalStemmer.suffixes4 );
	const wordAfterSuffixes5 = stemSuffixes5( wordAfterSuffixes4, r1Position, morphologyData.externalStemmer.suffixes5 );
	const wordAfterSuffixes6 = stemSuffixes6( wordAfterSuffixes5, r1Position, morphologyData );
	const wordAfterSuffixes7 = stemSuffixes7( wordAfterSuffixes6, r1Position, morphologyData.externalStemmer.suffixes7 );
	const wordAfterSuffixes8 = stemSuffixes8( wordAfterSuffixes7, r1Position, morphologyData.externalStemmer.suffixes8 );
	const wordAfterSuffixes9 = stemSuffixes9( wordAfterSuffixes8, r1Position, morphologyData.externalStemmer.suffixes9 );
	const wordAfterSuffixes10 = stemSuffixes10( wordAfterSuffixes9, r1Position, morphologyData.externalStemmer.suffixes10 );
	const wordAfterSuffixes11 = stemSuffixes11( wordAfterSuffixes10, r1Position, morphologyData.externalStemmer.suffixes11 );
	const wordAfterSuffixes12 = stemSuffixes12( wordAfterSuffixes11, r1Position, morphologyData.externalStemmer.suffixes12 );
	const wordAfterSuffixes13 = stemSuffixes13( wordAfterSuffixes12, r1Position, morphologyData.externalStemmer.suffixes13 );

	return ( stemSuffixes14( wordAfterSuffixes13, r1Position, morphologyData.externalStemmer.suffixes14 ) );
}


