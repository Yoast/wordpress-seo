import Sentence from "../structure/Sentence";
import Token from "../structure/Token";
import splitIntoTokens from "../../languageProcessing/helpers/word/splitIntoTokens";

const whitespaceRegex = /^\s+$/;


/**
 * Contains language-specific logic for splitting a text into sentences and tokens.
 */
export default class LanguageProcessor {
	/**
	 * Creates a new language processor.
	 *
	 * @param {Researcher} researcher The researcher to use.
	 */
	constructor( researcher ) {
		this.researcher = researcher;
	}

	/**
	 * Split text into sentences.
	 *
	 * @param {string} text The text to split into sentences.
	 *
	 * @returns {Sentence[]} The sentences.
	 */
	splitIntoSentences( text ) {
		const memoizedTokenizer = this.researcher.getHelper( "memoizedTokenizer" );
		/*
		 * Set the `trimSentences` flag to false. We want to keep whitespaces to be able to correctly assess the
		 * position of sentences within the source code.
		 */
		const sentences = memoizedTokenizer( text, false );

		/*
		 * If the last element in the array of sentences contains only whitespaces, remove it.
		 * This will be the case if the text ends in a whitespace - that whitespace ends up being tokenized as a
		 * separate sentence. A space at the end of the text is not needed for calculating the position of
		 * sentences, so it can be safely removed.
		 */
		if ( whitespaceRegex.test( sentences[ sentences.length - 1 ] ) ) {
			sentences.pop();
		}

		return sentences.map( function( sentence ) {
			return new Sentence( sentence );
		} );
	}

	/**
	 * Split sentence into tokens.
	 *
	 * @param {Sentence} sentence The sentence to split.
	 *
	 * @returns {Token[]} The tokens.
	 */
	splitIntoTokens( sentence ) {
		// Retrieve sentence from sentence class
		const sentenceText = sentence.text;

		// If there is a custom splitIntoTokens helper use its output for retrieving tokens.
		const tokenTextsCustom = this.researcher.getHelper( "splitIntoTokensCustom" );
		if ( tokenTextsCustom ) {
			const tokensCustom = tokenTextsCustom( sentenceText );
			return tokensCustom.map( tokenText => new Token( tokenText ) );
		}

		const tokenTexts = splitIntoTokens( sentenceText );

		return tokenTexts.map( tokenText => new Token( tokenText ) );
	}
}
