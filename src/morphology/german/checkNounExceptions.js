/**
 * Checks whether a stemmed word is on the exception list for which we have full forms.
 *
 * @param {Array} exceptionStems        The exception stems to check against.
 * @param {string} stemmedWordToCheck   The stem to check.
 *
 * @returns {string[]} The created word forms.
 */
const checkStemsFromExceptionList = function( exceptionStems, stemmedWordToCheck ) {
	for ( let i = 0; i < exceptionStems.length; i++ ) {
		const currentStemDataSet = exceptionStems[ i ];

		const stemPairToCheck = currentStemDataSet[ 0 ];

		for ( let j = 0; j < stemPairToCheck.length; j++ ) {
			const exceptionStemMatched = stemmedWordToCheck.endsWith( stemPairToCheck[ j ] );

			// Check if the stemmed word ends in one of the stems of the exception list.
			if ( exceptionStemMatched === true ) {
				// "Haupt".length = "Hauptstadt".length - "stadt".length
				const precedingLength = stemmedWordToCheck.length - stemPairToCheck[ j ].length;
				const precedingLexicalMaterial = stemmedWordToCheck.slice( 0, precedingLength );
				/*
			 	 * If the word is a compound, removing the final stem will result in some lexical material to
			 	 * be left over at the beginning of the word. For example, removing "stadt" from "Hauptstadt"
			 	 * leaves "Haupt". This lexical material is the base for the word forms that need to be created
			 	 * (e.g., "Hauptstädte").
			 	 */
				if ( precedingLexicalMaterial.length > 0 ) {
					const stemsToReturn = currentStemDataSet[ 1 ];
					return stemsToReturn.map( currentStem => precedingLexicalMaterial.concat( currentStem ) );
				}
				/*
				 * Return all possible stems since apparently the word that's being checked is equal to the stem on the
				 * exception list that's being checked.
				 */
				return currentStemDataSet[ 1 ];
			}
		}
	}

	return [];
};

/**
 * Checks whether a stemmed word has an ending for which we can predict possible suffix forms.
 *
 * @param {array} exceptionCategory     The exception category to check.
 * @param {string} stemmedWordToCheck   The stem to check.
 *
 * @returns {string[]} The created word forms.
 */
const checkStemsWithPredictableSuffixes = function( exceptionCategory, stemmedWordToCheck ) {
	// There are some exceptions to this rule. If the current stem falls into this category, the rule doesn't apply.
	const exceptionsToTheException = exceptionCategory[ 2 ];

	if ( exceptionsToTheException.some( ending => stemmedWordToCheck.endsWith( ending ) ) ) {
		return [];
	}

	const exceptionStems = exceptionCategory[ 0 ];

	// Return forms of stemmed word with appended suffixes.
	if ( exceptionStems.some( ending => stemmedWordToCheck.endsWith( ending ) ) ) {
		const suffixes = exceptionCategory[ 1 ];

		return suffixes.map( suffix => stemmedWordToCheck.concat( suffix ) );
	}

	return [];
};

/**
 * Checks whether a stemmed word is on any of the exception lists.
 *
 * @param {Object}  morphologyDataNouns The German morphology data for nouns.
 * @param {string}  stemmedWordToCheck  The stem to check.
 *
 * @returns {string[]} The created word forms.
 */
export function checkNounExceptions( morphologyDataNouns, stemmedWordToCheck ) {
	// Check exceptions with full forms.
	let exceptions = checkStemsFromExceptionList( morphologyDataNouns.exceptionStemsWithFullForms, stemmedWordToCheck );

	if ( exceptions.length > 0 ) {
		return exceptions;
	}

	// Check exceptions with predictable suffixes.
	const exceptionsStemsPredictableSuffixes = morphologyDataNouns.exceptionsStemsPredictableSuffixes;

	for ( const key of Object.keys( exceptionsStemsPredictableSuffixes ) ) {
		exceptions = checkStemsWithPredictableSuffixes( exceptionsStemsPredictableSuffixes[ key ], stemmedWordToCheck );
		if ( exceptions.length > 0 ) {
			// For this class of words, the stemmed word is the singular form and therefore needs to be added.
			exceptions.push( stemmedWordToCheck );
			return exceptions;
		}
	}

	return exceptions;
}
