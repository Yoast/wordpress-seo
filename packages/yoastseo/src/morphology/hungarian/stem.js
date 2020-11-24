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
 * Defines consonants or digraphs position.
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
	if ( digraphPosition === consonantPosition ) {
		return digraphPosition + 1;
	}
	return consonantPosition;
};

/**
 * Defines the R1 region: Checks if the word begins with a vowel: defines R1 as the region after the first consonant or diagraph
 * Checks if the word begins with a consonant: defines R1 as the region after the first vowel
 *
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
 * @param {string} word         The word to stem
 * @param {string} suffixes2  suffixes from group 2
 * @param {Object} morphologyData Morphology data file
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
		let wordAfterStemming = word.substring( 0, suffix2 );
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
 * @param {Object} suffixes3    The suffixes to check.
 * @param {Object} morphologyData Morphology data file
 *
 * @returns {string} The word without the suffix.
 */
const stemSuffixes3 = function( word, suffixes3, morphologyData ) {
	if ( word.length < 3 ) {
		return word;
	}
	const r1Position = findR1Position( morphologyData, word );
	const suffix3a = word.search( new RegExp( suffixes3.suffixes3a ) );
	if ( suffix3a >= r1Position ) {
		return ( word.substring( 0, suffix3a ) + "a" );
	}
	const suffix3b = word.search( new RegExp( suffixes3.suffixes3b ) );
	if ( suffix3b >= r1Position ) {
		return ( word.substring( 0, suffix3b ) + "e" );
	}
	return word;
};

/**
 * Searches for the longest among following suffixes astul   estül   stul   stül in R1 and delete.
 *
 * @param {string} word         The word to check for the suffix.
 * @param {string} suffixes4    The suffixes to check.
 * @param {Object} morphologyData Morphology data file
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
 * Searhes for one of the suffixes ástul éstül, and replace ástul with a and éstül with e.
 *
 * @param {string} word         The word to check for the suffix.
 * @param {string[]} suffixes5  The suffixes to check.
 * @param {Object} morphologyData Morphology data file
 *
 * @returns {string} The word without the suffix.
 */
const stemSuffixes5 = function( word, suffixes5, morphologyData ) {
	if ( word.length < 3 ) {
		return word;
	}
	const r1Position = findR1Position( morphologyData, word );
	const suffix5a = word.search( new RegExp( suffixes5.suffixes5a ) );
	if ( suffix5a >= r1Position ) {
		return ( word.substring( 0, suffix5a ) + "a" );
	}
	const suffix5b = word.search( new RegExp( suffixes5.suffixes5b ) );
	if ( suffix5b  >= r1Position ) {
		return ( word.substring( 0, suffix5b ) + "e" );
	}
	return word;
};

/**
 * Searches for one of the suffixes Search for one of the following suffixes: á   é and delete. If preceded by double
 * Consonant, remove one of the double consonants.
 *
 * @param {string} word         The word to check for the suffix.
 * @param {string} suffixes6  The suffixes to check.
 * @param {Object} morphologyData Morphology data file
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
 * @param {string} suffixes7  The suffixes to check.
 * @param {Object} morphologyData Morphology data file
 *
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
 * Searches for one of the suffixes if R1 : áké   áéi and replace with a, or éké   ééi   éé and replace with e.
 *
 * @param {string} word         The word to check for the suffix.
 * @param {Object} suffixes8  The suffixes to check.
 * @param {Object} morphologyData Morphology data file
 * @returns {string} The word without the suffix.
 */
const stemSuffixes8 = function( word, suffixes8, morphologyData ) {
	if ( word.length < 3 ) {
		return word;
	}
	const r1Position = findR1Position( morphologyData, word );
	const suffix8a = word.search( new RegExp( suffixes8.suffixes8a ) );
	if ( suffix8a >= r1Position ) {
		return ( word.substring( 0, suffix8a ) + "a" );
	}
	const suffix8b = word.search( new RegExp( suffixes8.suffixes8b ) );
	if ( suffix8b >= r1Position ) {
		return ( word.substring( 0, suffix8b ) + "e" );
	}
	return word;
};

/**
 * Searches for the longest one of the suffixes in R1 and delete: ünk   unk   nk   juk   jük   uk   ük   em   om   am
 * m   od   ed ad   öd   d   ja   je   a   e o
 * @param {string} word         The word to check for the suffix.
 * @param {string} suffixes9  The suffixes to check.
 * @param {Object} morphologyData Morphology data file
 * @returns {string} The word without the suffix.
 */
const stemSuffixes9 = function( word, suffixes9, morphologyData ) {
	if ( word.length < 3 ) {
		return word;
	}
	const r1Position = findR1Position( morphologyData, word );
	const suffix9 = word.search( new RegExp( suffixes9 ) );
	if ( suffix9 >= r1Position ) {
		return word.substring( 0, suffix9 );
	}
	return word;
};

