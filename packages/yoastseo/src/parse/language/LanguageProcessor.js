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
		// TODO: split text into sentences.
		return [];
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
