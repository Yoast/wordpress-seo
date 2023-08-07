/**
 * A token representing a word, whitespace or punctuation in the sentence.
 */
class Token {
	/**
	 * Creates a new token.
	 *
	 * @param {string} text The token's text.
	 * @param {SourceCodeRange} sourceCodeRange The start and end positions of the token in the source code.
	 */
	constructor( text, sourceCodeRange = {} ) {
		this.text = text;
		/**
		 * The start and end positions of the token in the source code.
		 * @type {SourceCodeRange}
		 */
		this.sourceCodeRange = sourceCodeRange;
	}
}

export default Token;
