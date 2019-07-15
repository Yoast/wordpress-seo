/**
 * @file Dutch stemming algorithm. Adapted from:
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
	let r1Index = word.search( /[aeiouyèäüëïöáéíóú][^aeiouyèäüëïöáéíóú]/ );
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
 * Doubles the vowel in stems that belong to words that have two stems: one with single vowel, one with double vowel.
 * If the stem with the single vowel is found, the vowel should be doubled.
 *
 * @param {string} word The stem that should have the vowel doubled
 * @returns {string} The stem with the vowel doubled
 */
const doubleVowel = function( word ) {
	const stemEndingIndex = word.search( /([^aeoiyèäüëïöáéíóú])([aeou])([^aeoiyèäüëïöáéíóúI])$/ );
	if ( stemEndingIndex !== -1 ) {
		const letterPrecedingStemEnding = word.charAt( word.length - 4 );
		const firstLetterStemEnding = word.charAt( word.length - 3 );
		if ( letterPrecedingStemEnding !== firstLetterStemEnding ) {
			word = word.replace( /(a)(.)$/g, "aa$2" );
			word = word.replace( /(e)(.)$/g, "ee$2" );
			word = word.replace( /(o)(.)$/g, "oo$2" );
			word = word.replace( /(u)(.)$/g, "uu$2" );
		}
	}
	return word;
};

/**
 * Undoubles consonant if found at the end of the stem. For words that double the consonant to create some forms, we
 * always want to get a unique stem - the one with single consonant.
 *
 * @param {string} word The stem that should have the consonant undoubled
 * @returns {string} The stem with the undoubled consonant
 */
const undoubleConsonant = function( word ) {
	word = word.replace( /bb$/g, "b" );
	word = word.replace( /dd$/g, "d" );
	word = word.replace( /ff$/g, "f" );
	word = word.replace( /gg$/g, "g" );
	word = word.replace( /kk$/g, "k" );
	word = word.replace( /ll$/g, "l" );
	word = word.replace( /mm$/g, "m" );
	word = word.replace( /nn$/g, "n" );
	word = word.replace( /pp$/g, "p" );
	word = word.replace( /rr$/g, "r" );
	word = word.replace( /ss$/g, "s" );
	word = word.replace( /tt$/g, "t" );

	return word;
};

/*
The array contains objects with regexes used to find the suffixes to be removed in the first step. This includes verb,
noun, and adjective suffixes, apart from diminutive suffixes, present participle, and positive inflected adjective suffixes
(those are deleted in subsequent steps).

Each object contains:
- a name used to identify the suffix index
- the regex used to find the suffix. The last capturing group of the regex is the suffix. Anything that precedes it is
	not part of the suffix, but the character(s) that need(s) to precede the suffix in order for it to be removed.
- the index where the regex is matched
- the number of characters that precede the suffix

*/

