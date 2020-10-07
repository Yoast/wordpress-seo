import filterFunctionWordsFromArray from "../../helpers/filterFunctionWordsFromArray.js";
import retrieveStemmer from "../../helpers/retrieveStemmer.js";
import getWords from "../../helpers/word/getWords.js";
import parseSynonyms from "../../helpers/sanitize/parseSynonyms";
import { normalizeSingle } from "../../helpers/sanitize/quotes";

import { includes } from "lodash-es";
import { isUndefined } from "lodash-es";
import { escapeRegExp } from "lodash-es";
import { memoize } from "lodash-es";

/**
 * A topic phrase (i.e., a keyphrase or synonym) with stem-original pairs for the words in the topic phrase.
 *
 * @param {StemOriginalPair[]} stemOriginalPairs   The stem-original pairs for the words in the topic phrase.
 * @param {boolean}            exactMatch          Whether the topic phrase is an exact match.
 *
 * @constructor
 */
function TopicPhrase( stemOriginalPairs = [], exactMatch = false ) {
	this.stemOriginalPairs = stemOriginalPairs;
	this.exactMatch = exactMatch;
}

/**
 * Returns all stems in the topic phrase.
 *
 * @returns {string[]|[]} The stems in the topic phrase or empty array if the topic phrase is exact match.
 */
TopicPhrase.prototype.getStems = function() {
	// An exact match keyphrase doesn't have stems.
	if ( this.exactMatch ) {
		return [];
	}

	return this.stemOriginalPairs.map( stemOriginalPair => stemOriginalPair.stem );
};

/**
 * A stem-original pair ƒor a word in a topic phrase.
 *
 * @param {string}  stem        The stem of the topic phrase word.
 * @param {string}  original    The original word form the topic phrase (unsanitized)
 *
 * @constructor
 */
function StemOriginalPair( stem, original ) {
	this.stem = stem;
	this.original = original;
}

/**
 * Analyzes the focus keyword string or one synonym phrase.
 * Checks if morphology is requested or if the user wants to match exact string.
 * If morphology is required the module finds a stem for all words (if no function words list available) or
 * for all content words (i.e., excluding prepositions, articles, conjunctions, if the function words list is available).
 *
 * @param {string} keyphrase The keyphrase of the paper (or a synonym phrase) to get stem for.
 * @param {string} language The language to use for morphological analyzer and for function words.
 * @param {Object} morphologyData The available morphology data per language (false if unavailable).
 *
 * @returns {TopicPhrase} Object with an array of StemOriginalPairs of all (content) words in the keyphrase or synonym
 * phrase and information about whether the keyphrase/synonym should be matched exactly.
 */
const buildStems = function( keyphrase, language, morphologyData ) {
	if ( isUndefined( keyphrase ) || keyphrase === "" ) {
		return new TopicPhrase();
	}

	// If the keyphrase is embedded in double quotation marks, return keyword itself, without outer-most quotation marks.
	const doubleQuotes = [ "“", "”", "〝", "〞", "〟", "‟", "„", "\"" ];
	if ( includes( doubleQuotes, keyphrase[ 0 ] ) && includes( doubleQuotes, keyphrase[ keyphrase.length - 1 ] ) ) {
		keyphrase = keyphrase.substring( 1, keyphrase.length - 1 );
		return new TopicPhrase(
			[ new StemOriginalPair( escapeRegExp( keyphrase ), keyphrase ) ],
			true
		);
	}

	const words = filterFunctionWordsFromArray( getWords( keyphrase ), language );

	/**
	 * Extract a stemming function (if available, and if there is morphologyData available for this language).
	 * Otherwise, take an identity function.
	 */
	const getStem = retrieveStemmer( language, morphologyData );

	const stemOriginalPairs = words.map( word => {
		const lowCaseWord = escapeRegExp( word.toLocaleLowerCase( language ) );
		return new StemOriginalPair(
			getStem( normalizeSingle( lowCaseWord ), morphologyData ),
			word,
		);
	} );

	return new TopicPhrase( stemOriginalPairs );
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
	TopicPhrase,
	StemOriginalPair,
};
