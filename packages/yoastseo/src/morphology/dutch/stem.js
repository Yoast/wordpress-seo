/**
 * @file German stemming algorithm. Adapted from:
 * @author:
 * @copyright
 * All rights reserved.
 * Implementation of the stemming algorithm from http://snowball.tartarus.org/algorithms/dutch/stemmer.html
 * Copyright of the algorithm is: Copyright (c) 2001, Dr Martin Porter and can be found at http://snowball.tartarus.org/license.php
 *
 * Redistribution and use in source and binary forms, with or without modification, is covered by the standard BSD license.
 */
/**
 *
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
 * (a) heden
 * (b) en   ene (preceded by a valid en-ending)
 * (c) s	se (preceded by a valid s-ending)
 * Define a valid en-ending as a non-vowel and not gem
 * Define a valid s-ending as a non-vowel other than j
 *
 * @param {string} word The word to check for the suffix.
 * @returns {{index: number, optionUsed1: string}} The index of the suffix and the kind of suffix used.
 */
const findSuffix = function( word ) {
	const a1Index = word.search( /heden$/g );
	const b1Index = word.search( /([wrtpsdfghjklzxcvbn]|(g[^e]m)|([^g]em))(en|ene)$/g );
	const c1Index = word.search( /[wrtpsdfghklcvbn](s|se)$/g );

	let optionUsed = "";
	let index = 10000;
	if ( a1Index !== -1 ) {
		optionUsed = "a";
		index = a1Index;

		return { index, optionUsed };
	} else if ( b1Index !== -1 ) {
		optionUsed = "b";
		index = b1Index;

		return { index, optionUsed };
	} else if ( c1Index !== -1 ) {
		optionUsed = "c";
		index = c1Index;

		return { index, optionUsed };
	}

	return { index, optionUsed };
};

/**
 * If the -heden suffix was found in R1, replace it with -heid. If another suffix was found in R1, delete it.
 * (The letter of the valid -s or -en ending is not necessarily in R1.)
 * If -e preceded by a non-vowel is found in R1, remove it.
 *
 * @param {string} word         The word for which to delete the suffix.
 * @param {number} index       The index of the suffix that was found.
 * @param {string} optionUsed   The type of suffix that was found.
 * @param {number} r1Index      The R1 index.
 *
 * @returns {string} The word with the deleted suffix.
 */
const deleteSuffixes = function( word, index, optionUsed, r1Index ) {
	if ( index !== 10000 && r1Index !== -1 ) {
		if ( index >= r1Index ) {
			if ( optionUsed === "a" ) {
				word = word.replace( /(.*)heden$/g, "$1heid$2" );
			}
			word = word.substring( 0, index );
			if ( word.search( /[^aeiouyè]e$/ ) !== -1 ) {
				word = word.substring( 0, word.length - 1 );
			}
		}
	}
	return word;
};

/**
 * Stems Dutch words.
 *
 * @param {Object} morphologyDataVerbs  The Dutch morphology data for verbs.
 * @param {string} word                 The word to stem.
 *
 * @returns {string} The stemmed word.
 */
export default function stem( morphologyDataVerbs, word ) {
	// Put i, initial y, and y after a vowel into upper case.
	word = word.replace( /([aeiouyè])i([aeiouyè])/g, "$1I$2" );
	word = word.replace( /^y(.*)/g, "$1Y$2" );
	word = word.replace( /([aeiouyè])y(.*])/g, "$1Y$2" );

	// Replace letters with umlaut or acute accent with non-accented variants
	word = word.replace( "ä", "a" );
	word = word.replace( "ü", "u" );
	word = word.replace( "ë", "e" );
	word = word.replace( "ï", "i" );
	word = word.replace( "ö", "o" );
	word = word.replace( "á", "a" );
	word = word.replace( "é", "e" );
	word = word.replace( "í", "i" );
	word = word.replace( "ó", "o" );
	word = word.replace( "ú", "u" );

	// Find the start index of the R1 region.
	const r1Index = determineR1( word );

	// Find suffixes as defined in step 1.
	const index = findSuffix( word ).index;
	const optionUsed = findSuffix( word ).optionUsed;

	// Delete suffixes.
	word = deleteSuffixes( word, index, optionUsed, r1Index );

	// Undouble stem ending
	word = word.replace( /(.*)tt$/g, "$1t$2" );
	word = word.replace( /(.*)kk$/g, "$1k$2" );
	word = word.replace( /(.*)dd$/g, "$1d$2" );

	return word;
}
