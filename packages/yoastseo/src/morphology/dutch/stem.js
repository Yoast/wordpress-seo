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
 * Searches for suffixes in a word.
 *
 * @param {string} word 	The word in which to look for suffixes.
 * @param {string} suffixStep	 One of the three steps of findings suffixes.
 * @param {number} r1Index	 The index of the R1 region.
 * @returns {object} The index of the suffix and extra information about whether, and how, the stem will need to be modified.
 */
const findSuffix = function( word, suffixStep, r1Index ) {
	for ( const suffixClass in suffixStep ) {
		if ( suffixStep.hasOwnProperty( suffixClass ) ) {
			const suffixes = suffixStep[ suffixClass ].suffixes;

			const matchedRegex = suffixes.find( suffixRegex => new RegExp( suffixRegex ).exec( word ) );

			if ( matchedRegex ) {
				const matched = new RegExp( matchedRegex ).exec( word );
				const suffix = matched[ matched.length - 1 ];
				const suffixIndex = word.lastIndexOf( suffix );

				if ( suffixIndex >= r1Index ) {
					return {
						suffixIndex: suffixIndex,
						stemModification: ( suffixStep[ suffixClass ].stemModification ),
					};
				}
			}
		}
	}
};

/**
 * Modifies the stem of the word according to the specified modification type.
 *
 * @param {string} word The stem that needs to be modified.
 * @param {string} modificationGroup The type of modification that needs to be done.
 * @returns {string} The modified stem, or the same stem if no modification was made.
 */
const modifyStem = function( word, modificationGroup ) {
	const neededReplacement = modificationGroup.find( replacement => word.search( new RegExp( replacement[ 0 ] ) ) !== -1 );
	if ( typeof neededReplacement !== "undefined" ) {
		word = word.replace( new RegExp( neededReplacement[ 0 ] ), neededReplacement[ 1 ] );
		return word;
	} return word;
};

/**
 * Check whether the third to last and fourth to last characters are the same. If they are, then the doubling vowel
 * modification should be skipped.
 *
 * @param {string} word The stemmed word that the check should be executed on.
 * @returns {boolean} Whether the third and fourth to last characters are the same.
 */
const doubleLetterCheck = function( word ) {
	const fourthToLastLetter = word.charAt( word.length - 4 );
	const thirdToLastLetter = word.charAt( word.length - 3 );
	return ( fourthToLastLetter === thirdToLastLetter );
};

/**
 * Deletes the suffix and modifies the stem according to the required modifications.
 *
 * @param {string} word	 The word from which to delete the suffix.
 * @param {string} suffixStep 	One of the three steps of deleting a suffix.
 * @param {number} suffixIndex	 The index of the found suffix.
 * @param {array} stemModification 	The type of stem modification that needs to be done.
 * @param {object} morphologyDataNL	 The Dutch morphology data file.
 * @returns {word} The stemmed and modified word.
 */
const deleteSuffixAndModifyStem = function( word, suffixStep, suffixIndex, stemModification, morphologyDataNL ) {
	if ( String( stemModification ) === "hedenToHeid" ) {
		word = modifyStem( word, morphologyDataNL.stemming.stemModifications.hedenToHeid );
		return word;
	} word = word.substring( 0, suffixIndex );
	if ( String( stemModification ) === "changeIedtoId" ) {
		word = modifyStem( word, morphologyDataNL.stemming.stemModifications.iedToId );
		return word;
	} else if ( String( stemModification ) === "changeInktoIng" && word.endsWith( "ink" ) ) {
		word = modifyStem( word, morphologyDataNL.stemming.stemModifications.inkToIng );
		return word;
	} else if ( String( stemModification ) === "vowelDoubling" ) {
		const doubleLetter = doubleLetterCheck( word );
		if ( doubleLetter === false ) {
			word = modifyStem( word, morphologyDataNL.stemming.stemModifications.doubleVowel );
			return word;
		}
	}
	return word;
};


/**
 * Finds and deletes the suffix found in a particular step, and modifies the stem.
 *
 * @param {string} word 	The word for which to find and delete a suffix.
 * @param {string} suffixStep	 One of the three suffix steps.
 * @param {number} r1Index	 The index of the R1 region.
 * @param {object} morphologyDataNL	 The Dutch morphology data file.
 * @returns {string} The word with the deleted suffix.
 */
const findAndDeleteSuffix = function( word, suffixStep, r1Index, morphologyDataNL ) {
	const foundSuffix = findSuffix( word, suffixStep, r1Index );
	if ( typeof foundSuffix !== "undefined" ) {
		word = deleteSuffixAndModifyStem( word, suffixStep, foundSuffix.suffixIndex, foundSuffix.stemModification, morphologyDataNL );
	}

	return word;
};

/**
 * Finds the suffix for each step, and if one is found it deletes it before going to the next step.
 *
 * @param {string} word 	The word for which to find and delete suffixes
 * @param {object} suffixSteps	 All of the suffix steps.
 * @param {number} r1Index	 The index of the R1 region
 * @param {object} morphologyDataNL 	The Dutch morphology data file.
 * @returns {string} The word with the delete suffix.
 */
const findAndDeleteSuffixes = function( word, suffixSteps, r1Index, morphologyDataNL ) {
	for ( const suffixStep in suffixSteps ) {
		if ( suffixSteps.hasOwnProperty( suffixStep ) ) {
			word = findAndDeleteSuffix( word, suffixSteps[ suffixStep ], r1Index, morphologyDataNL );
		}
	}

	return word;
};

/**
 * Stems Dutch words.
 *
 * @param {string} word  The word to stem.
 * @param {object} morphologyDataNL The Dutch morphology data file.
 *
 * @returns {string} The stemmed word.
 */
export default function stem( word, morphologyDataNL ) {
	/** Put i and y in between vowels, initial y, and y after a vowel into upper case. This is because they should
	 * be treated as consonants so we want to differentiate them from others i's and y's when matching regexes.
	 */
	word = modifyStem( word, morphologyDataNL.stemming.stemModifications.IAndYToUppercase );

	// Find the start index of the R1 region.
	const r1Index = determineR1( word );

	// Import the suffixes from all three steps.
	const suffixSteps = morphologyDataNL.stemming.suffixes;

	/** For each of the three steps, look for suffixes and delete it if one is found in the R1 region, as well as apply
	    stem modifications if needed.
	 */
	word = findAndDeleteSuffixes( word, suffixSteps, r1Index, morphologyDataNL );

	// Do final modifications to the stem.
	word = modifyStem( word, morphologyDataNL.stemming.stemModifications.finalChanges );

	return word;
}