const suffixes1 = [
	{
		indexName: "a1Index",
		regex: /heden$/g,
		foundRegexIndex: -1,
		charactersBeforeSuffix: 0,
	},
	{
		indexName: "b1Index",
		regex: /([^aeoiyèäüëïöáéíóú])(en|ene)$/g,
		foundRegexIndex: -1,
		charactersBeforeSuffix: 1,
	},
	{
		indexName: "c1Index",
		regex: /([aeoiyèäüëïöáéíóú]i)(en)$/g,
		foundRegexIndex: -1,
		charactersBeforeSuffix: 2,
	},
	{
		indexName: "d1Index",
		regex: /([aeoiu])(ën)$/g,
		foundRegexIndex: -1,
		charactersBeforeSuffix: 1,
	},
	{
		indexName: "e1Index",
		regex: /(je)(s)$/g,
		foundRegexIndex: -1,
		charactersBeforeSuffix: 2,
	},
	{
		indexName: "f1Index",
		regex: /((ch)|(sh))(es)$/g,
		foundRegexIndex: -1,
		charactersBeforeSuffix: 2,
	},
	{
		indexName: "g1Index",
		regex: /(eerd)(er|ere|ers)$/g,
		foundRegexIndex: -1,
		charactersBeforeSuffix: 4,
	},
	{
		indexName: "h1Index",
		regex: /(r)(der|dere|ders)$/g,
		foundRegexIndex: -1,
		charactersBeforeSuffix: 1,
	},
	{
		indexName: "i1Index",
		regex: /([rfgjklmnptvz])(er|ere|ers)$/g,
		foundRegexIndex: -1,
		charactersBeforeSuffix: 1,
	},
	{
		indexName: "j1Index",
		regex: /(sch)(er|ere|ers)$/g,
		foundRegexIndex: -1,
		charactersBeforeSuffix: 3,
	},
	{
		indexName: "k1Index",
		regex: /([^r]d)(er|ere|ers)$/g,
		foundRegexIndex: -1,
		charactersBeforeSuffix: 2,
	},
	{
		indexName: "l1Index",
		regex: /([eoué]e)(ër|ëre|ërs)$/g,
		foundRegexIndex: -1,
		charactersBeforeSuffix: 2,
	},
	{
		indexName: "m1Index",
		regex: /(ied|ïed)(st|ste)$/g,
		foundRegexIndex: -1,
		charactersBeforeSuffix: 3,
	},
	{
		indexName: "n1Index",
		regex: /([drfgjklmnpt])(st|ste)$/g,
		foundRegexIndex: -1,
		charactersBeforeSuffix: 1,
	},
	{
		indexName: "o1Index",
		regex: /(sch)(st|ste)$/g,
		foundRegexIndex: -1,
		charactersBeforeSuffix: 3,
	},
	{
		indexName: "p1Index",
		regex: /([eoué]e)(st|ste)$/g,
		foundRegexIndex: -1,
		charactersBeforeSuffix: 2,
	},
	{
		indexName: "q1Index",
		regex: /([oa]I)(est|este)$/g,
		foundRegexIndex: -1,
		charactersBeforeSuffix: 2,
	},
	{
		indexName: "r1Index",
		regex: /([oa]I)(er|ere|ers)$/g,
		foundRegexIndex: -1,
		charactersBeforeSuffix: 2,
	},
	{
		indexName: "s1Index",
		regex: /([^aeoiuyèäüëïöáéíóúj])(s|se)$/g,
		foundRegexIndex: -1,
		charactersBeforeSuffix: 1,
	},

];

/**
 * Search for word suffixes using the regexes specified in the suffixes1 array.
 * When there is a match, change the value of foundRegexIndex to the index where the regex was matched.
 *
 * @param {string} word		The word to check for suffixes.
 * @returns {void}
 */
const findSuffixesStep1 = function( word ) {
	for ( const suffix of suffixes1 ) {
		suffix.foundRegexIndex = word.search( suffix.regex );
	}
};

/**
 * Adjust the index so that it excludes the characters preceding the suffix.
 * @returns {void}
 */
const adjustSuffixIndex1 = function() {
	for ( const suffix of suffixes1 ) {
		if ( suffix.foundRegexIndex !== -1 )  {
			suffix.foundRegexIndex = suffix.foundRegexIndex + suffix.charactersBeforeSuffix;
		}
	}
};

/**
 * Returns the index and index name of the first suffix that is matched in the array.
 * @returns {{index1: number, indexName1: string}}	The index of the suffix and the name of the index.
 */
const determineSuffixToDelete1 = function() {
	for ( const suffix of suffixes1 ) {
		const index1 = suffix.foundRegexIndex;
		const indexName1 = suffix.indexName;
		if ( index1 !== -1 ) {
			return { index1: index1, indexName1: indexName1 };
		}
	}
	return { index1: 10000, indexName1: "" };
};

