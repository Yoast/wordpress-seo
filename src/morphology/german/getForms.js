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
	// There are some exceptions to this rule. If the current stem falls into this category, the rule doesn't apply.
	const exceptionsToTheException = exceptionCategory[ 2 ].map( exceptionToException => new RegExp( exceptionToException ) );
	for ( let i = 0; i < exceptionsToTheException.length; i++ ) {
		const currentStem = exceptionsToTheException[ i ];

		if ( currentStem.test( stemmedWordToCheck ) ) {
			return [];
		}
	}

	const exceptionStems = exceptionCategory[ 0 ].map( exceptionStem => new RegExp( exceptionStem ) );
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
 * @param {Object}  morphologyDataNouns The German morphology data for nouns.
 * @param {string}  stemmedWordToCheck  The stem to check.
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
			// For this class of words, the stemmed word is the singular form and therefore needs to be added.
			exceptions.push( stemmedWordToCheck );
			return exceptions;
		}
	}

	return exceptions;
};

/**
 * Adds suffixes from the list of regular suffixes.
 *
 * @param {Object}          morphologyDataSuffixAdditions   The German data for suffix additions.
 * @param {Array<string>}   regularSuffixes                 All regular suffixes for German.
 * @param {string}          stemmedWordToCheck              The stem to check.
 *
 * @returns {Array<string>} The modified list of regular suffixes.
 */
const addSuffixesToRegulars = function( morphologyDataSuffixAdditions, regularSuffixes, stemmedWordToCheck ) {
	for ( const key of Object.keys( morphologyDataSuffixAdditions ) ) {
		const endingsToCheck = morphologyDataSuffixAdditions[ key ][ 0 ];
		const suffixesToAdd = morphologyDataSuffixAdditions[ key ][ 1 ];
		const endingsToCheckRegexes = endingsToCheck.map( ending => new RegExp( ending ) );

		for ( let i = 0; i < endingsToCheckRegexes.length; i++ ) {
			if ( endingsToCheckRegexes[ i ].test( stemmedWordToCheck ) ) {
				regularSuffixes.push( suffixesToAdd );
			}
		}
	}

	return flattenDeep( regularSuffixes );
};

/**
 * Deletes suffixes from the list of regular suffixes.
 *
 * @param {Object}          morphologyDataSuffixDeletions   The German data for suffix deletions.
 * @param {Array<string>}   regularSuffixes                 All regular suffixes for German.
 * @param {string}          stemmedWordToCheck              The stem to check.
 *
 * @returns {Array<string>} The modified list of regular suffixes.
 */
const removeSuffixesFromRegulars = function( morphologyDataSuffixDeletions, regularSuffixes, stemmedWordToCheck ) {
	for ( const key of Object.keys( morphologyDataSuffixDeletions ) ) {
		const endingsToCheck = morphologyDataSuffixDeletions[ key ][ 0 ];
		const suffixesToDelete = morphologyDataSuffixDeletions[ key ][ 1 ];
		const endingsToCheckRegexes = endingsToCheck.map( ending => new RegExp( ending ) );

		for ( let i = 0; i < endingsToCheckRegexes.length; i++ ) {
			if ( endingsToCheckRegexes[ i ].test( stemmedWordToCheck ) ) {
				regularSuffixes = regularSuffixes.filter( ending => ! suffixesToDelete.includes( ending ) );
			}
		}
	}

	return regularSuffixes;
};

/**
 * Adds or removes suffixes from the list of regulars depending on the ending of the stem checked.
 *
 * @param {Object}          morphologyDataNouns The German morphology data for nouns.
 * @param {Array<string>}   regularSuffixes     All regular suffixes for German.
 * @param {string}          stemmedWordToCheck  The stem to check.
 *
 * @returns {Array<string>} The modified list of regular suffixes.
 */
const modifyListOfRegularSuffixes = function( morphologyDataNouns, regularSuffixes, stemmedWordToCheck ) {
	const additions = morphologyDataNouns.regularSuffixAdditions;
	const deletions = morphologyDataNouns.regularSuffixDeletions;

	regularSuffixes = addSuffixesToRegulars( additions, regularSuffixes, stemmedWordToCheck );
	regularSuffixes = removeSuffixesFromRegulars( deletions, regularSuffixes, stemmedWordToCheck );

	return regularSuffixes;
};

/**
 * Add forms based on changes other than simple suffix concatenations.
 *
 * @param {Object}  morphologyDataNouns The German morphology data for nouns.
 * @param {string}  stemmedWordToCheck  The stem to check.
 *
 * @returns {Array<string>} The modified forms.
 */
const addFormsWithRemovedLetters = function( morphologyDataNouns, stemmedWordToCheck ) {
	const forms = [];
	const stemChanges = morphologyDataNouns.changeStem;

	for ( const key of Object.keys( stemChanges ) ) {
		const changeCategory = stemChanges[ key ];
		const endingToCheck = new RegExp( changeCategory[ 0 ] );

		if ( endingToCheck.test( stemmedWordToCheck ) ) {
			forms.push( stemmedWordToCheck.replace( endingToCheck, changeCategory[ 1 ] ) );
		}
	}

	return forms;
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

	let regularSuffixes = morphologyData.nouns.regularSuffixes.slice();
	// Depending on the specific ending of the stem, we can add/remove some suffixes from the list of regulars.
	regularSuffixes = modifyListOfRegularSuffixes( morphologyData.nouns, regularSuffixes, stemmedWord );

	// If the stem wasn't found on any exception list, add regular suffixes.
	forms.push( regularSuffixes.map( suffix => stemmedWord.concat( suffix ) ) );
	// Also add the stemmed word, since it might be a valid word form on its own.
	forms.push( stemmedWord );

	/*
	 * In some cases, we need make changes to the stem that aren't simply concatenations (e.g. remove n from the stem
	 * Ärztinn to obtain Ärztin.
	 */
	forms.push( addFormsWithRemovedLetters( morphologyData.nouns, stemmedWord ) );

	return unique( flattenDeep( forms ) );
}
