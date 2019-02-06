import { addAllAdjectiveSuffixes } from "./addAdjectiveSuffixes";
import { addRegularSuffixes } from "./addAdjectiveSuffixes";
import { addComparativeSuperlativeSuffixes } from "./addAdjectiveSuffixes";

/**
 *  Returns forms for adjectives that get all suffixes on their second stem but none on their first.
 *
 * @param {Object}  morphologyDataAdjectives The German morphology data for nouns.
 * @param {string}  stemmedWordToCheck       The stem to check.
 *
 * @returns {string[]} The created adjective forms.
 */
const twoStemsOneStemGetsSuffixed = function( morphologyDataAdjectives, stemmedWordToCheck ) {
	const exceptionStems = morphologyDataAdjectives.onlySuffixSecondStem;

	for ( let i = 0; i < exceptionStems.length; i++ ) {
		const stemPairToCheck = exceptionStems[ i ];

		if ( stemPairToCheck.includes( stemmedWordToCheck ) ) {
			// The stems that need to be suffixed always end in a consonant; therefore the -n suffix can be removed.
			return [ stemPairToCheck[ 0 ], ...addAllAdjectiveSuffixes( morphologyDataAdjectives, stemPairToCheck[ 1 ] ) ];
		}
	}

	return [];
};

/**
 * Returns forms for adjectives that get all suffixes on both their stems.
 *
 * @param {Object}  morphologyDataAdjectives The German morphology data for nouns.
 * @param {string}  stemmedWordToCheck       The stem to check.
 *
 * @returns {string[]} The created adjective forms.
 */
const twoStemsBothGetSuffixed = function( morphologyDataAdjectives, stemmedWordToCheck ) {
	const exceptionStems = morphologyDataAdjectives.suffixBothStems;

	for ( let i = 0; i < exceptionStems.length; i++ ) {
		const stemPairToCheck = exceptionStems[ i ];

		if ( stemPairToCheck.includes( stemmedWordToCheck ) ) {
			/*
			 * Since the stemmer incorrectly removes -er, we need to add it again here. Also the stems that need
			 * to be suffixed always end in a consonant; therefore the -n suffix can be removed.
			 */
			return [ ...addAllAdjectiveSuffixes( morphologyDataAdjectives, stemPairToCheck[ 0 ].concat( "er" ) ),
				...addAllAdjectiveSuffixes( morphologyDataAdjectives, stemPairToCheck[ 1 ] ) ];
		}
	}

	return [];
};

/**
 * Returns forms for adjectives that get the regular suffixes on their first stem and the comparative and
 * superlative suffixes on their second stem.
 *
 * @param {Object}  morphologyDataAdjectives The German morphology data for nouns.
 * @param {string}  stemmedWordToCheck       The stem to check.
 *
 * @returns {string[]} The created adjective forms.
 */
const secondStemCompSup = function( morphologyDataAdjectives, stemmedWordToCheck ) {
	const exceptionStems = morphologyDataAdjectives.secondStemCompSup;

	for ( let i = 0; i < exceptionStems.length; i++ ) {
		const stemPairToCheck = exceptionStems[ i ];

		if ( stemPairToCheck.includes( stemmedWordToCheck ) ) {
			// The stems that need to be suffixed always end in a consonant; therefore the -n suffix can be removed.
			return [ ...addRegularSuffixes( morphologyDataAdjectives, stemPairToCheck[ 0 ] ),
				...addComparativeSuperlativeSuffixes( morphologyDataAdjectives, stemPairToCheck[ 1 ] ) ];
		}
	}

	return [];
};

/**
 * Returns forms for adjectives that get all suffixes on the first stem and only the comparative and
 * superlative suffixes on the second.
 *
 * @param {Object}  morphologyDataAdjectives The German morphology data for nouns.
 * @param {string}  stemmedWordToCheck       The stem to check.
 *
 * @returns {string[]} The created adjective forms.
 */
const bothStemsComSup = function( morphologyDataAdjectives, stemmedWordToCheck ) {
	const exceptionStems = morphologyDataAdjectives.bothStemsCompSup;

	for ( let i = 0; i < exceptionStems.length; i++ ) {
		const stemPairToCheck = exceptionStems[ i ];

		if ( stemPairToCheck.includes( stemmedWordToCheck ) ) {
			// The stems that need to be suffixed always end in a consonant; therefore the -n suffix can be removed.
			return [ ...addAllAdjectiveSuffixes( morphologyDataAdjectives, stemPairToCheck[ 0 ] ),
				...addComparativeSuperlativeSuffixes( morphologyDataAdjectives, stemPairToCheck[ 1 ] ) ];
		}
	}

	return [];
};

/**
 * Checks whether a give stem stem falls into any of the adjective exception categories.
 *
 * @param {Object}  morphologyDataAdjectives The German morphology data for nouns.
 * @param {string}  stemmedWordToCheck       The stem to check.
 *
 * @returns {string[]} The created adjective forms.
 */
export function checkAdjectiveExceptions( morphologyDataAdjectives, stemmedWordToCheck ) {
	let exceptions = twoStemsOneStemGetsSuffixed( morphologyDataAdjectives, stemmedWordToCheck );

	if ( exceptions.length > 0 ) {
		return exceptions;
	}

	exceptions = twoStemsBothGetSuffixed( morphologyDataAdjectives, stemmedWordToCheck );

	if ( exceptions.length > 0 ) {
		return exceptions;
	}

	exceptions = secondStemCompSup( morphologyDataAdjectives, stemmedWordToCheck );

	if ( exceptions.length > 0 ) {
		return exceptions;
	}

	exceptions = bothStemsComSup( morphologyDataAdjectives, stemmedWordToCheck );

	if ( exceptions.length > 0 ) {
		return exceptions;
	}

	return [];
}
