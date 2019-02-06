import { addAllAdjectiveSuffixes } from "./addAdjectiveSuffixes";
import { addRegularSuffixes } from "./addAdjectiveSuffixes";
import { addComparativeSuperlativeSuffixes } from "./addAdjectiveSuffixes";

const twoStemsOneStepGetsSuffixed = function( morphologyDataAdjectives, stemmedWordToCheck ) {
	const exceptionStems = morphologyDataAdjectives.onlySuffixSecondStem;

	for ( let i = 0; i < exceptionStems.length; i++ ) {
		const stemPairToCheck = exceptionStems[ i ];

		if ( stemPairToCheck.includes( stemmedWordToCheck ) ) {
			// The stems that need to be suffixed always end in a consonant; therefore the -n suffix can be removed.
			return [ stemPairToCheck[ 0 ], ...addAllAdjectiveSuffixes( morphologyDataAdjectives, stemPairToCheck[ 1 ], [ "n" ] ) ];
		}
	}

	return [];
};

/**
 * Returns forms for adjectives that get all suffixes on both their stems.
 *
 * @param morphologyDataAdjectives
 * @param stemmedWordToCheck
 * @return {*}
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
			return [ ...addAllAdjectiveSuffixes( morphologyDataAdjectives, stemPairToCheck[ 0 ].concat( "er" ), [ "n" ] ),
				...addAllAdjectiveSuffixes( morphologyDataAdjectives, stemPairToCheck[ 1 ], [ "n" ] ) ];
		}
	}

	return [];
};

/**
 * Returns forms for adjectives that get the regular suffixes on their first stem and the comparative and
 * superlative suffixes on their second stem.
 *
 * @param morphologyDataAdjectives
 * @param stemmedWordToCheck
 * @return {*}
 */
const secondStemCompSup = function( morphologyDataAdjectives, stemmedWordToCheck ) {
	const exceptionStems = morphologyDataAdjectives.secondStemCompSup;

	for ( let i = 0; i < exceptionStems.length; i++ ) {
		const stemPairToCheck = exceptionStems[ i ];

		if ( stemPairToCheck.includes( stemmedWordToCheck ) ) {
			// The stems that need to be suffixed always end in a consonant; therefore the -n suffix can be removed.
			return [ ...addRegularSuffixes( morphologyDataAdjectives, stemPairToCheck[ 0 ], [ "n" ] ),
				...addComparativeSuperlativeSuffixes( morphologyDataAdjectives, stemPairToCheck[ 1 ] ) ];
		}
	}

	return [];
};

/**
 * Returns forms for adjectives that get all suffixes on the first stem and only the comparative and
 * superlative suffixes on the second.
 *
 * @param morphologyDataAdjectives
 * @param stemmedWordToCheck
 * @return {*}
 */
const bothStemsComSup = function( morphologyDataAdjectives, stemmedWordToCheck ) {
	const exceptionStems = morphologyDataAdjectives.bothStemsCompSup;

	for ( let i = 0; i < exceptionStems.length; i++ ) {
		const stemPairToCheck = exceptionStems[ i ];

		if ( stemPairToCheck.includes( stemmedWordToCheck ) ) {
			// The stems that need to be suffixed always end in a consonant; therefore the -n suffix can be removed.
			return [ ...addAllAdjectiveSuffixes( morphologyDataAdjectives, stemPairToCheck[ 0 ], [ "n" ] ),
				...addComparativeSuperlativeSuffixes( morphologyDataAdjectives, stemPairToCheck[ 1 ] ) ];
		}
	}

	return [];
};

export function checkAdjectiveExceptions( morphologyDataAdjectives, stemmedWordToCheck ) {
	let exceptions = twoStemsOneStepGetsSuffixed( morphologyDataAdjectives, stemmedWordToCheck );

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
