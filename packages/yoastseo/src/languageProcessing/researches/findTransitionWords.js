import getSentencesFromTree from "../helpers/sentence/getSentencesFromTree";
import getAllWordsFromTree from "../helpers/word/getAllWordsFromTree";
import removeHtmlBlocks from "../helpers/html/htmlParser";
import { filterShortcodesFromHTML } from "../helpers/sanitize/filterShortcodesFromTree";
import { includesConsecutiveWords } from "../../scoring/assessments/inclusiveLanguage/helpers/includesConsecutiveWords";

/**
 * @typedef {import("../../languageProcessing/AbstractResearcher").default } Researcher
 * @typedef {import("../../values/").Paper } Paper
 * @typedef {import("../../parse/structure/Sentence").default } Sentence
 */

/**
 * @typedef {Object} SentenceWithTransitionWords An object containing a sentence and the transition words found in it.
 * @property {Sentence} sentence The sentence containing transition words.
 * @property {string[] | string[][]} transitionWords The found transition words in the sentence.
 */

/**
 * @typedef {Object} TransitionWordsResult An object containing the results of the transition words research.
 * @property {number} totalSentences The total number of sentences in the text.
 * @property {SentenceWithTransitionWords[]} sentenceResults The array of sentences containing transition words.
 * @property {number} transitionWordSentences The total number of sentences containing one or more transition words.
 * @property {number} textLength The length of the text in words or in characters, depending on the configuration.
 */

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
		const splitTransitionWord = transitionWord.toLocaleLowerCase().split( " " );
		// Retrieve the tokens per sentence, remove the spaces.
		const tokens = sentence.tokens.filter( token => token.text !== " " ).map( token => token.text.toLocaleLowerCase() );
		// Find the transitionWord in the tokens.
		return includesConsecutiveWords( tokens, splitTransitionWord ).length;
	} );
};

/**
 * Matches the sentence against two-part transition words.
 *
 * @param {Sentence} sentence The sentence to match against.
 * @param {string[][]} twoPartTransitionWords The array containing two-part transition words.
 * @returns {string[][]} The found two-part transition words.
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
 * @param {string[][]} twoPartTransitionWords The array containing two-part transition words.
 * @param {function} matchTransitionWordsHelper The language-specific helper function to match transition words in a sentence.
 *
 * @returns {SentenceWithTransitionWords[]} Array of sentence objects containing the complete sentence and the transition words.
 */
const checkSentencesForTransitionWords = function( sentences, transitionWords, twoPartTransitionWords, matchTransitionWordsHelper ) {
	/** @type {SentenceWithTransitionWords[]} */
	const results = [];

	sentences.forEach( sentence => {
		if ( twoPartTransitionWords ) {
			const twoPartMatches = matchTwoPartTransitionWords( sentence, twoPartTransitionWords );

			if ( twoPartMatches.length !== 0 ) {
				results.push( {
					sentence,
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
				sentence,
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
 * @returns {TransitionWordsResult} An object
 * with the total number of sentences in the text and the total number of sentences containing one or more transition words.
 */
export default function( paper, researcher ) {
	const customCountLength = researcher.getHelper( "customCountLength" );
	const matchTransitionWordsHelper = researcher.getHelper( "matchTransitionWordsHelper" );
	const transitionWords = researcher.getConfig( "transitionWords" );
	const twoPartTransitionWords = researcher.getConfig( "twoPartTransitionWords" );

	const sentences = getSentencesFromTree( paper.getTree() );
	const sentenceResults = checkSentencesForTransitionWords( sentences, transitionWords, twoPartTransitionWords, matchTransitionWordsHelper );

	let textLength = getAllWordsFromTree( paper ).length;
	if ( customCountLength ) {
		let text = paper.getText();
		text = removeHtmlBlocks( text );
		text = filterShortcodesFromHTML( text, paper._attributes?.shortcodes || [] );
		textLength = customCountLength( text );
	}

	return {
		sentenceResults,
		totalSentences: sentences.length,
		transitionWordSentences: sentenceResults.length,
		textLength,
	};
}
