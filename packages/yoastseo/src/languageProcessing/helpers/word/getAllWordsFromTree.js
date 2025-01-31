import getSentencesFromTree from "../sentence/getSentencesFromTree";
import { flatMap } from "lodash";
import removePunctuation from "../sanitize/removePunctuation";

/**
 * Merges words surrounding a separator into one word.
 *
 * @param {string[]} words The array of words to split and merge.
 * @param {string} separator The separator to split on.
 *
 * @returns {void} This function mutates the `words` array through splicing.
 */
function mergeBy( words, separator ) {
	while ( words.indexOf( separator ) !== -1 ) {
		// Special case: separator is at the beginning or end of the array: remove it.
		if ( words.indexOf( separator ) === 0 || words.indexOf( separator ) === words.length - 1 ) {
			words.splice( words.indexOf( separator ), 1 );
			continue;
		}

		// Default case: separator is in the middle of the array: merge the words surrounding it.
		const currentSeparator = words.indexOf( separator );
		const wordBefore = words[ currentSeparator - 1 ];
		const wordAfter = words[ currentSeparator + 1 ];
		words.splice( currentSeparator - 1, 3, wordBefore + separator + wordAfter );
	}
}

/**
 * Gets the words from the tokens.
 *
 * @param {Token[]} tokens The tokens to get the words from.
 * @param {boolean} splitOnHyphens Whether to split words on hyphens.
 *
 * @returns {string[]} Array of words retrieved from the tokens.
 */
export function getWordsFromTokens( tokens, splitOnHyphens = true ) {
	// Retrieve all texts from the tokens.
	let words = tokens.map( token => token.text );
	// Combine words separated by a hyphen, if needed.
	if ( ! splitOnHyphens ) {
		mergeBy( words, "-" );
	}
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
