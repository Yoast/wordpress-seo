import { flattenDeep, uniq as unique } from "lodash-es";
import stem from "./stem";

/**
 * Checks whether a stemmed word is on a given exception list for which we have full forms.
 *
 * @param {array} exceptionCategory     The exception category to check.
 * @param {string} stemmedWordToCheck   The stem to check.
 *
 * @returns {Array<string>} The created word forms.
 */
const checkStemsFromExceptionList = function( exceptionCategory, stemmedWordToCheck ) {
	console.log( "exceptionCategory exception lists", exceptionCategory );

	for ( let i = 0; i < exceptionCategory.length; i++ ) {
		const currentStemDataSet = exceptionCategory[ i ];

		const stemPairToCheck = currentStemDataSet[ 0 ];

		for ( let j = 0; j < stemPairToCheck.length; j++ ) {
			const stemAtEndOfWord = new RegExp( stemPairToCheck[ j ] + "$" );
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

	return [];
};

/**
 * Checks whether a stemmed word has an ending for which we can predict possible suffix forms.
 *
 * @param {array} exceptionCategory     The exception category to check.
 * @param {string} stemmedWordToCheck   The stem to check.
 *
 * @returns {Array<string>} The created word forms.
 */
const checkStemsWithPredictableSuffixes = function( exceptionCategory, stemmedWordToCheck ) {
	const exceptionStems = exceptionCategory[ 0 ].map( exceptionStem => new RegExp( exceptionStem + "$" ) );
	const suffixes = exceptionCategory[ 1 ];

	for ( let i = 0; i < exceptionStems.length; i++ ) {
		const currentStem = exceptionStems[ i ];

		if ( currentStem.test( stemmedWordToCheck ) ) {
			return suffixes.map( suffix => stemmedWordToCheck.concat( suffix ) );
		}
	}

	return [];
};

/**
 * Checks whether a stemmed word is on any of the exception lists.
 *
 * @param {Object}  morphologyDataNouns             An object with the German morphology data for nouns.
 * @param {string}  stemmedWordToCheck              The stem to check.
 *
 * @returns {Array<string>} The created word forms.
 */
const checkExceptions = function( morphologyDataNouns, stemmedWordToCheck ) {
	let exceptions = [];

	// Check exceptions with full forms.
	const exceptionStemsWithFullForms = morphologyDataNouns.exceptionStemsWithFullForms;

	for ( const key of Object.keys( exceptionStemsWithFullForms ) ) {
		exceptions = checkStemsFromExceptionList( exceptionStemsWithFullForms[ key ], stemmedWordToCheck );
		if ( exceptions.length > 0 ) {
			return exceptions;
		}
	}

	// Check exceptions with predictable suffixes.
	const exceptionsStemsPredictableSuffixes = morphologyDataNouns.exceptionsStemsPredictableSuffixes;

	for ( const key of Object.keys( exceptionsStemsPredictableSuffixes ) ) {
		exceptions = checkStemsWithPredictableSuffixes( exceptionsStemsPredictableSuffixes[ key ], stemmedWordToCheck );
		if ( exceptions.length > 0 ) {
			return exceptions;
		}
	}

	return exceptions;
};

/**
 * Creates morphological forms for a given German word.
 *
 * @param {string} word             The word to create the forms for.
 * @param {Object} morphologyData   The German morphology data (false if unavailable).
 *
 * @returns {Array<string>} Array of the created
 */
export function getForms( word, morphologyData ) {
	const stemmedWord = stem( word );
	const forms = new Array( word );
	const exceptions = checkExceptions( morphologyData.nouns, stemmedWord );

	// Check exceptions.
	if ( exceptions.length > 0 ) {
		forms.push( exceptions );
		return unique( flattenDeep( forms ) );
	}
	// If the stem wasn't found on any exception list, add all regular suffixes.
	forms.push(  morphologyData.nouns.regularSuffixes.map( suffix => stemmedWord.concat( suffix ) )  );
	return flattenDeep( forms );
}
