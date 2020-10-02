import createRegexFromDoubleArray from "../stringProcessing/createRegexFromDoubleArray.js";
import getSentences from "../stringProcessing/getSentences.js";
import { normalizeSingle as normalizeSingleQuotes } from "../stringProcessing/quotes.js";
import getTransitionWords from "../helpers/getTransitionWords.js";
import { isWordInSentence as matchWordInSentence } from "../stringProcessing/matchWordInSentence.js";

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
const matchTwoPartTransitionWords = function( sentence, twoPartTransitionWords ) {
	sentence = normalizeSingleQuotes( sentence );
	const twoPartTransitionWordsRegex = getRegexFromDoubleArray( twoPartTransitionWords );
	return sentence.match( twoPartTransitionWordsRegex );
};

/**
 * Matches the sentence against transition words.
 *
 * @param {string} sentence The sentence to match against.
 * @param {Array} transitionWords The array containing transition words.
 * @returns {Array} The found transitional words.
 */
const matchTransitionWords = function( sentence, transitionWords ) {
	sentence = normalizeSingleQuotes( sentence );
	return transitionWords.filter( word => matchWordInSentence( word, sentence ) );
};

/**
 * Checks the passed sentences to see if they contain transition words.
 *
 * @param {Array} sentences The sentences to match against.
 * @param {Object} transitionWords The object containing both transition words and two part transition words.
 * @returns {Array} Array of sentence objects containing the complete sentence and the transition words.
 */
const checkSentencesForTransitionWords = function( sentences, transitionWords ) {
	const results = [];

	sentences.forEach( sentence => {
		const twoPartMatches = matchTwoPartTransitionWords( sentence, transitionWords.twoPartTransitionWords() );

		if ( twoPartMatches !== null ) {
			results.push( {
				sentence: sentence,
				transitionWords: twoPartMatches,
			} );

			return;
		}

		const transitionWordMatches = matchTransitionWords( sentence, transitionWords.transitionWords );

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
	const locale = paper.getLocale();
	const transitionWords = getTransitionWords( locale );
	const sentences = getSentences( paper.getText() );
	const sentenceResults = checkSentencesForTransitionWords( sentences, transitionWords );

	return {
		totalSentences: sentences.length,
		sentenceResults: sentenceResults,
		transitionWordSentences: sentenceResults.length,
	};
}
