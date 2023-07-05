import getSentencesFromTree from "../sentence/getSentencesFromTree";
import { flatMap } from "lodash-es";
import removePunctuation from "../sanitize/removePunctuation";

/**
 * Gets the words from the tree, i.e. from the paragraph and heading nodes.
 * These two node types are the nodes that should contain words for the analysis.
 *
 * @param {Paper} paper The paper to get the tree and words from.
 *
 * @returns {String[]} Array of words retrieved from the tree.
 */
export default function( paper ) {
	const sentences = getSentencesFromTree( paper );
	// Get all the tokens from each sentence.
	const tokens = sentences.map( sentence => sentence.tokens );
	let words = flatMap( tokens ).map( token => token.text );
	// Remove punctuation and spaces.
	words = words.map( token => removePunctuation( token ) );

	// Filter out empty tokens.
	return words.filter( word => word.trim() !== "" );
}
