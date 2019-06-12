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
 * Search for the longest among the following suffixes,
 * (a) heden
 * (b) en   ene (preceded by a valid en-ending)
 * (c) s	se (preceded by a valid s-ending)
 * Define a valid en-ending as a non-vowel and not gem
 * Define a valid s-ending as a non-vowel other than j
 *
 * @param {string} word The word to check for the suffix.
 * @returns {{index1: number, optionUsed1: string}} The index of the suffix and the kind of suffix used.
 */
const findSuffixStep1 = function( word ) {
	const a1Index = word.search( /heden$/g );
	let b1Index = word.search( /([^aeoiuyèäüëïöáéíóú]|(g[^e]m)|([^g]em))(en|ene)$/g );
	let c1Index = word.search( /([^aeoiuyèäüëïöáéíóúj]|je)(s|se)$/g );
	// Exclude the -en and -s endings.
	if ( b1Index !== -1 ) {
		b1Index++;
	}
	if ( c1Index !== -1 ) {
		c1Index++;
	}

	let optionUsed = "";
	let index1 = 10000;
	if ( a1Index !== -1 ) {
		optionUsed = "a";
		index1 = a1Index;

		return { index1, optionUsed };
	} else if ( b1Index !== -1 ) {
		optionUsed = "b";
		index1 = b1Index;

		return { index1, optionUsed };
	} else if ( c1Index !== -1 ) {
		optionUsed = "c";
		index1 = c1Index;

		return { index1, optionUsed };
	}

	return { index1, optionUsed };
};

/**
 * Finds the different types of diminutive suffixes.
 *
 * @param {string} word		The word to find the suffix for.
 * @returns {{index2: number, optionUsed2: string}} The index of the suffix and the kind of suffix used.
 */
