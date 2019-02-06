import { addAllAdjectiveSuffixes } from "./addAdjectiveSuffixes";
import { checkAdjectiveExceptions } from "./checkAdjectiveExceptions";
import { checkNounExceptions } from "./checkNounExceptions";
import { flattenDeep, uniq as unique } from "lodash-es";
import stem from "./stem";

/**
 * Adds suffixes to the list of regular suffixes.
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

		// Append to the regular suffixes if one of the endings match.
		if ( endingsToCheck.some( ending => stemmedWordToCheck.endsWith( ending ) ) ) {
			regularSuffixes = regularSuffixes.concat( suffixesToAdd );
		}
	}

	return regularSuffixes;
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

		// Delete from the regular suffixes if one of the endings match.
		if ( endingsToCheck.some( ending => stemmedWordToCheck.endsWith( ending ) ) ) {
			regularSuffixes = regularSuffixes.filter( ending => ! suffixesToDelete.includes( ending ) );
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
		const endingToCheck = changeCategory[ 0 ];

		if ( stemmedWordToCheck.endsWith( endingToCheck ) ) {
			const stemWithoutEnding = stemmedWordToCheck.slice( 0, stemmedWordToCheck.length - endingToCheck.length );
			forms.push( stemWithoutEnding.concat( changeCategory[ 1 ] ) );
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
 * @returns {{forms: Array<string>, stem: string}} An object with the forms created and the stemmed word.
 */
export function getForms( word, morphologyData ) {
	const stemmedWord = stem( word );
	const forms = new Array( word );

	/* Check whether the word is on a noun or adjectibe exception list. Since a stem might be on multiple
	 * exception lists (e.g. "groß" might be either from the adjective "groß" or the noun "Größe".
	 *
	 */
	const exceptionsNouns = checkNounExceptions( morphologyData.nouns, stemmedWord );
	const exceptionsAdjectives = checkAdjectiveExceptions( morphologyData.adjectives, stemmedWord );
	const exceptionsAll = [ ...exceptionsNouns, ...exceptionsAdjectives ];

	if ( exceptionsNouns.length > 0 ) {
		// Add the original word as a safeguard.
		exceptionsNouns.push( word );

		return { forms: unique( exceptionsNouns ), stem: stemmedWord };
	}

	// Check whether the word is on an adjective exception list.

	if ( exceptionsAdjectives.length > 0 ) {
		// Add the original word as a safeguard.
		exceptionsAdjectives.push( word );

		return { forms: unique( exceptionsAdjectives ), stem: stemmedWord };
	}

	// Modify regular suffixes assuming the word is a noun.
	let regularNounSuffixes = morphologyData.nouns.regularSuffixes.slice();
	// Depending on the specific ending of the stem, we can add/remove some suffixes from the list of regulars.
	regularNounSuffixes = modifyListOfRegularSuffixes( morphologyData.nouns, regularNounSuffixes, stemmedWord );

	// If the stem wasn't found on any exception list, add regular noun suffixes.
	forms.push( regularNounSuffixes.map( suffix => stemmedWord.concat( suffix ) ) );

	// Also add regular adjective suffixes.
	forms.push( addAllAdjectiveSuffixes( morphologyData.adjectives, stemmedWord ) );

	// Also add the stemmed word, since it might be a valid word form on its own.
	forms.push( stemmedWord );

	/*
	 * In some cases, we need make changes to the stem that aren't simply concatenations (e.g. remove n from the stem
	 * Ärztinn to obtain Ärztin.
	 */
	forms.push( addFormsWithRemovedLetters( morphologyData.nouns, stemmedWord ) );

	return { forms: unique( flattenDeep( forms ) ), stem: stemmedWord };
}
