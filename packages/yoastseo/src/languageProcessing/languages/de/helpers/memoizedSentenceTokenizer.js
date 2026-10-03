import { memoize } from "lodash";
import SentenceTokenizer from "./internal/SentenceTokenizer";

/**
 * Returns the sentences from a certain text.
 *
 * @param {string} text 					The text to retrieve sentences from.
 * @param {boolean} [trimSentences=true] 	Whether to trim whitespace from the beginning and end of the sentences or not.
 *
 * @returns {Array<string>} The list of sentences in the text.
 */
function getSentenceTokenizer( text, trimSentences = true ) {
	const sentenceTokenizer = new SentenceTokenizer();
	const { tokenizer, tokens } = sentenceTokenizer.createTokenizer();
	sentenceTokenizer.tokenize( tokenizer, text );

	return ( tokens.length === 0 ? [] : sentenceTokenizer.getSentencesFromTokens( tokens, trimSentences ) );
}

/*
 * The second argument to the memoize function is a so-called resolver function.
 * It creates a cache key consisting of a combination of all arguments to a function.
 * This is needed because by default, only the first argument to a function is used as the map cache key by the memoize function.
 * This means that a function is only re-run if the value of the first argument changes.
 * We want to re-run the getSentenceTokenizer function also when only the second argument changes to prevent cache collisions.
 * @see https://lodash.com/docs/4.17.15#memoize
 */
export default memoize( getSentenceTokenizer, ( ...args ) => JSON.stringify( args ) );
