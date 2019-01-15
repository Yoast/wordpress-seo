import { flatten, flattenDeep, uniq as unique } from "lodash-es";
import { getNounForms } from "./getNounForms";
import stem from "./stem";

const checkNounsWithUmlautChange = function( morphologyDataNouns, stemmedWordToCheck ) {
	for ( const stemDataSet in morphologyDataNouns.stemsWithUmlaut ) {
		const currentStemDataSet = morphologyDataNouns.stemsWithUmlaut[ stemDataSet ];

		const stemPairToCheck = currentStemDataSet[ 0 ];

		for ( const stemToCheck in stemPairToCheck ) {
			const stemAtEndOfWord = new RegExp( stemPairToCheck[ stemToCheck ] + "$" );

			// Check if the stemmed word ends in one of the stems of the exception list.
			if ( stemAtEndOfWord.test( stemmedWordToCheck ) ) {
				const precedingLexicalMaterial = stemmedWordToCheck.replace( stemAtEndOfWord, "" );
				/*
			 	 * If the word is a compound, removing the final stem will result in some lexical material to
			 	 * be left over. For example, removing "stadt" from "Hauptstadt" leaves "Haupt".
			 	 * That lexical material is the base for the word forms that need to be created (e.g., "Hauptstädte").
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

	console.log( "no exception found" );

	return [];
};

const checkExceptions = function( morphologyDataNouns, stemToCheck ) {
	const exceptionForms = [];

	exceptionForms.push( checkNounsWithUmlautChange( morphologyDataNouns, stemToCheck ) );

	return flatten( exceptionForms );
};

export function getForms( word, morphologyData ) {
	const stemmedWord = stem( word );
	const forms = new Array( word );

	// Check exceptions.
	if ( checkExceptions( morphologyData.nouns, stemmedWord ).length > 0 ) {
		forms.push( checkExceptions( morphologyData.nouns, stemmedWord ) );
		return unique( flattenDeep( forms ) );
	}
	// If the stem wasn't found on any exception list, add all regular suffixes.
	forms.push( getNounForms( stemmedWord, morphologyData.nouns ) );
	return flattenDeep( forms );
}
