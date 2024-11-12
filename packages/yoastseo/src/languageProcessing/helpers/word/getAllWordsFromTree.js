import getSentencesFromTree from "../sentence/getSentencesFromTree";
import { flatMap } from "lodash";
import removePunctuation from "../sanitize/removePunctuation";

/**
 * Gets the words from the tokens.
 *
 * @param {Token[]} tokens The tokens to get the words from.
 *
 * @returns {string[]} Array of words retrieved from the tokens.
 */
export function getWordsFromTokens( tokens ) {
	// Retrieve all texts from the tokens.
	let words = tokens.map( token => token.text );
	// Remove punctuation and spaces.
	words = words.map( token => removePunctuation( token ) );
	// Filter out empty tokens.
	return words.filter( word => word.trim() !== "" );
}

/**
 * Gets the words from the tree, i.e. from the paragraph and heading nodes.
 * These two node types are the nodes that should contain words for the analysis.
 *
 * @param {Paper} paper The paper to get the tree and words from.
 *
 * @returns {string[]} Array of words retrieved from the tree.
 */
export default function( paper ) {
	const sentences = getSentencesFromTree( paper );
	// Get all the tokens from each sentence.
	const tokens = flatMap( sentences.map( sentence => sentence.tokens ) );
	return getWordsFromTokens( tokens );
}
