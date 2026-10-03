import { flatten } from "lodash";
import { languageProcessing } from "yoastseo";
const {
	flattenSortLength,
	exceptionListHelpers: {
		checkExceptionListWithTwoStems,
	},
} = languageProcessing;

import stem from "./stem";
import { stemTOrDFromEndOfWord } from "./stemTOrDFromEndOfWord";

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
 * Checks if the word checked is in the list of strong verbs exceptions. Before checking, see if the word has a prefix and delete it if it does.
 * If the stem after prefix deletion is in the verb exception list, only return the first stem from the stem set and attach back the prefix.
 * E.g. words to check: verhielp, stem set: help, hielp, geholp -> the stem returned would be "verhelp".
 *
 * @param  {Object} morphologyDataNL 	The Dutch morphology data file.
 * @param  {string} stemmedWord 		The word to check.
 *
 * @returns {string} The unique stem.
 */
const findStemOnVerbExceptionList = function( morphologyDataNL, stemmedWord ) {
	const prefixes = flattenSortLength( morphologyDataNL.pastParticipleStemmer.compoundVerbsPrefixes );
	// Check whether the inputted stem is started with one of the separable compound prefixes
	let foundPrefix = prefixes.find( prefix => stemmedWord.startsWith( prefix ) );
	const doNotStemPrefix = morphologyDataNL.stemExceptions.stemmingExceptionsWithMultipleStems.strongAndIrregularVerbs.doNotStemPrefix;
	const doNotStemPrefixException = doNotStemPrefix.find( exception => stemmedWord.endsWith( exception ) );
	let stemmedWordWithoutPrefix = "";

	// Check whether the stemmedWord is in the list of strong verbs starting with be-, ont- or ver- that do not need to be stemmed.
	if ( doNotStemPrefixException ) {
		// Reset foundPrefix so that it won't be attached when the stem is found in the verb exception list.
		foundPrefix = null;
		// If the inputted stem is started with one of the separable compound prefixes, the prefix needs to be deleted for now.
	} else if ( foundPrefix ) {
		// Delete the prefix for now.
		stemmedWordWithoutPrefix = stemmedWord.slice( foundPrefix.length, stemmedWord.length );
		// At least 3 characters left after prefix deletion so that e.g. "be" is not found in the stem "berg".
		if ( stemmedWordWithoutPrefix.length > 2 ) {
			stemmedWord = stemmedWordWithoutPrefix;
		} else {
			// Reset foundPrefix so that it won't be attached when the stem is found in the verb exception list.
			foundPrefix = null;
		}
	}

	const strongVerbExceptions = morphologyDataNL.stemExceptions.stemmingExceptionsWithMultipleStems.strongAndIrregularVerbs.strongVerbStems;
	// Find stem strong verbs lists.
	const strongVerbsExceptionLists = [ strongVerbExceptions.irregularStrongVerbs, strongVerbExceptions.regularStrongVerbs,
		strongVerbExceptions.bothRegularAndIrregularStrongVerbs,
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
 * @param {string} word The word to be checked.
 * @param {Object} morphologyDataNL The Dutch data file.
 *
 * @returns {string} The unique stem.
 */
export default function determineStem( word, morphologyDataNL ) {
	const stemmedWord = stem( word, morphologyDataNL );

	// Check whether the stemmed word is on an exception list of words with multiple stems. If it is, return the canonical stem.
	let stemFromExceptionList = checkExceptionListWithTwoStems(
		morphologyDataNL.stemExceptions.stemmingExceptionsWithMultipleStems.stemmingExceptionsWithTwoStems, stemmedWord );
	if ( stemFromExceptionList ) {
		return stemFromExceptionList;
	}
	stemFromExceptionList = findStemOnVerbExceptionList( morphologyDataNL, stemmedWord );
	if ( stemFromExceptionList ) {
		return stemFromExceptionList;
	}

	// If the stemmed word ends in -t or -d, check whether it should be stemmed further, and return the stem with or without the -t/d.
	const ambiguousEndings = morphologyDataNL.ambiguousTAndDEndings.tAndDEndings;
	for ( const ending of ambiguousEndings ) {
		if ( stemmedWord.endsWith( ending ) ) {
			const stemmedWordWithoutTOrD = stemTOrDFromEndOfWord( morphologyDataNL, stemmedWord, word );
			if ( stemmedWordWithoutTOrD ) {
				return stemmedWordWithoutTOrD;
			}
		}
	}

	return stemmedWord;
}