/*
The array contains objects with regexes used to find the suffixes to be removed in the second step. These are all
diminutive noun suffixes.

Each object contains:
- a name used to identify the suffix index
- the regex used to find the suffix. The last capturing group of the regex is the suffix. Anything that precedes it is
	not part of the suffix, but the character(s) that need(s) to precede the suffix in order for it to be removed.
- the index where the regex is matched
- the number of characters that precede the suffix

*/

const suffixes2 = [
	{
		indexName: "a2Index",
		regex: /(ing)etje$/g,
		foundRegexIndex: -1,
		charactersBeforeSuffix: 3,
	},
	{
		indexName: "b2Index",
		regex: /(rr|ll|nn|mm)etje$/g,
		foundRegexIndex: -1,
		charactersBeforeSuffix: 2,
	},
	{
		indexName: "c2Index",
		regex: /'tje$/g,
		foundRegexIndex: -1,
		charactersBeforeSuffix: 0,
	},
	{
		indexName: "d2Index",
		regex: /(w)tje$/g,
		foundRegexIndex: -1,
		charactersBeforeSuffix: 1,
	},
	{
		indexName: "e2Index",
		regex: /(ector|actor)tje$/g,
		foundRegexIndex: -1,
		charactersBeforeSuffix: 5,
	},
	{
		indexName: "f2Index",
		regex: /(ator)tje$/g,
		foundRegexIndex: -1,
		charactersBeforeSuffix: 4,
	},
	{
		indexName: "g2Index",
		regex: /(aa|oo|uu)(i)tje$/g,
		foundRegexIndex: -1,
		charactersBeforeSuffix: 2,
	},
	{
		indexName: "h2Index",
		regex: /(lm|rm|em|um)pje$/g,
		foundRegexIndex: -1,
		charactersBeforeSuffix: 2,
	},
	{
		indexName: "i2Index",
		regex: /(aam|oom|uum|eem)pje$/g,
		foundRegexIndex: -1,
		charactersBeforeSuffix: 3,
	},
	{
		indexName: "j2Index",
		regex: /([bcdfgkpstvxz])je$/g,
		foundRegexIndex: -1,
		charactersBeforeSuffix: 1,
	},
	{
		indexName: "k2Index",
		regex: /(ch)je$/g,
		foundRegexIndex: -1,
		charactersBeforeSuffix: 2,
	},
];

/**
 * Search for word suffixes using the regexes specified in the suffixes2 array.
 * When there is a match, change the value of foundRegexIndex to the index where the regex was matched.
 *
 * @param {string} word		The word to check for suffixes.
 * @returns {void}
 */
const findSuffixesStep2 = function( word ) {
	for ( const suffix of suffixes2 ) {
		suffix.foundRegexIndex = word.search( suffix.regex );
	}
};

/**
 * Adjust the index so that it excludes the characters preceding the suffix.
 * @returns {void}
 */
const adjustSuffixIndex2 = function() {
	for ( const suffix of suffixes2 ) {
		if ( suffix.foundRegexIndex !== -1 )  {
			suffix.foundRegexIndex = suffix.foundRegexIndex + suffix.charactersBeforeSuffix;
		}
	}
};

/**
 * Returns the index and index name of the first suffix that is matched in the array.
 * @returns {{index2: number, indexName2: string}}	The index of the suffix and the name of the index.
 */
const determineSuffixToDelete2 = function() {
	for ( const suffix of suffixes2 ) {
		const index2 = suffix.foundRegexIndex;
		const indexName2 = suffix.indexName;
		if ( index2 !== -1 ) {
			return { index2: index2, indexName2: indexName2 };
		}
	}
	return { index2: 10000, indexName2: "" };
};

