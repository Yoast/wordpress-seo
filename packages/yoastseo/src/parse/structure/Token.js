import { normalizeSingle } from "../../languageProcessing";

/**
 * A token representing a word, whitespace or punctuation in the sentence.
 */
class Token {
	/**
	 * Creates a new token.
	 *
	 * @param {string} text The token's text.
	 * @param {Node} parentNode The parent node of the token.
	 * @param {SourceCodeRange} sourceCodeRange The start and end positions of the token in the source code.
	 */
	constructor( text, parentNode, sourceCodeRange = {}  ) {
		// Normalize single quotes so that tokens can be matched with strings regardless of single quote type.
		this.text = normalizeSingle( text );
		/**
		 * The start and end positions of the token in the source code.
		 * @type {SourceCodeRange}
		 */
		this.sourceCodeRange = sourceCodeRange;
		this.parentNode = parentNode;
	}
}

export default Token;
