import getWords from "../word/getWords.js";
import { normalizeSingle } from "../sanitize/quotes";

import { includes, isUndefined, escapeRegExp, memoize } from "lodash-es";

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
 * @param {string}          keyphrase       The keyphrase of the paper (or a synonym phrase) to get stem for.
 * @param {Function|null}   stem            The language-specific stemmer (if available).
 * @param {Object}          morphologyData  The available morphology data per language (false if unavailable).
 * @param {string[]}        functionWords   The language-specific function words.
 *
 * @returns {TopicPhrase} Object with an array of StemOriginalPairs of all (content) words in the keyphrase or synonym
 * phrase and information about whether the keyphrase/synonym should be matched exactly.
 */
const buildStems = function( keyphrase, stem, morphologyData, functionWords ) {
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

	let keyphraseWords = getWords( keyphrase );

	// Filter function words from keyphrase. Don't filter if the keyphrase only consists of function words.
	const wordsWithoutFunctionWords = keyphraseWords.filter( keyphraseWords, ( word ) => ! functionWords.includes( word ) );
	if ( wordsWithoutFunctionWords.length > 0 ) {
		keyphraseWords = wordsWithoutFunctionWords;
	}

	// Return a stem-original pair with a stem or the original word as stem if no stemmer is available.
	const stemOriginalPairs = keyphraseWords.map( word => {
		return new StemOriginalPair(
			stem ? stem( normalizeSingle( escapeRegExp( word ) ), morphologyData ) : word,
			word,
		);
	} );

	return new TopicPhrase( stemOriginalPairs );
};

/**
 * Builds stems of words of the keyphrase and of each synonym phrase.
 *
 * @param {string}          keyphrase       The paper's keyphrase.
 * @param {string[]}        synonyms        The paper's synonyms.
 * @param {Function|null}   stem            The language-specific stemmer (if available).
 * @param {Object}          morphologyData  The available morphology data to be used by the getStem function (language specific).
 * @param {string[]}        functionWords   The language-specific function words.
 *
 * @returns {Object} Object with an array of stems of words in the keyphrase and an array of arrays of stems of words in the synonyms.
 */
const collectKeyphraseAndSynonymsStems = function( keyphrase, synonyms, stem, morphologyData, functionWords ) {
	const keyphraseStems = buildStems( keyphrase, stem, morphologyData, functionWords );
	const synonymsStems = synonyms.map( synonym => buildStems( synonym, stem, morphologyData, functionWords ) );

	return {
		keyphraseStems,
		synonymsStems,
	};
};

/**
 * Caches stems depending on the currently available morphologyData and (separately) keyphrase, synonyms,
 * stemmer and function words. In this way, if the morphologyData remains the same in multiple calls of this function, the function
 * that collects actual stems only needs to check if the keyphrase, synonyms, stemmer an function words also remain the
 * same to return the cached result. The joining of keyphrase, synonyms, stemmer and function words for this function is needed,
 * because by default memoize caches by the first key only, which in the current case would mean that the function would
 * return the cached forms if the keyphrase has not changed (without checking if synonyms, stemmer, or function words were changed).
 *
 * @param {Object|boolean} morphologyData The available morphology data.
 *
 * @returns {function} The function that collects the stems for a given set of keyphrase, synonyms, stemmer,
 * morphology data and function words.
 */
const primeMorphologyData = memoize( ( morphologyData ) => {
	return memoize( ( keyphrase, synonyms, stem, functionWords ) => {
		return collectKeyphraseAndSynonymsStems( keyphrase, synonyms, stem, morphologyData, functionWords );
	}, ( keyphrase, synonyms, stem, functionWords ) => {
		return keyphrase + "," + synonyms + "," + stem + "," + functionWords;
	} );
} );

/**
 * Retrieves stems of words of the keyphrase and of each synonym phrase using the function that caches
 * the results of previous calls of this function.
 *
 * @param {string}          keyphrase       The keyphrase.
 * @param {string[]}        synonyms        The synonyms.
 * @param {Function|null}   stem            The language-specific stemmer (if available).
 * @param {Object}          morphologyData  The language-specific morphology data.
 * @param {string[]}        functionWords   The language-specific function words.
 *
 * @returns {Object} Object with an array of stems of words in the keyphrase and an array of arrays of stems of words in the synonyms.
 */
function collectStems( keyphrase, synonyms, stem, morphologyData, functionWords ) {
	const collectStemsWithMorphologyData = primeMorphologyData( morphologyData );

	return collectStemsWithMorphologyData( keyphrase, synonyms, stem, functionWords );
}

export {
	buildStems,
	collectStems,
	TopicPhrase,
	StemOriginalPair,
};