/*
The array contains objects with regexes used to find the suffixes to be removed in the last step. These are present
participle (-end/-ende) and inflected adjective (-e/ë) suffixes.

Each object contains:
- a name used to identify the suffix index
- the regex used to find the suffix. The last capturing group of the regex is the suffix. Anything that precedes it is
	not part of the suffix, but the character(s) that need(s) to precede the suffix in order for it to be removed.
- the index where the regex is matched
- the number of characters that precede the suffix

*/
const suffixes3 = [
	{
		indexName: "a3Index",
		regex: /([^aeoiuyèäüëïöáéíóú])(end|ende)$/g,
		foundRegexIndex: -1,
		charactersBeforeSuffix: 1,
	},
	{
		indexName: "b3Index",
		regex: /([aeoiuyèäüëïöáéíóú]i)(end|ende)$/g,
		foundRegexIndex: -1,
		charactersBeforeSuffix: 2,
	},
	{
		indexName: "c3Index",
		regex: /[^aoeiuyèäüëïöáéíóú]e$/g,
		foundRegexIndex: -1,
		charactersBeforeSuffix: 1,
	},
	{
		indexName: "d3Index",
		regex: /([aoeiu]e)ë$/g,
		foundRegexIndex: -1,
		charactersBeforeSuffix: 2,
	},
];

/**
 * Search for word suffixes using the regexes specified in the suffixes3 array.
 * When there is a match, change the value of foundRegexIndex to the index where the regex was matched.
 *
 * @param {string} word		The word to check for suffixes.
 * @returns {void}
 */
const findSuffixesStep3 = function( word ) {
	for ( const suffix of suffixes3 ) {
		suffix.foundRegexIndex = word.search( suffix.regex );
	}
};

/**
 * Adjust the index so that it excludes the characters preceding the suffix.
 * @returns {void}
 */
const adjustSuffixIndex3 = function() {
	for ( const suffix of suffixes3 ) {
		if ( suffix.foundRegexIndex !== -1 )  {
			suffix.foundRegexIndex = suffix.foundRegexIndex + suffix.charactersBeforeSuffix;
		}
	}
};

/**
 * Returns the index of the first suffix that is matched in the array.
 * @returns {number} index3		The index of the suffix and the name of the index.
 */
const determineSuffixToDelete3 = function() {
	for ( const suffix of suffixes3 ) {
		const index3 = suffix.foundRegexIndex;
		const indexName3 = suffix.indexName;
		if ( index3 !== -1 ) {
			return { index3: index3, indexName3: indexName3 };
		}
	}
	return { index3: 10000, indexName3: "" };
};

/**
 * If the -heden suffix was found in R1, replace it with -heid. If another suffix was found in R1, delete it.
 * (The letter of the characters preceding the suffix are not necessarily in R1.)
 *
 * If a suffix which is preceded by a single vowel in words that have two stems (one with single vowel and one with double vowel)
 * is found, double the vowel if the stem ending matches the pattern specified in the doubleVowel function.
 *
 * If a superlative adjective ending in -iedst/ïedst is found, after stemming -st replaced the -ied/ïed with -id/ïde.
 *
 * @param {string} word         The word for which to delete the suffix.
 * @param {number} index1       The index of the suffix that was found.
 * @param {string} indexName1   The type of suffix that was found.
 * @param {number} r1Index      The R1 index.
 *
 * @returns {string} The word with the deleted suffix.
 */
const deleteSuffix1 = function( word, index1, indexName1, r1Index ) {
	if ( index1 !== 10000 && r1Index !== -1 ) {
		if ( index1 >= r1Index ) {
			if ( indexName1 === "a1Index" ) {
				word = word.replace( /(.*)heden$/g, "$1heid" );
			} else {
				word = word.substring( 0, index1 );
			}
			if ( indexName1 === "b1Index" || indexName1 === "i1Index" || indexName1 === "k1Index" ) {
				word = doubleVowel( word );
			} else if ( indexName1 === "m1Index" ) {
				word = word.replace( /ied$/g, "id" );
				word = word.replace( /ïed$/g, "ïd" );
			}
		}
	}
	return word;
};

