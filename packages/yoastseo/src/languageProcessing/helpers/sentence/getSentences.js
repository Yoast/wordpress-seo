// Lodash imports.
import { filter, flatMap, isEmpty, negate, memoize } from "lodash-es";

// Internal dependencies.
import { getBlocks } from "../html/html.js";
import excludeTableOfContentsTag from "../sanitize/excludeTableOfContentsTag";
import { unifyNonBreakingSpace } from "../sanitize/unifyWhitespace";
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
	// We don't remove the other HTML tags here since removing them might lead to incorrect results when running the sentence tokenizer.
	// Remove Table of Contents.
	text = excludeTableOfContentsTag( text );
	// Unify only non-breaking spaces and not the other whitespaces since a whitespace could signify a sentence break or a new line.
	text = unifyNonBreakingSpace( text );

	let blocks = getBlocks( text );

	// Split each block on newlines.
	blocks = flatMap( blocks, function( block ) {
		return block.split( newLineRegex );
	} );

	let sentences = flatMap( blocks, getSentencesFromBlockCached );
	const paragraphTagsRegex = new RegExp( "^(<p>|</p>)$" );
	// Filter sentences that contain only paragraph tags.
	// This step is necessary since switching between editors might add extra paragraph tags that are not properly sanitized in the previous steps.
	sentences = filter( sentences, sentence => ! paragraphTagsRegex.test( sentence ) );

	return filter( sentences, negate( isEmpty ) );
}
