import { isUndefined, flatten } from "lodash";
import { languageProcessing } from "yoastseo";
const { buildFormRule, createRulesFromArrays } = languageProcessing;

import getAdjectiveStem from "./getAdjectiveStem";
import { getInfinitive, checkIrregulars as getIrregularVerbParadigm, endsWithIng } from "./getVerbStem.js";

/**
 * Gets the shortest of the alphabetically ordered strings from an array.
 *
 * @param {string[]} array  The array of strings.
 *
 * @returns {string|undefined}  The shortest of the alphabetically ordered strings from the input array;
 *                              undefined if the input array is empty.
 */
export function findShortestAndAlphabeticallyFirst( array ) {
	const strings = flatten( array );
	let result = strings.pop();

	strings.forEach( str => {
		const lengthDifference = str.length - result.length;
		if ( lengthDifference === 0 ) {
			if ( str.localeCompare( result ) < 0 ) {
				result = str;
			}
		} else if ( lengthDifference < 0 ) {
			result = str;
		}
	} );

	return result;
}

/**
 * Checks if the input word occurs in the list of exceptions and if so returns the first form of the paradigm, which is
 * always the base.
 *
 * @param {string}		word		The word for which to determine its base.
 * @param {string[]}	irregulars	An array of irregular nouns and adjectives.
 *
 * @returns {string|null} The base form of the irregular word; null if no irregular stem was found.
 */
export function determineIrregularStem( word, irregulars ) {
	for ( const paradigm of irregulars ) {
		if ( paradigm.includes( word ) ) {
			return paradigm[ 0 ];
		}
	}
	return null;
}

/**
 * Checks if the input word occurs in the list of exception verbs and if so returns the first form
 * of the paradigm, which is always the base. Contrary to nouns and adjectives, irregular verbs can have different prefixes
 * which are not included in the list of exceptions and have to be processed separately.
 *
 * @param {string}	word            The word for which to determine its base.
 * @param {Object}	verbMorphology  Regexes and irregulars for verb morphology, False if verb rules should not be applied.
 *
 * @returns {string|null} The base form of the irregular word; null if no irregular stem was found.
 */
export function determineIrregularVerbStem( word, verbMorphology ) {
	const paradigmIfIrregularVerb = getIrregularVerbParadigm( word, verbMorphology.irregularVerbs, verbMorphology.regexVerb.verbPrefixes );
	if ( ! isUndefined( paradigmIfIrregularVerb ) ) {
		return paradigmIfIrregularVerb[ 0 ];
	}
	return null;
}

/**
 * Gets possible stems as a regular noun, adjective and verb.
 *
 * @param {string} word              The word for which to determine its base.
 * @param {Object} morphologyData    The morphology data for the language.
 *
 * @returns {string} The shortest and the alphabetically-first of possible noun-like, verb-like and adjective-like bases.
 */
export function determineRegularStem( word, morphologyData ) {
	// Try to singularize as a noun.
	const regexVerb = morphologyData.verbs.regexVerb;
	const baseIfPluralNoun = buildFormRule( word, createRulesFromArrays( morphologyData.nouns.regexNoun.singularize ) );
	if ( ! isUndefined( baseIfPluralNoun ) ) {
		// Bring ing-nouns to base forms ("blessings" -> "bless").
		if ( endsWithIng( baseIfPluralNoun ) ) {
			return buildFormRule( baseIfPluralNoun, createRulesFromArrays( regexVerb.ingFormToInfinitive ) );
		}
		return baseIfPluralNoun;
	}

	// Check if the word ends with "ic", "ical" or "ically". Return the "ical" form for consistency.
	const regexAdjective = morphologyData.adjectives.regexAdjective;
	const baseIfIcally = buildFormRule( word, createRulesFromArrays( regexAdjective.icallyToBase ) );
	if ( ! isUndefined( baseIfIcally ) ) {
		return baseIfIcally;
	}

	// No more quick guesses, we have to determine a verbal infinitive and an adjectival base.
	const possibleRegularBases = [];

	// Verbal infinitive.
	const baseIfVerb = getInfinitive( word, regexVerb ).infinitive;

	possibleRegularBases.push( baseIfVerb );

	// Adjectival base.
	const stopAdjectives = morphologyData.adjectives.stopAdjectives;
	/*
	 The following list of words are the stem of adjectives that have two syllables or more that receive -er and -est in their comparative and superlative forms, e.g 'shallow'.
	 Please note that if the adjective ends in -y and -e, the ending is removed, e.g. 'acute' -> 'acut'.
	 The list is not exhaustive and can be expanded if needed. Oxford dictionary was used to check if the forms indeed exist, e.g. "acuter".
	 */
	const multiSyllableAdjWithSuffixes = morphologyData.adjectives.multiSyllableAdjectives
		? morphologyData.adjectives.multiSyllableAdjectives.list
		: [];

	const baseIfAdjective = getAdjectiveStem( word, regexAdjective, stopAdjectives, multiSyllableAdjWithSuffixes ).base;
	possibleRegularBases.push( baseIfAdjective );

	return findShortestAndAlphabeticallyFirst( possibleRegularBases );
}

/**
 * Returns the stem of the input word using the morphologyData (language-specific).
 *
 * @param   {string} word           The word to get the stem for.
 * @param   {Object} morphologyData The available morphology data per language (false if unavailable).
 *
 * @returns {string} Stemmed (or base) form of the word.
 */
export function determineStem( word, morphologyData ) {
	const nounMorphology = morphologyData.nouns;

	const baseIfPossessive = buildFormRule( word, createRulesFromArrays( nounMorphology.regexNoun.possessiveToBase ) );

	let stem, irregular;

	// Determine if this is an irregular noun, adjective or verb.
	if ( isUndefined( baseIfPossessive ) ) {
		stem = word;
		// Word can be a noun, adjective or verb.
		irregular = determineIrregularStem( word, nounMorphology.irregularNouns ) ||
			determineIrregularStem( word, morphologyData.adjectives.irregularAdjectives ) ||
			determineIrregularVerbStem( word, morphologyData.verbs );
	} else {
		stem = baseIfPossessive;
		// The word is a possessive, it can only be a noun or an ing-noun;
		irregular = determineIrregularStem( baseIfPossessive, nounMorphology.irregularNouns );
	}

	if ( irregular ) {
		// Found the stem of an irregular word! Return it.
		return irregular;
	}

	// Treat the word as a regular noun, adjective or verb.
	return determineRegularStem( stem, morphologyData );
}

export default determineStem;
