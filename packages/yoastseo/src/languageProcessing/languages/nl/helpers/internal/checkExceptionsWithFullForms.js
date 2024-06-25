import { flatten } from "lodash";
import { languageProcessing } from "yoastseo";
const { flattenSortLength } = languageProcessing;

/**
 * Checks whether the word is on the verbs sub-list of the full forms list. Before checking the list, checks whether the word
 * begins with one of the compound verb prefixes, and the prefix is removed if one is found. If a match is found after checking
 * the full forms list, the canonical stem is returned, with the prefix attached back if there was one in the input word.
 * e.g. aanbevelen -> aanbeveel
 *
 * @param {string}			word							The word to check.
 * @param {string[]}		verbFullFormsList				The list of verb forms we search for match in.
 * @param {Object}			compoundVerbPrefixes			The list of separable and inseparable compound verb prefixes.
 *
 * @returns {string|null}	The canonical stem or null if no match found.
 */
const checkVerbFullFormsList = function( word, verbFullFormsList, compoundVerbPrefixes ) {
	const prefixes = flattenSortLength( compoundVerbPrefixes );

	// Check whether the inputted word starts with one of the compound prefixes
	const foundPrefix = prefixes.find( prefix => word.startsWith( prefix ) );

	if ( typeof( foundPrefix ) === "string" ) {
		word = word.slice( foundPrefix.length );
	}

	for ( let i = 0; i < verbFullFormsList.length; i++ ) {
		const stemAndForms = flatten( verbFullFormsList[ i ] );
		for ( let j = 0; j < stemAndForms.length; j++ ) {
			if ( stemAndForms.includes( word ) ) {
				if ( typeof( foundPrefix ) === "string" ) {
					return ( foundPrefix + stemAndForms[ 0 ] );
				}
				return stemAndForms[ 0 ];
			}
		}
	}
	return null;
};

/**
 * Checks whether the word is on the sub-list of the full forms list for which we search for an ending match between one of
 * the forms and the word (i.e., whether the word ends with a form from the list). If a match is found, the canonical
 * stem is returned. e.g. fitnesscentra -> fitnesscentrum
 *
 * @param {string}			word							The word to check.
 * @param {string[]}		endingMatchFullFormsList		The list we search for an ending match in.
 * @returns {string|null}	The canonical stem or null if no match found.
 */
const checkEndingMatchFullFormsList = function( word, endingMatchFullFormsList ) {
	for ( let i = 0; i < endingMatchFullFormsList.length; i++ ) {
		const stemAndForms = flatten( endingMatchFullFormsList[ i ] );
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

				if ( precedingLexicalMaterial.length > 1 ) {
					return ( precedingLexicalMaterial + stemAndForms[ 0 ] );
				}
				return stemAndForms[ 0 ];
			}
		}
	}
	return null;
};

/**
 * Checks whether the word is on the sub-list of the full forms list for which we search for the exact match between one of
 * the forms and the word. If a match is found, the canonical stem is returned. e.g. curricula -> curriculum
 *
 * @param {string}			word						The word to check.
 * @param {string[]}		exactMatchFullFormsList		The list we search for an exact match in.
 * @returns {string|null}	The canonical stem or null if no match found.
 */
const checkExactMatchFullFormsList = function( word, exactMatchFullFormsList ) {
	for ( let i = 0; i < exactMatchFullFormsList.length; i++ ) {
		const stemAndForms = flatten( exactMatchFullFormsList[ i ] );
		for ( let j = 0; j < stemAndForms.length; j++ ) {
			if ( stemAndForms.includes( word ) ) {
				return stemAndForms[ 0 ];
			}
		}
	}
	return null;
};

/**
 *
 * Checks whether a word is on the exception list for which we have full forms. If it is, returns the indicated stem of the word.
 *
 * @param {Array} morphologyDataNL The Dutch morphology data file.
 * @param {string} word The word to check.
 *
 * @returns {string/null} The created word forms.
 */
export default function checkExceptionsWithFullForms( morphologyDataNL, word ) {
	const exceptionListWithFullForms = morphologyDataNL.stemExceptions.stemmingExceptionStemsWithFullForms;

	let stem = checkVerbFullFormsList( word, exceptionListWithFullForms.verbs, morphologyDataNL.pastParticipleStemmer.compoundVerbsPrefixes );
	if ( stem ) {
		return stem;
	}

	stem = checkEndingMatchFullFormsList( word, exceptionListWithFullForms.endingMatch );
	if ( stem ) {
		return stem;
	}

	stem = checkExactMatchFullFormsList( word, exceptionListWithFullForms.exactMatch );
	if ( stem ) {
		return stem;
	}

	return null;
}
