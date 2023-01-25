/**
 * @file German stemming algorithm. Adapted from:
 * @author: Joder Illi
 * @copyright (c) 2010, FormBlitz AG
 * All rights reserved.
 * Implementation of the stemming algorithm from http://snowball.tartarus.org/algorithms/german/stemmer.html
 * Copyright of the algorithm is: Copyright (c) 2001, Dr Martin Porter and can be found at http://snowball.tartarus.org/license.php
 *
 * Redistribution and use in source and binary forms, with or without modification, is covered by the standard BSD license.
 */
/**
 * Determines the start index of the R1 region.
 * R1 is the region after the first non-vowel following a vowel. It should include at least 3 letters.
 *
 * @param {string} word The word for which to determine the R1 region.
 * @returns {number} The start index of the R1 region.
 */
const determineR1 = function( word ) {
	// Start with matching first vowel and non-vowel.
	let r1Index = word.search( /[aeiouyäöü][^aeiouyäöü]/ );
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
 * Search for the longest among the following suffixes,
 * (a) em   ern   er
 * (b) e   en   es
 * (c) s (preceded by a valid s-ending)
 * Define a valid s-ending as one of b, d, f, g, h, k, l, m, n, r or t.
 *
 * @param {string} word The word to check for the suffix.
 * @returns {{index1: number, optionUsed1: string}} The index of the suffix and the kind of suffix used.
 */
const findSuffixStep1 = function( word ) {
	const a1Index = word.search( /(em|ern|er)$/g );
	const b1Index = word.search( /(e|en|es)$/g );
	let c1Index = word.search( /([bdfghklmnrt]s)$/g );
	// Exclude the s-ending before the s.
	if ( c1Index !== -1 ) {
		c1Index++;
	}
	let optionUsed1 = "";
	let index1 = 10000;
	if ( a1Index !== -1 ) {
		optionUsed1 = "a";
		index1 = a1Index;

		return { index1, optionUsed1 };
	} else if ( b1Index !== -1 ) {
		optionUsed1 = "b";
		index1 = b1Index;

		return { index1, optionUsed1 };
	} else if ( c1Index !== -1 ) {
		optionUsed1 = "c";
		index1 = c1Index;

		return { index1, optionUsed1 };
	}

	return { index1, optionUsed1 };
};

/**
 * Search for the longest among the following suffixes,
 * (a) en   er   est
 * (b) st (preceded by a valid st-ending, itself preceded by at least 3 letters)
 * Define a valid st-ending as one of b, d, f, g, h, k, l, m, n or t.
 *
 * @param {string} word The word to check for the suffix.
 * @returns {number} The index of the suffix.
 */
const findSuffixStep2 = function( word ) {
	const a2Index = word.search( /(en|er|est)$/g );
	let b2Index = word.search( /(.{3}[bdfghklmnt]st)$/g );
	// Exclude the st-ending and the preceding 3 letters.
	if ( b2Index !== -1 ) {
		b2Index += 4;
	}
	let index2 = 10000;
	if ( a2Index !== -1 ) {
		index2 = a2Index;
	} else if ( b2Index !== -1  ) {
		index2 = b2Index;
	}

	return index2;
};

/**
 * Delete the suffix found in step 1 if in R1. (The letter of the valid s-ending is not necessarily in R1.)
 * If an ending of group (b) is deleted, and the ending is preceded by niss, delete the final s.
 * (For example, äckern -> äck, ackers -> acker, armes -> arm, bedürfnissen -> bedürfnis).
 *
 * @param {string} word         The word for which to delete the suffix.
 * @param {number} index1       The index of the suffix found in step 1.
 * @param {string} optionUsed1  The type of the suffix found in step 1.
 * @param {number} r1Index      The R1 index.
 *
 * @returns {string} The word with the deleted suffix.
 */
const deleteSuffix1 = function( word, index1, optionUsed1, r1Index ) {
	if ( index1 !== 10000 && r1Index !== -1 ) {
		if ( index1 >= r1Index ) {
			word = word.substring( 0, index1 );
			if ( optionUsed1 === "b" ) {
				if ( word.search( /niss$/ ) !== -1 ) {
					word = word.substring( 0, word.length - 1 );
				}
			}
		}
	}
	return word;
};

/**
 * Delete the suffix found in step 2 if in R1.
 * (For example, derbsten -> derbst by step 1, and derbst -> derb by step 2,
 * since b is a valid st-ending, and is preceded by just 3 letters).
 *
 * @param {string} word     The word for which to delete the suffix.
 * @param {number} index2   The index of the suffix found in step 2.
 * @param {number} r1Index  The R1 index.
 *
 * @returns {string} The word with the deleted suffix.
 */
const deleteSuffix2 = function( word, index2, r1Index ) {
	if ( index2 !== 10000 && r1Index !== -1 ) {
		if ( index2 >= r1Index ) {
			word = word.substring( 0, index2 );
		}
	}
	return word;
};


/**
 * Stems irregular verbs.
 *
 * @param {Object} morphologyDataVerbs  The German morphology data for verbs.
 * @param {string} word                 The word to stem.
 *
 * @returns {string} The stemmed word.
 */
const stemIrregularVerbs = function( morphologyDataVerbs, word ) {
	const irregularVerbs = morphologyDataVerbs.veryIrregularVerbs;

	const matchedParadigm = irregularVerbs.find( paradigm => {
		const forms = paradigm.forms;
		return forms.includes( word );
	} );

	if ( matchedParadigm ) {
		return matchedParadigm.stem;
	}

	return null;
};

/**
 * Stems German words.
 *
 * @param {Object} morphologyDataVerbs  The German morphology data for verbs.
 * @param {string} word                 The word to stem.
 *
 * @returns {string} The stemmed word.
 */
export default function stem( morphologyDataVerbs, word ) {
	// Check if word is a very irregular verb, and if so, return its stem.
	const veryIrregularVerbStem = stemIrregularVerbs( morphologyDataVerbs, word );

	if ( veryIrregularVerbStem ) {
		return veryIrregularVerbStem;
	}

	// Put u and y between vowels into upper case.
	word = word.replace( /([aeiouyäöü])u([aeiouyäöü])/g, "$1U$2" );
	word = word.replace( /([aeiouyäöü])y([aeiouyäöü])/g, "$1Y$2" );
	word = word.replace( /([aeiouyäöü])i([aeiouyäöü])/g, "$1I$2" );
	word = word.replace( /([aeiouyäöü])e([aeiouyäöü])/g, "$1E$2" );

	// Find the start index of the R1 region.
	const r1Index = determineR1( word );

	// Find suffixes as defined in step 1.
	const index1 = findSuffixStep1( word ).index1;
	const optionUsed1 = findSuffixStep1( word ).optionUsed1;

	// Delete the suffix found in step 1.
	word = deleteSuffix1( word, index1, optionUsed1, r1Index );

	// Find suffixes as defined in step 2.
	const index2 = findSuffixStep2( word );

	// Delete the suffix found in step 2.
	word = deleteSuffix2( word, index2, r1Index );

	// Turn U and Y back into lower case.
	word = word.replace( /U/g, "u" );
	word = word.replace( /Y/g, "y" );
	word = word.replace( /I/g, "i" );
	word = word.replace( /E/g, "e" );

	return word;
}
