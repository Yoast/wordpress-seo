import createRegexFromDoubleArray from "../helpers/regex/createRegexFromDoubleArray.js";
import { normalizeSingle as normalizeSingleQuotes } from "../helpers/sanitize/quotes.js";
import { isWordInSentence as matchWordInSentence } from "../helpers/word/matchWordInSentence.js";

import { flattenDeep } from "lodash-es";
import getSentencesFromTree from "../helpers/sentence/getSentencesFromTree";

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
	return transitionWords.filter( transitionWord => {
		// Split into [ "as", "can", "be", "seen" ]
		transitionWord = transitionWord.toLocaleLowerCase().split( " " );

		// Single words we can just find in the tokens.
		if ( transitionWord.length === 1 ) {
			return sentence.tokens.find( token => token.text.toLocaleLowerCase() === transitionWord[ 0 ] );
		}

		// For multiple words, we need to (1) find them, (2) check if all have been found, (3) check if they are in order.
		// Problem: what if the words appear multiple times in the sentence? We really need them to be in order.
		const wordIndices = transitionWord.map( word => sentence.tokens.findIndex( token => {
			return token.text.toLocaleLowerCase() === word;
		} ) );
		if ( wordIndices.includes( -1 ) ) {
			return false;
		}
		return wordIndices.every( ( wordIndex, i ) => i === wordIndices.length - 1 || wordIndex + 2 === wordIndices[ i + 1 ] );
	} );
};

/**
 * Checks the passed sentences to see if they contain transition words.
 *
 * @param {Array} sentences The sentences to match against.
 * @param {Array} transitionWords The array containing transition words.
 * @param {Array} twoPartTransitionWords The array containing two part transition words.
 * @param {function} matchTransitionWordsHelper The language-specific helper function to match transition words in a sentence.
 *
 * @returns {Array} Array of sentence objects containing the complete sentence and the transition words.
 */
const checkSentencesForTransitionWords = function( sentences, transitionWords, twoPartTransitionWords, matchTransitionWordsHelper ) {
	const results = [];

	sentences.forEach( sentence => {
		if ( twoPartTransitionWords ) {
			const twoPartMatches = matchTwoPartTransitionWords( sentence.text, twoPartTransitionWords );

			if ( twoPartMatches !== null ) {
				results.push( {
					sentence: sentence.text,
					transitionWords: twoPartMatches,
				} );

				return;
			}
		}

		const transitionWordMatches = matchTransitionWordsHelper
			? matchTransitionWordsHelper( sentence, transitionWords )
			: matchTransitionWords( sentence, transitionWords );

		if ( transitionWordMatches.length !== 0 ) {
			results.push( {
				sentence: sentence.text,
				transitionWords: transitionWordMatches,
			} );
		}
	} );

	return results;
};

/**
 * Checks how many sentences from a text contain at least one transition word or two-part transition word
 * that are defined in the transition words config and two part transition words config.
 *
 * @param {Paper} paper The Paper object to get text from.
 * @param {Researcher} researcher The researcher.
 *
 * @returns {object} An object with the total number of sentences in the text
 *                   and the total number of sentences containing one or more transition words.
 */
export default function( paper, researcher ) {
	const matchTransitionWordsHelper = researcher.getHelper( "matchTransitionWordsHelper" );
	const transitionWords = researcher.getConfig( "transitionWords" );
	const twoPartTransitionWords = researcher.getConfig( "twoPartTransitionWords" );

	const sentences = getSentencesFromTree( paper );
	const sentenceResults = checkSentencesForTransitionWords( sentences, transitionWords, twoPartTransitionWords, matchTransitionWordsHelper );

	return {
		totalSentences: sentences.length,
		sentenceResults: sentenceResults,
		transitionWordSentences: sentenceResults.length,
	};
}
