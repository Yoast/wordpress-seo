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
 * Checks if the input character is a Hungarian double consonant.
 *
 * @param {Object} morphologyData   The Hungarian morphology data.
 * @param {string} word The word to check
 * @returns {boolean} Whether the input character is a Hungarian double consonant.
 */
const isDoubleOrTripleConsonant = function( morphologyData, word, consonantRegex ) {
	return consonantRegex.test( word );
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
 * @returns {number} The R1 region
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
 * @param {Object} morphologyData Morpology data file with suffix list
 * @param {string} word The word to stem
 * @param {string} r1Text The text of the R1 region
 *
*/
const stemSuffixes1 = function( word, r1Text, morphologyData ) {
	const suffix = findMatchingEndingInArray( word, morphologyData.externalStemmer.suffixes1 );

	if ( suffix !== "" ) {
		let wordAfterStemming = word.slice( 0, -2 );

		const tripleConsonantsRegex = new RegExp( morphologyData.externalStemmer.tripleDoubleConsonants );
		const checkIfWordEndsOnTripleDoubleConsonant = isDoubleOrTripleConsonant( morphologyData, wordAfterStemming, tripleConsonantsRegex );
		if ( checkIfWordEndsOnTripleDoubleConsonant ) {
			wordAfterStemming = wordAfterStemming.slice( 0, -2 ) + wordAfterStemming.charAt( wordAfterStemming.length - 1 );
		}

		const doubleConsonantRegex = new RegExp( morphologyData.externalStemmer.doubleConsonants );
		const checkIfWordEndsOnDoubleConsonant = isDoubleOrTripleConsonant( morphologyData, wordAfterStemming, doubleConsonantRegex );
		if ( checkIfWordEndsOnDoubleConsonant ) {
			wordAfterStemming = wordAfterStemming.slice( 0, -1 );
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
 * @param {string} word The word to stem
 * @param {string} r1Text The text of R1 region
 * @param {string[]} suffixes2 suffixes from group 2
 */
const stemSuffixes2 = function( word, r1Text, suffixes2 ) {
	const suffix = findMatchingEndingInArray( word, suffixes2 );
	if ( suffix !== "" ) {
		let wordAfterStemming = word.slice( 0, -suffix.length );
		const checkIfWordEndsOnAccentedEorE = ( wordAfterStemming.endsWith( "á" ) || wordAfterStemming.endsWith( "é" ) );
		if ( checkIfWordEndsOnAccentedEorE ) {
			wordAfterStemming = wordAfterStemming.replace( /á$/i, "a" || /é$/i, "e" );
		}
		return wordAfterStemming;
	}
	return word;
};

/* Search for the longest among the following suffixes in R1: án   ánként and replace by a
 *Search for én in R1 and replace with e
 *
 * @param {string} word             The word to check for the suffix.
 * @param {Object} regions          The object that contains the string within the R1 region and the rest string of the word.
 * @param {Object} morphologyData   The morphology data for Hungarian.
 *
 * @returns {string} The word without the suffix.
 */
const stemSuffixes3 = function( word, r1Text, suffixes3 ) {
	const suffix3a = findMatchingEndingInArray( word, suffixes3.suffixes3a );
	if ( suffix3a !== "" ) {
		return ( word.slice( 0, -suffix3a.length ) + "a" );
	}
	const suffix3b = findMatchingEndingInArray( word, suffixes3.suffixes3b );
	if ( suffix3b !== "" ) {
		return ( word.slice( 0, -suffix3b.length ) + "e" );
	}
	return word;
};

/* Search for the longest among following suffixes astul   estül   stul   stül in R1 and delete
 */
const stemSuffixes4 = function( word, r1Text, suffixes4 ) {
	const suffix4 = findMatchingEndingInArray( word, suffixes4 );
	if ( suffix4 !== "" ) {
		return ( word.slice( 0, -suffix4.length ) );
	}
	return word;
};


/* Searh for one of the suffixes ástul éstül, and replace ástul with a and éstül with e
 */
const stemSuffixes5 = function( word, r1Text, suffixes5 ) {
	const suffix5a = findMatchingEndingInArray( word, suffixes5.suffixes5a );
	if ( suffix5a !== "" ) {
		return ( word.slice( 0, -suffix5a.length ) + "a" );
	}
	const suffix5b = findMatchingEndingInArray( word, suffixes5.suffixes5b );
	if ( suffix5b !== "" ) {
		return ( word.slice( 0, -suffix5b.length ) + "a" );
	}
	return word;
};

// Search for one of the suffixes Search for one of the following suffixes: á   é and delete. If preceded by double
// Consonant, remove one of the double consonants.
const stemSuffixes6 = function( word, r1Text, suffixes6 ) {
	const suffix6 = findMatchingEndingInArray( word, suffixes6 );
	if ( suffix6 !== "" ) {
		let wordAfterStemming = word.slice( 0, -1 );
		const checkIfWordEndsOnAccentedEorE = ( wordAfterStemming.endsWith( "á" ) || wordAfterStemming.endsWith( "é" ) );
		if ( checkIfWordEndsOnAccentedEorE ) {
			wordAfterStemming = wordAfterStemming.replace( /á$/i, "a" || /é$/i, "e" );
		}
		return wordAfterStemming;
	}
	return word;
};


// Search for one of the suffixes in R1 and delete oké   öké   aké   eké   ké   éi   é
const stemSuffixes7 = function( word, r1Text, suffixes7 ) {
	const suffix7 = findMatchingEndingInArray( word, suffixes7 );
	if ( suffix7 !== "" ) {
		return ( word.slice( 0, -suffix7.length ) );
	}
	return word;
};

// Search for one of the suffixes if R1 : áké   áéi and replace with a, or éké   ééi   éé and replace with e
const stemSuffixes8 = function( word, r1Text, suffixes8 ) {
	const suffix8a = findMatchingEndingInArray( word, suffixes8.suffix8a );
	if ( suffix8a !== "" ) {
		return ( word.slice( 0, -suffix8a.length ) + "a" );
	}
	const suffix8b = findMatchingEndingInArray( word, suffixes8.suffix8b );
	if ( suffix8b !== "" ) {
		return ( word.slice( 0, -suffix8b.length ) + "e" );
	}
	return word;
};

// Search for the longest one of the suffixes in R1 and delete: ünk   unk   nk   juk   jük   uk   ük   em   om   am   m   od   ed
// Ad   öd   d   ja   je   a   e o
const stemSuffixes9 = function( word, r1Text, suffixes9 ) {
	const suffix9 = findMatchingEndingInArray( word, suffixes9 );
	if ( suffix9 !== "" ) {
		return ( word.slice( 0, -suffix9.length ) );
	}
	return word;
};

// Search for the longest one of these suffixes in R1 ánk ájuk ám ád á and replace  with a
// Search the longest one of the suffixes in R1 énk éjük ém éd é and replace with e
const stemSuffixes10 = function( word, r1Text, suffixes10 ) {
	const suffix10a = findMatchingEndingInArray( word, suffixes10.suffix8a );
	if ( suffix10a !== "" ) {
		return ( word.slice( 0, -suffix10a.length ) + "a" );
	}
	const suffix10b = findMatchingEndingInArray( word, suffixes10.suffix8b );
	if ( suffix10b !== "" ) {
		return ( word.slice( 0, -suffix10b.length ) + "e" );
	}
	return word;
};

// Search for the longest one of these suffixes in R1 and delete jaim   jeim   aim   eim   im   jaid   jeid   aid   eid
// Id   jai   jei   ai   ei   i   jaink   jeink   eink   aink   ink   jaitok   jeitek   aitok   eitek   itek   jeik
// Jaik   aik   eik   ik
const stemSuffixes11 = function( word, r1Text, suffixes11 ) {
	const suffix11 = findMatchingEndingInArray( word, suffixes11 );
	if ( suffix11 !== "" ) {
		return ( word.slice( 0, -suffix11.length ) );
	}
	return word;
};

// Search for the longest one of these suffixes in R1 áim   áid   ái   áink   áitok   áik and replace with a
// Search for the longest one of the suffixes in R1 éim   éid     éi   éink   éitek   éik and replace with e
const stemSuffixes12 = function( word, r1Text, suffixes12 ) {
	const suffix12a = findMatchingEndingInArray( word, suffixes12.suffix12a );
	if ( suffix12a !== "" ) {
		return ( word.slice( 0, -suffix12a.length ) + "a" );
	}
	const suffix12b = findMatchingEndingInArray( word, suffixes12.suffix12b );
	if ( suffix12b !== "" ) {
		return ( word.slice( 0, -suffix12b.length ) + "e" );
	}
	return word;
};

// Search for suffix ák in R1 and replace with a // check if we can unite this step and step above
// Search for suffix ék in R1 and replace with e
const stemSuffixes13 = function( word, r1Position, suffixes13 ) {
	const suffix13a = new RegExp( suffixes13.suffixes13a );
	if ( suffix13a.test( word ) && r1Position ) {
		return ( word.slice( 0, -2 ) + "a" );
	}
	const suffix13b = new RegExp( suffixes13.suffixes13b );
	if ( suffix13b.test( word ) && r1Position ) {
		return ( word.slice( 0, -2 ) + "e" );
	}
	return word;
};

// Search for the longest of these suffixes ök ok ek ak k in R1 and delte
const stemSuffixes14 = function( word, r1Text, suffixes14 ) {
	const suffix14 = findMatchingEndingInArray( word, suffixes14 );
	if ( suffix14 !== "" ) {
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
	const r1Text = word.slice( r1Position );
	const wordAfterSuffixes1 = stemSuffixes1( word, r1Text, morphologyData );
	const wordAfterSuffixes2 = stemSuffixes2( wordAfterSuffixes1, r1Text, morphologyData.externalStemmer.suffixes2 );
	const wordAfterSuffixes3 = stemSuffixes3( wordAfterSuffixes2, r1Text, morphologyData.externalStemmer.suffixes3 );
	const wordAfterSuffixes4 = stemSuffixes4( wordAfterSuffixes3, r1Text, morphologyData.externalStemmer.suffixes4 );
	const wordAfterSuffixes5 = stemSuffixes5( wordAfterSuffixes4, r1Text, morphologyData.externalStemmer.suffixes5 );
	const wordAfterSuffixes6 = stemSuffixes6( wordAfterSuffixes5, r1Text, morphologyData );
	const wordAfterSuffixes7 = stemSuffixes7( wordAfterSuffixes6, r1Text, morphologyData.externalStemmer.suffixes7 );
	const wordAfterSuffixes8 = stemSuffixes8( wordAfterSuffixes7, r1Text, morphologyData.externalStemmer.suffixes8 );
	const wordAfterSuffixes9 = stemSuffixes9( wordAfterSuffixes8, r1Text, morphologyData.externalStemmer.suffixes9 );
	const wordAfterSuffixes10 = stemSuffixes10( wordAfterSuffixes9, r1Text, morphologyData.externalStemmer.suffixes10 );
	const wordAfterSuffixes11 = stemSuffixes11( wordAfterSuffixes10, r1Text, morphologyData.externalStemmer.suffixes11 );
	const wordAfterSuffixes12 = stemSuffixes12( wordAfterSuffixes11, r1Text, morphologyData.externalStemmer.suffixes12 );
	const wordAfterSuffixes13 = stemSuffixes13( wordAfterSuffixes12, r1Text, morphologyData.externalStemmer.suffixes13 );

	return ( stemSuffixes14( wordAfterSuffixes13, r1Text, morphologyData.externalStemmer.suffixes14 ) );
}


