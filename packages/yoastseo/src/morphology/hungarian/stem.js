/**
 * Checks if the input character is a Hungarian vowel.
 *
 * @param {string} char             The character to be checked.
 * @param {Object} morphologyData   The Hungarian morphology data.
 *
 * @returns {boolean} Whether the input character is a Hungarian vowel.
 */

/** define vowels and diagraphs and double consonants
 * define R1
 *
 *
 */
const isVowel = function( morphologyData, word ) {
	const regex = new RegExp( morphologyData.externalStemmer.vowels )
	return regex.test( word );
};
// define doubleconsonant
const isDoubleConsonant = function( morphologyData, word ) {
	const regex = new RegExp( morphologyData.externalStemmer.doubleConsonants )
	return regex.test( word );
};

// If the word begins with a vowel, R1 is defined as the region after the first consonant or digraph in the word.
// If the word begins with a consonant, it is defined as the region after the first vowel in the word.
// Find 1st consonant or digraph for condiiton 1
const consonantOrDigraphPosition = function( word, morphologyData ) {
	const digraphRegex = new RegExp( morphologyData.externalStemmer.digraphs )
	const consonantRegex = new RegExp( morphologyData.externalStemmer.consonants )
	const digraphPosition = digraphRegex.test( word );
	const consonantPosition = consonantRegex.test( word );
	if ( digraphPosition < consonantPosition ) {
		return digraphPosition ;
	}
	return consonantPosition ;
}

const findR1Position = function( word, morphologyData ) {
	const vowelPosition = isVowel(word, morphologyData);
	if (vowelPosition === 0) {
		const consonantOrDigraphPosition = consonantOrDigraphPosition(word, morphologyData);// for consonantorDigraph- we don't have digraph and consonants in one regex
		return ( consonantOrDigraphPosition + 1 );
	}
	return ( vowelPosition + 1 );
}

//check if we need this variable
const endsIn = function( word, suffix ) {
	if ( word.length < suffix.length ) {
		return false;
	}

	return ( word.slice( -suffix.length ) === suffix );
};

/**
 * Searches on of the following suffixes: al, el and stems the suffix if found in R1 and preceded by a double consonant and
 * removes one of the double consonants
 *
 * @param {string} word             The word to check for the suffix.
 * @param  {string} r1Text          The R1 region of the word to stem.
 * @param {Object} regions          The object that contains the string within the R1 region and the rest string of the word.
 * @param {Object} morphologyData   The morphology data for Hungarian.
 *
 * @returns {string} The word without the suffix.
 */
// suffixes1= (al|el)$
	// if the suffix ends with one of the suffixes AND R1

const stemSuffixes1 = function( r1Position, word, suffixes1 ){
	const doubleConsonant = morphologyData.doubleConsonants

	if ( word.test( suffixes1 ) &&r1 ) {
		let wordAfterStemming = word.slice( -2 );
		const checkIfWordEndsOnDoubleConsonant = doubleConsonant.map( consonants => wordAfterStemming.endsWith( consonants ) );
		if( checkIfWordEndsOnDoubleConsonant ){
			wordAfterStemming = wordAfterStemming.slice( -1 );
		}
		return wordAfterStemming;
	}
	return word;// why we add?
}

/**
 * Searches for the longer of the following suffixes: ban   ben   ba   be   ra   re   nak   nek   val   vel   tól   tõl
 * ról   rõl   ból   bõl   hoz   hez   höz   nál   nél   ig   at   et   ot   öt   ért   képp   képpen   kor   ul   ül
 * vá   vé   onként   enként   anként   ként   en   on   an   ön   n   t and stems the suffix if found in R1
 *If the remaining word ends á replace by a
 *If the remaining word ends é replace by e
 *
 * @param {string} word             The word to check for the suffix.
 * @param  {string} r1Text          The R1 region of the word to stem.
 * @param {Object} regions          The object that contains the string within the R1 region and the rest string of the word.
 * @param {Object} morphologyData   The morphology data for Hungarian.
 *
 * @returns {string} The word without the suffix.
 */
const stemSuffixes2 = function( word, r1Position, suffixes2 ) {
	const doubleConsonant = morphologyData.doubleConsonants

	if ( word.test( suffixes2 ) && r1 ) {
		let wordAfterStemming = word.slice( 0, -stemSuffixes2.length );
		const checkIfWordEndsOnÉorÁ = wordAfterStemming.endsWith(["á", "é"]);
		if ( checkIfWordEndsOnÉorÁ ) = wordAfterStemming.replace(/^á/i, "a" | /^é/i, "e");
	}
	return wordAfterStemming;
}
return word; // why we add and how correctly
}

