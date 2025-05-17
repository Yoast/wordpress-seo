import { Heading, Paragraph } from "../../structure";
import getTextElementPositions from "./getTextElementPositions";
import { hashedHtmlEntities } from "../../../helpers/htmlEntities";

/**
 * Splits the sentence into tokens, determines their positions in the source code, and puts them on the sentence.
 *
 * @param {Paragraph|Heading} node The paragraph or heading node to split into sentences.
 * @param {Sentence} sentence The sentence.
 * @param {LanguageProcessor} languageProcessor The language processor for the current language.
 *
 * @returns {Sentence} The sentence, with tokens.
 */
function getTokens( node, sentence, languageProcessor ) {
	sentence.tokens = languageProcessor.splitIntoTokens( sentence );
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
	// Split text into sentences.
	let sentences = languageProcessor.splitIntoSentences( node.innerText() );
	// Add position information to the sentences.
	sentences = getTextElementPositions( node, sentences );
	// Tokenize sentences into tokens.
	return sentences.map( sentence => {
		sentence = getTokens( node, sentence, languageProcessor );
		// Now positions have been determined, change HTML entities that had earlier been converted to hashed versions back to their short version.
		// For example, "&amp;" was earlier converted into "#amp;" and is now converted into "&".
		// We make this change in both the Sentence and the accompanying Tokens.
		hashedHtmlEntities.forEach( ( character, hashedHtmlEntity ) => {
			// We use a global regex instead of replaceAll to support older browsers.
			const hashedHtmlEntityRegex = new RegExp( hashedHtmlEntity, "g" );
			sentence.text = sentence.text.replace( hashedHtmlEntityRegex, character );
			sentence.tokens.map( token => {
				token.text = token.text.replace( hashedHtmlEntityRegex, character );
				return token;
			} );
		} );
		return sentence;
	} );
}

/**
 * Splits any Paragraph and Heading nodes in the tree into sentences and tokens.
 * Excludes overarching Paragraphs, as those will have (implicit) paragraphs as their children.
 *
 * @param {Node} tree The tree to process.
 * @param {LanguageProcessor} languageProcessor The language processor to use.
 *
 * @returns {Node} The processed tree.
 */
function tokenize( tree, languageProcessor ) {
	if ( ( tree instanceof Paragraph && tree.name !== "p-overarching" ) || tree instanceof Heading ) {
		tree.sentences = getSentences( tree, languageProcessor );
	}

	if ( tree.childNodes ) {
		tree.childNodes = tree.childNodes.map( child => tokenize( child, languageProcessor ) );
	}

	return tree;
}

export default tokenize;
