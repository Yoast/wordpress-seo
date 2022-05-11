// Lodash imports.
import { filter } from "lodash-es";
import { flatMap } from "lodash-es";
import { isEmpty } from "lodash-es";
import { negate } from "lodash-es";
import { memoize } from "lodash-es";

// Internal dependencies.
import { getBlocks } from "../html/html.js";
import sanitizeString from "../sanitize/sanitizeString";
import SentenceTokenizer from "./SentenceTokenizer";

// Character classes.
const newLines = "\n\r|\n|\r";

// Regular expressions.
const newLineRegex = new RegExp( newLines );

/**
 * Returns the sentences from a certain block.
 *
 * @param {string} block The HTML inside a HTML block.
 * @returns {Array<string>} The list of sentences in the block.
 */
function getSentenceTokenizer( block ) {
	const sentenceTokenizer = new SentenceTokenizer();
	const { tokenizer, tokens } = sentenceTokenizer.createTokenizer();
	sentenceTokenizer.tokenize( tokenizer, block );

	return tokens.length === 0 ? [] : sentenceTokenizer.getSentencesFromTokens( tokens );
}

const getSentencesFromBlockCached = memoize( getSentenceTokenizer );
/**
 * Returns sentences in a string.
 *
 * @param {String} text The string to count sentences in.
 * @returns {Array} Sentences found in the text.
 */
export default function( text ) {
	// Unify whitespaces and non-breaking spaces, remove table of content and strip the tags and multiple spaces.
	text = sanitizeString( text );
	let blocks = getBlocks( text );

	// Split each block on newlines.
	blocks = flatMap( blocks, function( block ) {
		return block.split( newLineRegex );
	} );

	const sentences = flatMap( blocks, getSentencesFromBlockCached );

	return filter( sentences, negate( isEmpty ) );
}