/**
 * Searches for the longest one of these suffixes in R1: jaim, jeim, aim, eim, im, jaid, eid, aid, eid, id, jai, jei, ai,
 * ei, i, jaink, jeink, eink, aink, ink, jaitok, jeitek, aitok, eitek, itek, jeik, jaik, aik, eik, ik and stem it
 *
 * @param {string} word         The word to check.
 * @param {string} suffixes10     The suffixes to check.
 * @param {Object} morphologyData Morphology data file
 * @returns {string}    The stemmed word.
 */
const stemSuffixes10 = function( word, suffixes10, morphologyData ) {
	if ( word.length < 3 ) {
		return word;
	}
	const r1Position = findR1Position( morphologyData, word );
	const suffix10 = word.search( new RegExp( suffixes10 ) );
	if ( suffix10 >= r1Position ) {
		return word.substring( 0, suffix10 );
	}
	return word;
};

/**
 * Searches for the longest one of these suffixes in R1 ánk ájuk ám ád á and replace  with a
 * Searches the longest one of the suffixes in R1 énk éjük ém éd é and replace with e
 *
 * @param {string} word             The word to check for the suffix.
 * @param {string[]} suffixes11     The suffixes to check.
 * @param {Object} morphologyData Morphology data file
 * @returns {string} The word without the suffix.
 */
const stemSuffixes11 = function( word, suffixes11, morphologyData ) {
	if ( word.length < 3 ) {
		return word;
	}
	const r1Position = findR1Position( morphologyData, word );
	const suffixes11a = word.search( new RegExp( suffixes11.suffixes11a ) );
	if ( suffixes11a >= r1Position ) {
		return word.substring( 0, suffixes11a ) + "a";
	}
	const suffixes11b = word.search( new RegExp( suffixes11.suffixes11b ) );
	if ( suffixes11b >= r1Position ) {
		return word.substring( 0, suffixes11b ) + "e";
	}
	return word;
};

/**
 * Searches for the longest one of these suffixes in R1 áim   áid   ái   áink   áitok   áik and replace with a, and
 * Search for the longest one of the suffixes in R1 éim   éid     éi   éink   éitek   éik and replace with e
 *
 * @param {string} word         The word to check.
 * @param {string[]}suffixes12  The suffixes to stem.
 * @param {Object} morphologyData Morphology data file
 * @returns {string}    The stemmed word.
 */
const stemSuffixes12 = function( word, suffixes12, morphologyData ) {
	if ( word.length < 3 ) {
		return word;
	}
	const r1Position = findR1Position( morphologyData, word );
	const suffix12a = word.search( new RegExp( suffixes12.suffixes12a ) );
	if ( suffix12a >= r1Position ) {
		return word.substring( 0, suffix12a ) + "a";
	}
	const suffix12b = word.search( new RegExp( suffixes12.suffixes12b ) );
	if ( suffix12b >= r1Position ) {
		return word.substring( 0, suffix12b ) + "e";
	}
	return word;
};

/**
 * Searches for suffix ák and ék in R1 and replace with a and e respectively.
 *
 * @param {string} word         The word to check.
 * @param {Object}suffixes13  The suffixes to stem.
 * @param {Object} morphologyData Morphology data file
 * @returns {string}    The stemmed word.
 */
const stemSuffixes13 = function( word, suffixes13, morphologyData ) {
	if ( word.length < 3 ) {
		return word;
	}
	const r1Position = findR1Position( morphologyData, word );
	const suffix13a = word.search( new RegExp( suffixes13.suffixes13a ) );
	if ( suffix13a >= r1Position ) {
		return ( word.slice( 0, -2 ) + "a" );
	}
	const suffix13b = word.search( new RegExp( suffixes13.suffixes13b ) );
	if ( suffix13b >= r1Position  ) {
		return ( word.slice( 0, -2 ) + "e" );
	}
	return word;
};

/**
 * Searches for the longest of these suffixes ök ok ek ak k in R1 and stem the suffix
 *
 * @param {string} word         The word to check.
 * @param {string}suffixes14  The suffixes to stem.
 * @param {Object} morphologyData Morphology data file
 * @returns {string}    The stemmed word.
 */
const stemSuffixes14 = function( word, suffixes14, morphologyData ) {
	if ( word.length < 3 ) {
		return word;
	}
	const r1Position = findR1Position( morphologyData, word );
	const suffix14 = word.search( new RegExp( suffixes14 ) );
	if ( suffix14 >= r1Position ) {
		return ( word.substring( 0, suffix14 ) );
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
	const wordAfterSuffixes12 = stemSuffixes12( wordAfterSuffixes11, morphologyData.externalStemmer.suffixes12, morphologyData );
	const wordAfterSuffixes13 = stemSuffixes13( wordAfterSuffixes12, morphologyData.externalStemmer.suffixes13, morphologyData );

	return ( stemSuffixes14( wordAfterSuffixes13, morphologyData.externalStemmer.suffixes14, morphologyData ) );
}


