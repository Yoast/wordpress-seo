import getSentencesFromTree from "../helpers/sentence/getSentencesFromTree";
import { includesConsecutiveWords } from "../../scoring/assessments/inclusiveLanguage/helpers/includesConsecutiveWords";

/**
 * Matches the sentence against transition words.
 *
 * @param {Sentence} sentence The sentence to match against.
 * @param {string[]} transitionWords The array containing transition words.
 * @returns {string[]} The found transition words.
 */
const matchTransitionWords = function( sentence, transitionWords ) {
	return transitionWords.filter( transitionWord => {
		// Splits "as I have noted" into [ "as", "i", "have", "noted" ]
		transitionWord = transitionWord.toLocaleLowerCase().split( " " );
		// Retrieve the tokens per sentence, remove the spaces.
		const tokens = sentence.tokens.filter( token => token.text !== " " ).map( token => token.text.toLocaleLowerCase() );
		// Find the transitionWord in the tokens.
		return includesConsecutiveWords( tokens, transitionWord ).length;
	} );
};

/**
 * Matches the sentence against two-part transition words.
 *
 * @param {Sentence} sentence The sentence to match against.
 * @param {Array.<Array.<string>>} twoPartTransitionWords The array containing two-part transition words.
 * @returns {string[]} The found two-part transition words.
 */
const matchTwoPartTransitionWords = function( sentence, twoPartTransitionWords ) {
	return twoPartTransitionWords.filter( twoPartTransitionWord => {
		const first = twoPartTransitionWord[ 0 ];
		const second = twoPartTransitionWord[ 1 ];
		const firstFound = matchTransitionWords( sentence, [ first ] );
		const secondFound = matchTransitionWords( sentence, [ second ] );

		return firstFound.length && secondFound.length;
	} );
};

/**
 * Checks the passed sentences to see if they contain transition words.
 *
 * @param {Sentence[]} sentences The sentences to match against.
 * @param {string[]} transitionWords The array containing transition words.
 * @param {Array.<Array.<string>>} twoPartTransitionWords The array containing two-part transition words.
 * @param {function} matchTransitionWordsHelper The language-specific helper function to match transition words in a sentence.
 *
 * @returns {{sentence: string, transitionWords: string[]}[]} Array of sentence objects containing the complete sentence and the transition words.
 */
const checkSentencesForTransitionWords = function( sentences, transitionWords, twoPartTransitionWords, matchTransitionWordsHelper ) {
	const results = [];

	sentences.forEach( sentence => {
		if ( twoPartTransitionWords ) {
			const twoPartMatches = matchTwoPartTransitionWords( sentence, twoPartTransitionWords );

			if ( twoPartMatches.length !== 0 ) {
				results.push( {
					sentence: sentence.text,
					transitionWords: twoPartMatches,
				} );

				return;
			}
		}

		const transitionWordMatches = matchTransitionWordsHelper
			? matchTransitionWordsHelper( sentence.text, transitionWords )
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
 * that are defined in the transition words config and two-part transition words config.
 *
 * @param {Paper} paper The Paper object to get text from.
 * @param {Researcher} researcher The researcher.
 *
 * @returns {{totalSentences: number, sentenceResults: {sentence: string, transitionWords: string[]}[], transitionWordSentences: number}} An object
 * with the total number of sentences in the text and the total number of sentences containing one or more transition words.
 */
export default function( paper, researcher ) {
	const matchTransitionWordsHelper = researcher.getHelper( "matchTransitionWordsHelper" );
	const transitionWords = researcher.getConfig( "transitionWords" );
	const twoPartTransitionWords = researcher.getConfig( "twoPartTransitionWords" );

	const sentences = getSentencesFromTree( paper.getTree() );
	const sentenceResults = checkSentencesForTransitionWords( sentences, transitionWords, twoPartTransitionWords, matchTransitionWordsHelper );

	return {
		totalSentences: sentences.length,
		sentenceResults: sentenceResults,
		transitionWordSentences: sentenceResults.length,
	};
}
