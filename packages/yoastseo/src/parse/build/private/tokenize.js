import { Heading, Paragraph } from "../../structure";
import getTextElementPositions from "./getTextElementPositions";
import { htmlEntitiesArray, encodedHtmlEntitiesArray, htmlEntitiesWithHashRegex } from "./htmlEntities";

/**
 * Splits the sentence into tokens, determines their positions in the source code, and puts them on the sentence.
 *
 * @param {Paragraph|Heading} node The paragraph or heading node to split into sentences.
 * @param {Sentence} sentence The sentence.
 * @param {function} LanguageProcessor The languageprocessor for the current language.
 *
 * @returns {Sentence} The sentence, with tokens.
 */
function getTokens( node, sentence, LanguageProcessor ) {
	sentence.tokens = LanguageProcessor.splitIntoTokens( sentence );
	sentence.tokens = getTextElementPositions( node, sentence.tokens, sentence.sourceCodeRange.startOffset );
	return sentence;
}

/**
 * Splits the node's inner text into sentences, and the sentences into tokens,
 * using the language processor.
 *
 * @param {Paragraph|Heading} node 				The paragraph or heading node to split into sentences.
 * @param {LanguageProcessor} languageProcessor The language processor to use.
 *
 * @returns {Sentence[]} The node's sentences.
 */
function getSentences( node, languageProcessor ) {
	// Change "#amp;" back to "&amp;"
	let innerText = node.innerText();
	innerText = innerText.replace( htmlEntitiesWithHashRegex, "&$1" );
	// Split text into sentences.
	let sentences = languageProcessor.splitIntoSentences( innerText );
	// Add position information to the sentences.
	sentences = getTextElementPositions( node, sentences );
	// Tokenize sentences into tokens.
	return sentences.map( sentence => {
		// After the position info is determined, change &amp; and other entities to their encoded versions,
		// without changing the position information.
		for ( let i; i < htmlEntitiesArray.length; i++ ) {
			sentence = sentence.replace( htmlEntitiesArray[ i ], encodedHtmlEntitiesArray[ i ] );
		}
		return getTokens( node, sentence, languageProcessor );
	} );
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
