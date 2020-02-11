import { flatten } from "lodash-es";
/**
 *
 * Checks whether a word is on the exception list for which we have full forms. If it is, returns the indicated stem of the word.
 *
 * @param {Array} fullFormsExceptionList The exception list with full forms to check against.
 * @param {string} word The word to check.
 *
 * @returns {string/null} The created word forms.
 */
export default function( fullFormsExceptionList, word ) {
	for ( let i = 0; i < fullFormsExceptionList.length; i++ ) {
		const stemAndForms = flatten( fullFormsExceptionList[ i ] );
		for ( let j = 0; j < stemAndForms.length; j++ ) {
			if ( word.endsWith( stemAndForms[ j ] ) ) {
				/*
				 * Check if the word checked is actually a compound word. e.g. familielid
				 * The character/s preceding the words in the exception should be at least 2 characters in order to be a valid compound element.
				 */
				const precedingLexicalMaterial = word.slice( 0, -stemAndForms[ j ].length );
				if ( precedingLexicalMaterial.length === 1 ) {
					return null;
				}
				// We only need to return the first index of the array as the stem.
				if ( precedingLexicalMaterial.length > 1 ) {
					return precedingLexicalMaterial.concat( stemAndForms[ 0 ] );
				}
				return stemAndForms[ 0 ];
			}
		}
	}
	return null;
}
