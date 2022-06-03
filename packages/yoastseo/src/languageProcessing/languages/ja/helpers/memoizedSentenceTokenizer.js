import { memoize } from "lodash-es";
import SentenceTokenizer from "./internal/SentenceTokenizer";

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
	const paragraphTagsRegex = new RegExp( "^(<p>|</p>)$" );
	/*
	 * Filter block that contain only paragraph tags. This step is necessary
	 * since switching between editors might add extra paragraph tags with a new line tag in the end
	 * that are incorrectly converted into separate blocks.
	 */
	return ( tokens.length === 0 || paragraphTagsRegex.test( block ) ) ? [] : sentenceTokenizer.getSentencesFromTokens( tokens );
}

export default memoize( getSentenceTokenizer );
