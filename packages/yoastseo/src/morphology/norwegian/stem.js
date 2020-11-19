/**
 * Determines the start index of the R1 region.
 * R1 is the region after the first non-vowel following a vowel. It should include at least 3 letters.
 *
 * @param {string} word The word for which to determine the R1 region.
 * @returns {number} The start index of the R1 region.
 */
const determineR1 = function( word ) {
	// Start with matching first vowel and non-vowel.
	let r1Index = word.search( /[aeiouyøåæ][^aeiouyøåæ]/ );
	// Then add 2 since the R1 index is the index after the first vowel & non-vowel matched with the regex.
	if ( r1Index !== -1 ) {
		r1Index += 2;
	}

	// Adjust R1 so that the region preceding it includes at least 3 letters.
	if ( r1Index !== -1 && r1Index < 3 ) {
		r1Index = 3;
	}

	return r1Index;
};

/**
 *
 * @param word
 * @param r1Index
 * @param morphologyDataNN
 * @returns {string}
 */
const removeSuffixesStep1 = function( word, r1Index, morphologyDataNN ) {
	const suffixes1a = morphologyDataNN.externalStemmer.suffixes1a;
	const suffixes1aIndex = word.search( new RegExp( suffixes1a ) );
	if ( suffixes1aIndex >= r1Index ) {
		word = word.substring( 0, suffixes1aIndex );
	}

	const suffixes1b = morphologyDataNN.externalStemmer.suffixes1b;
	const suffixes1bIndex = word.search( /s$/ );
	if ( suffixes1bIndex >= r1Index && word.search( new RegExp( suffixes1b ) ) ) {
		word = word.substring( 0, word.length - 1 );
	}

	const suffixes1c = morphologyDataNN.externalStemmer.suffixes1c;
	const suffixes1cIndex = word.search( new RegExp( suffixes1c[ 0 ] ) );
	if ( suffixes1cIndex >= r1Index ) {
		word = word.replace( new RegExp( suffixes1c[ 0 ] ), ( suffixes1c[ 1 ] ) );
	}

	return word;
};

// Remove suffixes step 2
/**
 *
 * @param word
 * @param r1Index
 * @param morphologyDataNN
 * @returns {*}
 */
const removeSuffixesStep2 = function( word, r1Index, morphologyDataNN ) {
	const suffixes2 = morphologyDataNN.externalStemmer.suffixes2;
	const suffixes2Index = word.search( new RegExp( suffixes2[ 0 ] ) );
	if ( suffixes2Index >= r1Index ) {
		word = word.replace( new RegExp( suffixes2[ 0 ] ), ( suffixes2[ 1 ] ) );
	}
	return word;
};

/**
 *
 * @param word
 * @param morphologyDataNN
 * @returns {string}
 */
export default function stem( word, morphologyDataNN ) {
	const r1Index = determineR1( word );
	// Remove suffixes step 1
	if ( removeSuffixesStep1( word, r1Index, morphologyDataNN ) ) {
		word =  removeSuffixesStep1( word, r1Index, morphologyDataNN );
	}

	// Remove suffixes step 2
	if ( removeSuffixesStep2( word, r1Index, morphologyDataNN ) ) {
		word =  removeSuffixesStep2( word, r1Index, morphologyDataNN );
	}

	// Remove suffixes step 3
	const suffixes3 = morphologyDataNN.externalStemmer.suffixes3;
	const suffixes3Index = word.search( new RegExp( suffixes3 ) );
	if ( suffixes3Index >= r1Index ) {
		word = word.substring( 0, suffixes3Index );
	}

	return word;
}
