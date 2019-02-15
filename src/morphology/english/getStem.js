import { buildOneFormFromRegex } from "../morphoHelpers/buildFormRule";
import createRulesFromMorphologyData from  "../morphoHelpers/createRulesFromMorphologyData.js";
import { getBase } from "./getAdjectiveForms";
import { getInfinitive, checkIrregulars as getIrregularVerbParadigm, endsWithIng } from "./getVerbForms.js";

import { isUndefined, uniq } from "lodash-es";
import { flatten } from "lodash-es";

/**
 * Gets the shortest of the alphabetically ordered strings from an array.
 *
 * @param {string[]} array  The array of strings.
 *
 * @returns {string} The shortest of the alphabetically ordered strings from the input array.
 */
export function getFirstAndShortest( array ) {
	array = uniq( flatten( array ) );

	// Sort alphabetically.
	array.sort();

	// Sort from shortest to longest.
	array.sort( function( a, b ) {
		return a.length - b.length;
	} );
	return array[ 0 ];
}

/**
 * Checks if the input word occurs in the list of exception nouns, verbs and adjectives and if so returns the first form
 * of the paradigm, which is always the base.
 *
 * @param {string} word                 The word for which to determine its base.
 * @param {Array} irregulars            An array of irregular nouns and adjectives.
 * @param {Object|false} verbMorphology Regexes and irregulars for verb morphology, False if verb rules should not be applied.
 *
 * @returns {string} The base form of the irregular word.
 */
export function getIrregularStem( word, irregulars, verbMorphology ) {
	let baseIfIrregular = "";

	irregulars.forEach( function( paradigm ) {
		if ( baseIfIrregular === "" ) {
			paradigm.forEach( function( wordInParadigm ) {
				if ( wordInParadigm === word ) {
					baseIfIrregular = paradigm[ 0 ];
				}
			} );
		}
	} );

	if ( baseIfIrregular === "" && verbMorphology ) {
		const paradigmIfIrregularVerb = getIrregularVerbParadigm( word, verbMorphology.irregularVerbs, verbMorphology.regexVerb.verbPrefixes );
		if ( ! isUndefined( paradigmIfIrregularVerb ) ) {
			baseIfIrregular = paradigmIfIrregularVerb[ 0 ];
		}
	}

	return baseIfIrregular;
}

/**
 * Gets possible stems as a regular noun, adjective and verb.
 *
 * @param{string} word              The word for which to determine its base.
 * @param{Object} morphologyData    The morphology data for the language.
 *
 * @returns{string} The shortest and the alphabetically-first of possible noun-like, verb-like and adjective-like bases.
 */
export function getRegularStem( word, morphologyData ) {
	// Try to singularize as a noun.
	const regexVerb = morphologyData.verbs.regexVerb;
	const baseIfPluralNoun = buildOneFormFromRegex( word, createRulesFromMorphologyData( morphologyData.nouns.regexNoun.singularize ) );
	if ( ! isUndefined( baseIfPluralNoun ) ) {
		// Bring ing-nouns to base forms ("blessings" -> "bless").
		if ( endsWithIng( baseIfPluralNoun ) ) {
			return buildOneFormFromRegex( baseIfPluralNoun, createRulesFromMorphologyData( regexVerb.ingFormToInfinitive ) );
		}
		return baseIfPluralNoun;
	}

	// Check if the word ends with "ic", "ical" or "ically". Return the "ical" form for consistency.
	const regexAdjective = morphologyData.adjectives.regexAdjective;
	const baseIfIcally = buildOneFormFromRegex( word, createRulesFromMorphologyData( regexAdjective.icallyToBase ) );
	if ( ! isUndefined( baseIfIcally ) ) {
		return baseIfIcally;
	}

	// No more quick guesses, we have to determine a verbal infinitive and an adjectival base.
	const possibleRegularBases = [];

	// Verbal infinitive.
	const sFormToInfinitiveRegex = createRulesFromMorphologyData( regexVerb.sFormToInfinitive );
	const ingFormToInfinitiveRegex = createRulesFromMorphologyData( regexVerb.ingFormToInfinitive );
	const edFormToInfinitiveRegex = createRulesFromMorphologyData( regexVerb.edFormToInfinitive );

	const baseIfVerb = getInfinitive( word, sFormToInfinitiveRegex, ingFormToInfinitiveRegex, edFormToInfinitiveRegex ).infinitive;

	if ( ! isUndefined( baseIfVerb ) ) {
		possibleRegularBases.push( baseIfVerb );
	}

	// Adjectival base.
	const comparativeToBaseRegex = createRulesFromMorphologyData( regexAdjective.comparativeToBase );
	const superlativeToBaseRegex = createRulesFromMorphologyData( regexAdjective.superlativeToBase );
	const adverbToBaseRegex = createRulesFromMorphologyData( regexAdjective.adverbToBase );
	const lyExceptions = morphologyData.adjectives.stopAdverbs;

	const baseIfAdjective = getBase( word, comparativeToBaseRegex, superlativeToBaseRegex, adverbToBaseRegex, lyExceptions ).base;
	if ( ! isUndefined( baseIfAdjective ) ) {
		possibleRegularBases.push( baseIfAdjective );
	}

	return getFirstAndShortest( possibleRegularBases );
}

/**
 * Returns the stem of the input word using the morphologyData (language-specific).
 *
 * @param   {string} word           The word to get the stem for.
 * @param   {Object} morphologyData The available morphology data per language (false if unavailable).
 *
 * @returns {string} Stemmed (or base) form of the word.
 */
export function getStem( word, morphologyData ) {
	if ( ! morphologyData ) {
		return word;
	}

	let bestBase = word;

	const nounMorphology = morphologyData.nouns;
	let verbMorphology = morphologyData.verbs;

	let irregulars = [].concat(
		nounMorphology.irregularNouns,
		morphologyData.adjectives.irregularAdjectives,
	);

	const baseIfPossessive = buildOneFormFromRegex( word, createRulesFromMorphologyData( nounMorphology.regexNoun.possessiveToBase ) );
	// If the word is a possessive, it can only be a noun or an ing-noun.
	if ( ! isUndefined( baseIfPossessive ) ) {
		bestBase = baseIfPossessive;

		// Only check for nouns.
		irregulars = nounMorphology.irregularNouns;
		verbMorphology = false;
	}

	const baseIfIrregular = getIrregularStem( bestBase, irregulars, verbMorphology );

	if ( baseIfIrregular !== "" ) {
		return baseIfIrregular;
	}

	return getRegularStem( bestBase, morphologyData );
}
