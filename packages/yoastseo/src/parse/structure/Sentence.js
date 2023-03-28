/**
 * A sentence within a text.
 */
class Sentence {
	/**
	 * Creates a sentence.
	 *
	 * @param {string} text The sentence's text.
	 */
	constructor( text ) {
		/**
		 * The text in this sentence.
		 *
		 * @type {string}
		 */
		this.text = text;
		/**
		 * The tokens in this sentence.
		 * @type {Token[]}
		 */
		this.tokens = [];
		/**
		 * The start and end positions of the sentence in the source code.
		 * @type {SourceCodeRange}
		 */
		this.sourceCodeRange = {};
	}
}

export default Sentence;
