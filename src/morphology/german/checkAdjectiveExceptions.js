const twoStemsOneStepGetsSuffixed = function( morphologyDataAdjectives, stemmedWordToCheck ) {
	const exceptionStems = morphologyDataAdjectives.onlySuffixSecondStem;

	for ( let i = 0; i < exceptionStems.length; i++ ) {
		const stemPairToCheck = exceptionStems[ i ];

		if ( stemPairToCheck.includes( stemmedWordToCheck ) ) {
			// The stems that need to be suffixed always end in a consonant; therefore the -n suffix can be removed.
			const suffixesToAdd = morphologyDataAdjectives.regularSuffixes.slice().filter( suffix => suffix !== "n" );
			return [ stemPairToCheck[ 0 ], ...suffixesToAdd.map( suffix => ( stemPairToCheck[ 1 ].concat( suffix ) ) ) ];
		}
	}

	return [];
};

const twoStemsBothGetSuffixed = function( morphologyDataAdjectives, stemmedWordToCheck ) {
	const exceptionStems = morphologyDataAdjectives.suffixBothStems;

	for ( let i = 0; i < exceptionStems.length; i++ ) {
		const stemPairToCheck = exceptionStems[ i ];

		if ( stemPairToCheck.includes( stemmedWordToCheck ) ) {
			// The stems that need to be suffixed always end in a consonant; therefore the -n suffix can be removed.
			const suffixesToAdd = morphologyDataAdjectives.regularSuffixes.slice().filter( suffix => suffix !== "n" );

			// Since the stemmer (incorrectly) removes -er, we need to add it again here.
			return [ ...suffixesToAdd.map( suffix => ( stemPairToCheck[ 0 ].concat( "er", suffix ) ) ),
				...suffixesToAdd.map( suffix => ( stemPairToCheck[ 1 ].concat( suffix ) ) ) ];
		}
	}

	return [];
};

export function checkAdjectiveExceptions( morphologyDataAdjectives, stemmedWordToCheck ) {
	let exceptions;

	exceptions = twoStemsOneStepGetsSuffixed( morphologyDataAdjectives, stemmedWordToCheck );

	if ( exceptions.length > 0 ) {
		return exceptions;
	}

	exceptions = twoStemsBothGetSuffixed( morphologyDataAdjectives, stemmedWordToCheck );

	if ( exceptions.length > 0 ) {
		return exceptions;
	}

	return exceptions;
}
