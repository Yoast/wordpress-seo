import Sentence from "../structure/Sentence";
const whitespaceRegex = /^\s+$/;
/**
 * Contains language-specific logic for splitting a text into sentences and tokens.
 */
class LanguageProcessor {
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
		const sentences = memoizedTokenizer( text, false );

		/*
		 * If the last element in the array of sentences contains only whitespaces, remove it.
		 * This will be the case if the text ends in a whitespace - that whitespace ends up being tokenized as a
		 * separate sentence.
		 * We don't want to remove any potential whitespace "sentences" that are not at the end,
		 * because they are needed to ensure correct calculation of the sentence positions later on.
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
	 * @param {Sentence} sentence The sentences to split.
	 *
	 * @returns {Token[]} The tokens.
	 */
	splitIntoTokens( sentence ) {
		// TODO: Split sentence into tokens.
		return [];
	}
}

export default LanguageProcessor;
