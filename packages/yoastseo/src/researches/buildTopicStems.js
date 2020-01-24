import getStemForLanguageFactory from "../helpers/getStemForLanguage.js";

import filterFunctionWordsFromArray from "../helpers/filterFunctionWordsFromArray.js";
import getWords from "../stringProcessing/getWords.js";
import parseSynonyms from "../stringProcessing/parseSynonyms";
import { normalizeSingle } from "../stringProcessing/quotes";

import { includes } from "lodash-es";
import { isUndefined } from "lodash-es";
import { escapeRegExp } from "lodash-es";
import { memoize } from "lodash-es";

const getStemForLanguage = getStemForLanguageFactory();

/**
 * Analyzes the focus keyword string or one synonym phrase.
 * Checks if morphology is requested or if the user wants to match exact string.
 * If morphology is required the module finds a stem for all words (if no function words list available) or
 * for all content words (i.e., excluding prepositions, articles, conjunctions, if the function words list is available).
 *
 * @param {string} keyphrase The keyphrase of the paper (or a synonym phrase) to get stemd for.
 * @param {string} language The language to use for morphological analyzer and for function words.
 * @param {Object} morphologyData The available morphology data per language (false if unavailable).
 *
 * @returns {Array} Array of stems of all (content) words in the keyphrase or synonym phrase.
 */
const buildStems = function( keyphrase, language, morphologyData ) {
	if ( isUndefined( keyphrase ) || keyphrase === "" ) {
		return [];
	}

	// If the keyphrase is embedded in double quotation marks, return keyword itself, without outer-most quotation marks.
	const doubleQuotes = [ "“", "”", "〝", "〞", "〟", "‟", "„", "\"" ];
	if ( includes( doubleQuotes, keyphrase[ 0 ] ) && includes( doubleQuotes, keyphrase[ keyphrase.length - 1 ] ) ) {
		keyphrase = keyphrase.substring( 1, keyphrase.length - 1 );
		return [ escapeRegExp( keyphrase ) ];
	}

	const words = filterFunctionWordsFromArray( getWords( keyphrase ), language );
	const getStem = getStemForLanguage[ language ];

	// Simply returns lowCased words from the keyphrase if morphological forms cannot be built.
	if ( morphologyData === false || isUndefined( getStem ) ) {
		return words.map( word => normalizeSingle( escapeRegExp( word.toLocaleLowerCase( language ) ) ) );
	}

	return words.map( word => {
		const lowCaseWord = escapeRegExp( word.toLocaleLowerCase( language ) );
		return getStem( normalizeSingle( lowCaseWord ), morphologyData );
	} );
};

/**
 * Builds stems of words of the keyphrase and of each synonym phrase.
 *
 * @param {string} keyphrase The paper's keyphrase.
 * @param {string} synonyms The paper's synonyms.
 * @param {string} language The paper's language.
 * @param {Object} morphologyData The available morphology data to be used by the getStem function (language specific).
 *
 * @returns {Object} Object with an array of stems of words in the keyphrase and an array of arrays of stems of words in the synonyms.
 */
const collectKeyphraseAndSynonymsStems = function( keyphrase, synonyms, language = "en", morphologyData ) {
	const synonymsSplit = parseSynonyms( synonyms );

	const keyphraseStems = buildStems( keyphrase, language, morphologyData );
	const synonymsStems = synonymsSplit.map( synonym => buildStems( synonym, language, morphologyData ) );

	return {
		keyphraseStems,
		synonymsStems,
	};
};

/**
 * Caches stems depending on the currently available morphologyData and (separately) keyphrase, synonyms,
 * and language. In this way, if the morphologyData remains the same in multiple calls of this function, the function
 * that collects actual stems only needs to check if the keyphrase, synonyms and language also remain the
 * same to return the cached result. The joining of keyphrase, synonyms and language for this function is needed,
 * because by default memoize caches by the first key only, which in the current case would mean that the function would
 * return the cached forms if the keyphrase has not changed (without checking if synonyms and language were changed).
 *
 * @param {Object|boolean} morphologyData The available morphology data.
 *
 * @returns {function} The function that collects the stems for a given set of keyphrase, synonyms, language and
 * morphologyData.
 */
const primeMorphologyData = memoize( ( morphologyData ) => {
	return memoize( ( keyphrase, synonyms, language = "en" ) => {
		return collectKeyphraseAndSynonymsStems( keyphrase, synonyms, language, morphologyData );
	}, ( keyphrase, synonyms, language ) => {
		return keyphrase + "," + synonyms + "," + language;
	} );
} );


/**
 * Retrieves stems of words of the keyphrase and of each synonym phrase using the function that caches
 * the results of previous calls of this function.
 *
 * @param {string} keyphrase The paper's keyphrase.
 * @param {string} synonyms The paper's synonyms.
 * @param {string} language The paper's language.
 * @param {Object} morphologyData The available morphology data to be used by the getStems function (language specific).
 *
 * @returns {Object} Object with an array of stems of words in the keyphrase and an array of arrays of stems of words in the synonyms.
 */
function collectStems( keyphrase, synonyms, language = "en", morphologyData ) {
	const collectStemsWithMorphologyData = primeMorphologyData( morphologyData );

	return collectStemsWithMorphologyData( keyphrase, synonyms, language );
}

export {
	buildStems,
	collectStems,
};