/*Search for the longest among the following suffixes in R1: án   ánként and replace by a
 * @param {string} word             The word to check for the suffix.
 * @param  {string} r1Text          The R1 region of the word to stem.
 * @param {Object} regions          The object that contains the string within the R1 region and the rest string of the word.
 * @param {Object} morphologyData   The morphology data for Hungarian.
 *
 * @returns {string} The word without the suffix.
 */
	const stemSuffixes3 = function (word, r1Position, suffixes3) {
		if (word.test(suffixes3) && r1) {
			let wordAfterStemming = word.slice(0, -stemSuffixes3.length) + "a";
		}
		return wordAfterStemming;
	}
	return word;

/*Search for the suffix én in R1 and replace by e
 * @param {string} word             The word to check for the suffix.
 * @param  {string} r1Text          The R1 region of the word to stem.
 * @param {Object} regions          The object that contains the string within the R1 region and the rest string of the word.
 * @param {Object} morphologyData   The morphology data for Hungarian.
 *
 * @returns {string} The word without the suffix.
 */
{
	const stemSuffixes4 = function (word, r1Position, suffixes4) {
		if (word.test(suffixes4) && r1) {
			let wordAfterStemming = word.slice(0, -stemSuffixes4.length) + "e";
		}
		return wordAfterStemming;
	}
	return word;
}

/*Search for the longest among following suffixes astul   estül   stul   stül in R1 and delete
 */

		const stemSuffixes5 = function (word, r1Position, suffixes5) {
			if (word.test(suffixes5) && r1) {
				let wordAfterStemming = word.slice(0, -stemSuffixes5.length);
			}
			return wordAfterStemming;
		}
		return word;


/*Searh for one of the suffixes ástul éstül, and replace ástul with and éstül with e
 */
const stemSuffixes6 = function (word, r1Position, suffixes6) {
	if ( word.test( [ "ástul" ] ) && r1) {
		let wordAfterStemming = word.slice(0, -stemSuffixes6.length) + "a"; // check if this can be a number for the minus 5
	}
	if (word.test( [ "éstül" ] ) && r1) {
		let wordAfterStemming = word.slice(-5) + "e"; // or like this? (minus -5 )
	}
	return wordAFterStemming;
}
return word;

// Search for one of the suffixes Search for one of the following suffixes: á   é and delete. If preceded by double
// consonant, remove one of the double consonants.
	const stemSuffixes7 = function ( r1Position, word, suffixes7 ) {
		const doubleConsonant = morphologyData.doubleConsonants

		if (word.test(suffixes7) && r1) {
			let wordAfterStemming = word.slice(-1);
			const checkIfWordEndsOnDoubleConsonant = doubleConsonant.map(consonants => wordAfterStemming.endsWith(consonants));
			if (checkIfWordEndsOnDoubleConsonant) {
				wordAfterStemming = wordAfterStemming.slice(-1);
			}
			return wordAfterStemming;
		}
		return word;// why we add?
	}

// Search for one of the suffixes in R1 and delete oké   öké   aké   eké   ké   éi   é
	const stemSuffixes8 = function (word, r1Position, suffixes8) {
		if (word.test(suffixes5) && r1) {
			let wordAfterStemming = word.slice(0, -stemSuffixes8.length);
		}
		return wordAfterStemming;
	}
	return word;
}

// Search for one of the suffixes if R1 : áké   áéi and replace with a, or éké   ééi   éé and replace with e
// suffix9a suffix 9b suffix 9 c
const stemSuffixes9 = function (word, r1Position, suffixes9) { /// add sugbgroups
	if (word.test( suffixes9.suffixes9a ) && r1) {
		let wordAfterStemming = word.slice(0, -3) + "a"; // check if this can be a number for the minus 3
	}
	if (word.test( [ "éké" ] , [ "ééi" ] ) && r1) {
		let wordAfterStemming = word.slice(-3) + "e"; // bc = one group and remove suffixe length instead
	}
	if (word test( [ "éé" ] ) && r1) {
		let wordAfterStemming = word.slice(-2) + "e";
	}
	return wordAFterStemming;
}
return word;

/**
 * Stems Hungarian words.
 *
 * @param {string} word            The word to stem.
 * @param {Object} morphologyData  The Spanish morphology data.
 *
 * @returns {string} The stemmed word.
 */
export default function stem( word, morphologyData ) {
	const r1Position = findR1Position( word, morphologyData );
	const suffixes1 = stemSuffixes1( word, morphologyData, suffixes1 );
	const suffixes2 = stemSuffixes2( word, morphologyData, suffixes2 );
	const suffixes3 = stemSuffixes3( word, morphologyData, suffixes3 );




