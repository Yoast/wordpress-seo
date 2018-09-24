import createRegexFromDoubleArray from "../stringProcessing/createRegexFromDoubleArray.js";
import getSentences from "../stringProcessing/getSentences.js";
import { normalizeSingle as normalizeSingleQuotes } from "../stringProcessing/quotes.js";
import getTransitionWords from "../helpers/getTransitionWords.js";
import { isWordInSentence as matchWordInSentence } from "../stringProcessing/matchWordInSentence.js";

import { forEach } from "lodash-es";
import { filter } from "lodash-es";
import { flattenDeep } from "lodash-es";

let regexFromDoubleArray = null;
let regexFromDoubleArrayCacheKey = "";

/**
 * Memoizes the createRegexFromDoubleArray with the twoPartTransitionWords.
 *
 * @param {Array} twoPartTransitionWords The array containing two-part transition words.
 *
 * @returns {RegExp} The RegExp to match text with a double array.
 */
function getRegexFromDoubleArray( twoPartTransitionWords ) {
	const cacheKey = flattenDeep( twoPartTransitionWords ).join( "" );
	if ( regexFromDoubleArrayCacheKey !== cacheKey || regexFromDoubleArray === null ) {
		regexFromDoubleArrayCacheKey = cacheKey;
		regexFromDoubleArray = createRegexFromDoubleArray( twoPartTransitionWords );
	}
	return regexFromDoubleArray;
}

/**
 * Matches the sentence against two part transition words.
 *
 * @param {string} sentence The sentence to match against.
 * @param {Array} twoPartTransitionWords The array containing two-part transition words.
 * @returns {Array} The found transitional words.
 */
var matchTwoPartTransitionWords = function( sentence, twoPartTransitionWords ) {
	sentence = normalizeSingleQuotes( sentence );
	var twoPartTransitionWordsRegex = getRegexFromDoubleArray( twoPartTransitionWords );
	return sentence.match( twoPartTransitionWordsRegex );
};

/**
 * Matches the sentence against transition words.
 *
 * @param {string} sentence The sentence to match against.
 * @param {Array} transitionWords The array containing transition words.
 * @returns {Array} The found transitional words.
 */
var matchTransitionWords = function( sentence, transitionWords ) {
	sentence = normalizeSingleQuotes( sentence );

	var matchedTransitionWords = filter( transitionWords, function( word ) {
		return matchWordInSentence( word, sentence );
	} );

	return matchedTransitionWords;
};

/**
 * Checks the passed sentences to see if they contain transition words.
 *
 * @param {Array} sentences The sentences to match against.
 * @param {Object} transitionWords The object containing both transition words and two part transition words.
 * @returns {Array} Array of sentence objects containing the complete sentence and the transition words.
 */
var checkSentencesForTransitionWords = function( sentences, transitionWords ) {
	var results = [];

	forEach( sentences, function( sentence ) {
		var twoPartMatches = matchTwoPartTransitionWords( sentence, transitionWords.twoPartTransitionWords() );

		if ( twoPartMatches !== null ) {
			results.push( {
				sentence: sentence,
				transitionWords: twoPartMatches,
			} );

			return;
		}

		var transitionWordMatches = matchTransitionWords( sentence, transitionWords.transitionWords );

		if ( transitionWordMatches.length !== 0 ) {
			results.push( {
				sentence: sentence,
				transitionWords: transitionWordMatches,
			} );

			return;
		}
	} );

	return results;
};

/**
 * Checks how many sentences from a text contain at least one transition word or two-part transition word
 * that are defined in the transition words config and two part transition words config.
 *
 * @param {Paper} paper The Paper object to get text from.
 * @returns {object} An object with the total number of sentences in the text
 * and the total number of sentences containing one or more transition words.
 */
export default function( paper ) {
	var locale = paper.getLocale();
	var transitionWords = getTransitionWords( locale );
	var sentences = getSentences( paper.getText() );
	var sentenceResults = checkSentencesForTransitionWords( sentences, transitionWords );

	return {
		totalSentences: sentences.length,
		sentenceResults: sentenceResults,
		transitionWordSentences: sentenceResults.length,
	};
}