const findSuffixStep2 = function( word ) {
	let a2Index = word.search( /(ing)etje$/g );
	const b2Index = word.search( /'tje$/g );
	let c2Index = word.search( /(w)tje$/g );
	let d2Index = word.search( /(ector|actor)tje$/g );
	let e2Index = word.search( /(ator)tje$/g );
	let f2Index = word.search( /(lm|rm|em|um)pje$/g );
	let g2Index = word.search( /(aam|oom|uum|eem)pje$/g );
	let h2Index = word.search( /([bcdfgkpstvxz])je$/g );
	let i2Index = word.search( /(ch)je$/g );

	// Exclude the preceding endings.
	if ( a2Index !== -1 ) {
		a2Index += 3;
	}
	if ( c2Index !== -1 ) {
		c2Index++;
	}
	if ( d2Index !== -1 ) {
		d2Index += 5;
	}
	if ( e2Index !== -1 ) {
		e2Index += 4;
	}
	if ( f2Index !== -1 ) {
		f2Index += 2;
	}
	if ( g2Index !== -1 ) {
		g2Index += 3;
	}
	if ( h2Index !== -1 ) {
		h2Index++;
	}
	if ( i2Index !== -1 ) {
		i2Index += 2;
	}

	let optionUsed2 = "";
	let index2 = 10000;
	if ( a2Index !== -1 ) {
		optionUsed2 = "a";
		index2 = a2Index;

		return { index2, optionUsed2 };
	} else if ( b2Index !== -1 ) {
		optionUsed2 = "b";
		index2 = b2Index;

		return { index2, optionUsed2 };
	} else if ( c2Index !== -1 ) {
		optionUsed2 = "c";
		index2 = c2Index;

		return { index2, optionUsed2 };
	} else if ( d2Index !== -1 ) {
		optionUsed2 = "d";
		index2 = d2Index;

		return { index2, optionUsed2 };
	} else if ( e2Index !== -1 ) {
		optionUsed2 = "e";
		index2 = e2Index;

		return { index2, optionUsed2 };
	} else if ( f2Index !== -1 ) {
		optionUsed2 = "f";
		index2 = f2Index;

		return { index2, optionUsed2 };
	} else if ( g2Index !== -1 ) {
		optionUsed2 = "g";
		index2 = g2Index;

		return { index2, optionUsed2 };
	} else if ( h2Index !== -1 ) {
		optionUsed2 = "h";
		index2 = h2Index;

		return { index2, optionUsed2 };
	} else if ( i2Index !== -1 ) {
		optionUsed2 = "i";
		index2 = i2Index;

		return { index2, optionUsed2 };
	}
	return { index2, optionUsed2 };
};


/**
 * Finds the suffix -e if preceded by a valid -e ending (non-vowel).
 *
 * @param {string} word		The word to find the suffix for.
 * @returns {number} index3 	The index of the suffix.
 */
const findSuffixStep3 = function( word ) {
	let index3 = word.search( /[^aoeiuyèäüëïöáéíóú]e$/ );
	// Exclude the -e ending.
	if ( index3 !== -1 ) {
		index3++;

		return index3;
	}

	return index3;
};


/**
 * If the -heden suffix was found in R1, replace it with -heid. If another suffix was found in R1, delete it.
 * (The letter of the valid -s or -en ending is not necessarily in R1.)
 *
 * @param {string} word         The word for which to delete the suffix.
 * @param {number} index1       The index of the suffix that was found.
 * @param {string} optionUsed   The type of suffix that was found.
 * @param {number} r1Index      The R1 index.
 *
 * @returns {string} The word with the deleted suffix.
 */
const deleteSuffix1 = function( word, index1, optionUsed, r1Index ) {
	if ( index1 !== 10000 && r1Index !== -1 ) {
		if ( index1 >= r1Index ) {
			if ( optionUsed === "a" ) {
				word = word.replace( /(.*)heden$/g, "$1heid" );

				return word;
			} else if ( optionUsed === "b" || optionUsed === "c" ) {
				word = word.substring( 0, index1 );
			}
		}
	}
	return word;
};

/**
 *
 * If the -je suffix was found in R1 and preceded by -ink, replace the -k with -g in the stemmed word.
 * If another suffix was found in R1, delete it.
 *
 * @param {string} word		The word for which to delete the suffix.
 * @param {number} index2	The index of the suffix that was found.
 * @param {string} optionUsed2	The type of suffix that was found.
 * @param {number} r1Index		The R1 index.
 *
 * @returns {string} The word with the deleted suffix.
 */
const deleteSuffix2 = function( word, index2, optionUsed2, r1Index ) {
	if ( index2 !== 10000 && r1Index !== -1 ) {
		if ( index2 >= r1Index ) {
			word = word.substring( 0, index2 );
			if ( optionUsed2 === "h" ) {
				word = word.replace( /(.*)ink$/g, "$1ing" );
			}
		}
	}
	return word;
};

/**
 *
 * @param {string} word		The word to delete the suffix from.
 * @param {number} index3	The index of the suffix.
 * @param {number} r1Index 	The R1 index.
 * @returns {string} word 	The word with the deleted suffix.
 */
const deleteSuffix3 = function( word, index3, r1Index ) {
	if ( index3 !== 10000 && r1Index !== -1 ) {
		if ( index3 >= r1Index ) {
			word = word.substring( 0, word.length - 1 );
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
	// Put i in between vowels, initial y, and y after a vowel into upper case.
	word = word.replace( /([aeiouyèäüëïöáéíóú])i([aeiouyèäüëïöáéíóú])/g, "$1I$2" );
	word = word.replace( /^y(.*)/g, "$1Y$2" );
	word = word.replace( /([aeiouyèäüëïöáéíóú])y(.*)/g, "$1Y$2" );

	// Find the start index of the R1 region.
	const r1Index = determineR1( word );

	// Find suffix as defined in step 1.
	const index1 = findSuffixStep1( word ).index1;
	const optionUsed = findSuffixStep1( word ).optionUsed;

	// Delete suffix found in step 1.
	word = deleteSuffix1( word, index1, optionUsed, r1Index );

	// Find suffix as defined in step 2.
	const index2 = findSuffixStep2( word ).index2;
	const optionUsed2 = findSuffixStep2( word ).optionUsed2;

	// Delete suffix found in step 2.
	word = deleteSuffix2( word, index2, optionUsed2, r1Index );

	// Find suffix as defined in step 3.
	const index3 = findSuffixStep3( word );

	// Delete suffix found in step 3.
	word = deleteSuffix3( word, index3, r1Index );

	// Undouble stem ending.
	word = word.replace( /(.*)tt$/g, "$1t" );
	word = word.replace( /(.*)kk$/g, "$1k" );
	word = word.replace( /(.*)dd$/g, "$1d" );

	// Undouble vowel
	word = word.replace( /([^aeiouyèäüëïöáéíóú])(aa)([^aeiouyèäüëïöáéíóúI])$/g, "$1a$3" );
	word = word.replace( /([^aeiouyèäüëïöáéíóú])(ee)([^aeiouyèäüëïöáéíóúI])$/g, "$1e$3" );
	word = word.replace( /([^aeiouyèäüëïöáéíóú])(oo)([^aeiouyèäüëïöáéíóúI])$/g, "$1o$3" );
	word = word.replace( /([^aeiouyèäüëïöáéíóú])(uu)([^aeiouyèäüëïöáéíóúI])$/g, "$1u$3" );

	// Turn I and Y back into lower case.
	word = word.replace( /I/g, "i" );
	word = word.replace( /Y/g, "y" );

	return word;
}
