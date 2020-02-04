import { flatten } from "lodash-es";
/**
 *
 * Checks whether a word is on the exception list for which we have full forms.
 *
 * @param {Array} fullFormsExceptionLists The exception list with full forms to check against.
 * @param {string} word The word to check.
 *
 * @returns {string/null} The created word forms.
 */

export default function( fullFormsExceptionLists, word ) {
	for ( let i = 0; i < fullFormsExceptionLists.length; i++ ) {
		const fullFormsExceptionList = flatten( fullFormsExceptionLists[ i ] );
		for ( let j = 0; j < fullFormsExceptionList.length; j++ ) {
			if ( word.endsWith( fullFormsExceptionList[ j ] ) ) {
				/*
				 * Check if the word checked is actually a compound word. e.g. familielid
				 * The character/s preceding the words in the exception should be at least 2 characters in order to be a valid compound element.
				 *
				 */
				const precedingLexicalMaterial = word.slice( 0, -fullFormsExceptionList[ j ].length );
				if ( precedingLexicalMaterial.length === 1 ||
					 precedingLexicalMaterial.length === 2 ) {
					return null;
				}
				// We only need to return the first index of the array as the stem.
				if ( precedingLexicalMaterial.length > 1 ) {
					return precedingLexicalMaterial.concat( fullFormsExceptionList[ 0 ] );
				}
				return fullFormsExceptionList[ 0 ];
			}
		}
	}
	return null;
}
