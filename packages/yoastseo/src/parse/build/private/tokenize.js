import { Heading, Paragraph } from "../../structure";
import getSentencePositions from "./getSentencePositions";

/**
 * Splits the sentence into tokens and puts them on the sentence.
 *
 * @param {Sentence} sentence The sentence.
 * @param {function} splitIntoTokens The function to use to split the sentence into tokens.
 *
 * @returns {Sentence} The sentence, with tokens.
 */
function getTokens( sentence, splitIntoTokens ) {
	sentence.tokens = splitIntoTokens( sentence );
	return sentence;
}

/**
 * Splits the node's inner text into sentences, and the sentences into tokens,
 * using the language processor.
 *
 * @param {Node} node The node to split into sentences.
 * @param {LanguageProcessor} languageProcessor The language processor to use.
 *
 * @returns {Sentence[]} The node's sentences.
 */
function getSentences( node, languageProcessor ) {
	// Split text into sentences.
	let sentences = languageProcessor.splitIntoSentences( node.innerText() );
	// Add position information to the sentences.
	sentences = getSentencePositions( node, sentences );
	// Tokenize sentences into tokens.
	return sentences.map( sentence => getTokens( sentence, languageProcessor.splitIntoTokens ) );
}

/**
 * Splits any paragraph and heading nodes in the tree into sentences and tokens.
 *
 * @param {Node} tree The tree to process.
 * @param {LanguageProcessor} languageProcessor The language processor to use.
 *
 * @returns {Node} The processed tree.
 */
function tokenize( tree, languageProcessor ) {
	if ( tree instanceof Paragraph || tree instanceof Heading ) {
		tree.sentences = getSentences( tree, languageProcessor );
	}

	if ( tree.childNodes ) {
		tree.childNodes = tree.childNodes.map( child => tokenize( child, languageProcessor ) );
	}

	return tree;
}

export default tokenize;
