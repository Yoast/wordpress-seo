/*
 * Stem function adapted from:
 * Author: Joder Illi
 *
 * Copyright (c) 2010, FormBlitz AG
 * All rights reserved.
 * Implementation of the stemming algorithm from http://snowball.tartarus.org/algorithms/german/stemmer.html
 * Copyright of the algorithm is: Copyright (c) 2001, Dr Martin Porter and can be found at http://snowball.tartarus.org/license.php
 *
 * Redistribution and use in source and binary forms, with or without modification, is covered by the standard BSD license.
 *
 */
/**
 * Stems German words.
 * @param {string} word The word to stem.
 * @returns {string} The stemmed word.
 */
export default function stem( word ) {
	/*
	German includes the following accented forms,
	ä   ö   ü
	and a special letter, ß, equivalent to double s.
	The following letters are vowels:
	a   e   i   o   u   y   ä   ö   ü
	*/
	/*
	Put u and y between vowels into upper case
	*/
	word = word.replace( /([aeiouyäöü])u([aeiouyäöü])/g, "$1U$2" );
	word = word.replace( /([aeiouyäöü])y([aeiouyäöü])/g, "$1Y$2" );
	const r1Index = word.search( /[aeiouyäöü][^aeiouyäöü]/ );

	/*
	Define a valid s-ending as one of b, d, f, g, h, k, l, m, n, r or t.
	Define a valid st-ending as the same list, excluding letter r.
	*/

	/*
	Do each of steps 1, 2 and 3.
	*/

	/*
	Step 1:
	Search for the longest among the following suffixes,
	(a) em   ern   er
	(b) e   en   es
	(c) s (preceded by a valid s-ending)
	*/
	const a1Index = word.search( /(em|ern|er)$/g );
	const b1Index = word.search( /(e|en|es)$/g );
	let c1Index = word.search( /([bdfghklmnrt]s)$/g );
	if ( c1Index !== -1 ) {
		c1Index++;
	}
	let index1 = 10000;
	let optionUsed1 = "";
	if ( a1Index !== -1 && a1Index < index1 ) {
		optionUsed1 = "a";
		index1 = a1Index;
	}
	if ( b1Index !== -1 && b1Index < index1 ) {
		optionUsed1 = "b";
		index1 = b1Index;
	}
	if ( c1Index !== -1 && c1Index < index1 ) {
		optionUsed1 = "c";
		index1 = c1Index;
	}

	/*
	 * And delete if in R1. (Of course the letter of the valid s-ending is not necessarily in R1.)
	 * If an ending of group (b) is deleted, and the ending is preceded by niss, delete the final s.
	 * (For example, äckern -> äck, ackers -> acker, armes -> arm, bedürfnissen -> bedürfnis).
	 */
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

	/*
	 * Step 2:
	 * Search for the longest among the following suffixes,
	 * (a) en   er   est
	 * (b) st (preceded by a valid st-ending, itself preceded by at least 3 letters)
	 */
	const a2Index = word.search( /(en|er|est)$/g );
	let b2Index = word.search( /(.{3}[bdfghklmnt]st)$/g );
	if ( b2Index !== -1 ) {
		b2Index += 4;
	}

	let index2 = 10000;
	if ( a2Index !== -1 && a2Index < index2 ) {
		index2 = a2Index;
	}
	if ( b2Index !== -1 && b2Index < index2 ) {
		index2 = b2Index;
	}

	/*
	 * And delete if in R1. (For example, derbsten -> derbst by step 1, and derbst -> derb by step 2,
	 * since b is a valid st-ending, and is preceded by just 3 letters).
	 */
	if ( index2 !== 10000 && r1Index !== -1 ) {
		if ( index2 >= r1Index ) {
			word = word.substring( 0, index2 );
		}
	}

	/*
	Finally,
	turn U and Y back into lower case.
	*/
	word = word.replace( /U/g, "u" );
	word = word.replace( /Y/g, "y" );

	return word;
}