/**
 *
 * If the -je suffix was found in R1 and preceded by -ink, replace the -k with -g in the stemmed word.
 * If another suffix was found in R1, delete it.
 * (The letter of the characters preceding the suffix are not necessarily in R1.)
 *
 * @param {string} word		The word for which to delete the suffix.
 * @param {number} index2	The index of the suffix that was found.
 * @param {string} indexName2	The type of suffix that was found.
 * @param {number} r1Index		The R1 index.
 *
 * @returns {string} The word with the deleted suffix.
 */
const deleteSuffix2 = function( word, index2, indexName2, r1Index ) {
	if ( index2 !== 10000 && r1Index !== -1 ) {
		if ( index2 >= r1Index ) {
			word = word.substring( 0, index2 );
			if ( indexName2 === "j2Index" ) {
				word = word.replace( /(.*)ink$/g, "$1ing" );
			}
		}
	}
	return word;
};

/**
 *
 * Delete the suffix if found in R1.
 * (The letter of the characters preceding the suffix are not necessarily in R1.)
 *
 * @param {string} word		The word to delete the suffix from.
 * @param {number} index3	The index of the suffix.
 * @param {string} indexName3 The name of the index.
 * @param {number} r1Index 	The R1 index.
 * @returns {string} word 	The word with the deleted suffix.
 */
const deleteSuffix3 = function( word, index3, indexName3, r1Index ) {
	if ( index3 !== 10000 && r1Index !== -1 ) {
		if ( index3 >= r1Index ) {
			word = word.substring( 0, index3 );
			if ( indexName3 === "a3Index" || indexName3 === "c3Index" ) {
				word = doubleVowel( word );
			}
		}
	}
	return word;
};

/**
 * Stems Dutch words.
 *
 * @param {string} word  The word to stem.
 *
 * @returns {string} The stemmed word.
 */
export default function stem( word ) {
	// Put i and e in between vowels, initial y, and y after a vowel into upper case.
	word = word.replace( /([aeiouyèäüëïöáéíóú])i([aeiouyèäüëïöáéíóú])/g, "$1I$2" );
	word = word.replace( /^y(.*)/g, "$1Y$2" );
	word = word.replace( /([aeiouyèäüëïöáéíóú])y(.*)/g, "$1Y$2" );

	// Find the start index of the R1 region.
	const r1Index = determineR1( word );

	// Find suffix as defined in step 1.
	findSuffixesStep1( word );
	adjustSuffixIndex1();
	const index1 = determineSuffixToDelete1().index1;
	const indexName1 = determineSuffixToDelete1().indexName1;

	// Delete suffix found in step 1.
	word = deleteSuffix1( word, index1, indexName1, r1Index );

	// Find suffix as defined in step 2.
	findSuffixesStep2( word );
	adjustSuffixIndex2();
	const index2 = determineSuffixToDelete2().index2;
	const indexName2 = determineSuffixToDelete2().indexName2;

	// Delete suffix found in step 2.
	word = deleteSuffix2( word, index2, indexName2, r1Index );

	// Find suffix as defined in step 3.
	findSuffixesStep3( word );
	adjustSuffixIndex3();
	const index3 = determineSuffixToDelete3().index3;
	const indexName3 = determineSuffixToDelete3().indexName3;

	// Delete suffix found in step 3.
	word = deleteSuffix3( word, index3, indexName3, r1Index );

	// Undouble consonant
	word = undoubleConsonant( word );

	// If stem ends in v, replace it with f. If stem ends in z, replace it with s.
	word = word.replace( /v$/g, "f" );
	word = word.replace( /z$/g, "s" );

	// If stem ends with -iël, replace it wth -ieel.
	word = word.replace( /iël$/g, "ieel" );

	// Turn I and Y back into lower case.
	word = word.replace( /I/g, "i" );
	word = word.replace( /Y/g, "y" );

	// Remove apostrophe
	word = word.replace( /(.*)(')$/g, "$1" );

	return word;
}
