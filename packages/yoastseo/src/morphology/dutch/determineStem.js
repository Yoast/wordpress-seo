import { flattenSortLength } from "../morphoHelpers/flattenSortLength";
import { flatten } from "lodash-es";
import stem from "./stem";
import { createSecondStemWithoutAmbiguousEnding } from "./createSecondStemWithoutAmbiguousEnding";
import { checkExceptionListWithTwoStems } from "../morphoHelpers/exceptionListHelpers";

/**
 * Checks if the word checked is in the list of strong verbs exceptions. If it is, only return the first stem from the stem set.
 * E.g. stems: help, hielp, geholp -> the stem returned would be "help".
 *
 * @param {Object} strongVerbsLists	The exception lists of strong verbs.
 * @param {string} stemmedWord The word to check.
 * @returns {string} The unique stem.
 */
const checkStrongVerbExceptionList = function( strongVerbsLists, stemmedWord ) {
	for ( const key of Object.keys( strongVerbsLists ) ) {
		for ( const stemsSet of strongVerbsLists[ key ] ) {
			const stems = flatten( Object.values( stemsSet ) );
			if ( stems.includes( stemmedWord ) ) {
				return stems[ 0 ];
			}
		}
	}
};

/**
 * Checks if the word checked is in the list of strong verbs exceptions. If it is, only return the first stem from the stem set.
 * E.g. stems: help, hielp, geholp -> the stem returned would be "help".
 *
 * @param  {Object} morphologyDataVerbs The Dutch verbs data.
 * @param  {string} stemmedWord The word to check.
 *
 * @returns {string} The unique stem.
 */
const findStemOnVerbExceptionList = function( morphologyDataVerbs, stemmedWord ) {
	const prefixes = flattenSortLength( morphologyDataVerbs.compoundVerbsPrefixes );
	// Check whether the inputted stem is started with one of the separable compound prefixes
	let foundPrefix = prefixes.find( prefix => stemmedWord.startsWith( prefix ) );
	const doNotStemPrefix = morphologyDataVerbs.strongAndIrregularVerbs.doNotStemPrefix;
	const doNotStemPrefixException = doNotStemPrefix.find( exception => stemmedWord.endsWith( exception ) );
	let stemmedWordWithoutPrefix = "";

	// Check whether the stemmedWord is in the list of strong verbs starting with be-, ont- or ver- that do not need to be stemmed.
	if ( doNotStemPrefixException ) {
		foundPrefix = null;
		// If the inputted stem is started with one of the separable compound prefixes, the prefix needs to be deleted for now.
	} else if ( foundPrefix ) {
		stemmedWordWithoutPrefix = stemmedWord.slice( foundPrefix.length, stemmedWord.length );
		// At least 3 characters so that e.g. "be" is not found in the stem "berg".
		if ( stemmedWordWithoutPrefix.length > 2 ) {
			stemmedWord = stemmedWordWithoutPrefix;
		} else {
			// Reset foundPrefix so that it won't be attached when forms are generated.
			foundPrefix = null;
		}
	}
	// Find stem strong verbs lists.
	const strongVerbsExceptionLists = [ morphologyDataVerbs.strongAndIrregularVerbs.strongVerbStems.irregularStrongVerbs,
		morphologyDataVerbs.strongAndIrregularVerbs.strongVerbStems.regularStrongVerbs,
		morphologyDataVerbs.strongAndIrregularVerbs.strongVerbStems.bothRegularAndIrregularStrongVerbs,
	];
	for ( let i = 0; i < strongVerbsExceptionLists.length; i++ ) {
		const checkIfWordIsException =  checkStrongVerbExceptionList( strongVerbsExceptionLists[ i ], stemmedWord );
		if ( checkIfWordIsException ) {
			// If the word checked had a prefix previously, attach it back.
			if ( foundPrefix ) {
				return foundPrefix + checkStrongVerbExceptionList( strongVerbsExceptionLists[ i ], stemmedWord );
			}
			// If the word checked did not have a prefix previously, only return the first stem.
			return checkStrongVerbExceptionList( strongVerbsExceptionLists[ i ], stemmedWord );
		}
	}
};

/**
 * Return the unique stem for a given Dutch input word.
 *
 * @param {Object} morphologyDataNL The Dutch data file.
 * @param {string} word The word to be checked.
 * @returns {string} The unique stem.
 */
export function determineStem( morphologyDataNL, word ) {
	const stemmedWord = stem( word, morphologyDataNL );

	/*
	 * Goes through the stem exception functions from left to right, returns the first stem it finds.
	 * If no stem has been found, return the original, programmatically created, stem.
	 */
	return checkExceptionListWithTwoStems( morphologyDataNL.nouns.exceptions.nounExceptionWithTwoStems, stemmedWord ) ||
		   findStemOnVerbExceptionList( morphologyDataNL.verbs, stemmedWord ) ||
		   createSecondStemWithoutAmbiguousEnding( morphologyDataNL, stemmedWord, word );
}

