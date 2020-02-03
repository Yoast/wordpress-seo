/**
 *
 * Checks whether a stemmed word is on the exception list for which we have full forms.
 *
 * @param {Array} exceptionStems        The exception stems to check against.
 * @param {string} stemmedWordToCheck   The stem to check.
 *
 * @returns {string[]} The created word forms.
 */
import flatten from "lodash-es/flatten";

export checkExceptionsWithFullForms = function( exceptionStems, stemmedWordToCheck ) {
	for ( let i = 0; i < exceptionStems.length; i++ ) {
		const currentStemDataSet = exceptionStems[ i ];
		const stemPairToCheck = currentStemDataSet[ 0 ];
		for ( let j = 0; j < stemPairToCheck.length; j++ ) {
			const exceptionStemMatched = stemmedWordToCheck.endsWith( stemPairToCheck[ j ] );

			// Check if the stemmed word ends in one of the stems of the exception list.
			if ( exceptionStemMatched === true ) {
				// "Rand".length = "Randstad".length - "stad".length
				const precedingLength = stemmedWordToCheck.length - stemPairToCheck[ j ].length;
				const precedingLexicalMaterial = stemmedWordToCheck.slice( 0, precedingLength );
				/*
				* If the word is a compound, removing the final stem will result in some lexical material to
				* be left over at the beginning of the word. For example, removing "stad" from "Randstad"
				* leaves "Rand". This lexical material is the base for the word forms that need to be created
				* (e.g., "Randstad"). The preceding lexical material must include at least 2 characters in order to be a valid compound element.
				*/
				if ( precedingLexicalMaterial.length === 1 ) {
					return [];
				}
				if ( precedingLexicalMaterial.length > 1 ) {
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
}

const determineStemFromFullFormsList = function( fullFormsExceptionLists, word ) {
	for ( let i = 0; i < fullFormsExceptionLists.length; i++ ) {
		const fullFormsExceptionList = flatten( fullFormsExceptionLists[ i ] );
		for ( let j = 0; j < fullFormsExceptionList.length; j++ ) {
			if ( word.endsWith( fullFormsExceptionList[ j ] ) ) {
				const precedingLexicalMaterial = word.slice( 0, -fullFormsExceptionList[ j ].length );
				if ( precedingLexicalMaterial.length === 1 ) {
					return [];
				}
				if ( precedingLexicalMaterial.length > 1 ) {
					return precedingLexicalMaterial.concat( fullFormsExceptionList[ 0 ] );
				}
				return fullFormsExceptionList[ 0 ];
			}
		}
	}
};
