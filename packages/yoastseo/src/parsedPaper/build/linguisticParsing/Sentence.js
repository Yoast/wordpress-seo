/**
 * Represents a sentence in a text.
 */
class Sentence {
	/**
	 * Represents a sentence within a text.
	 *
	 * @param {string} text     The text of this sentence.
	 * @param {number} startIndex   The start index of this sentence.
	 * @param {number} endIndex     The end index of this sentence.
	 */
	constructor( text, startIndex = 0, endIndex = 0 ) {
		this.text = text;
		this.words = [];
		this.startIndex = startIndex;
		this.endIndex = endIndex;
	}

	/**
	 * Sets a text for this sentence.
	 *
	 * @param {string} text The text to be set for the sentence.
	 *
	 * @returns {void}
	 */
	setText( text ) {
		this.text = text;
	}

	/**
	 * Appends text to this sentence.
	 *
	 * @param {string} text The text to be added to the sentence.
	 *
	 * @returns {void}
	 */
	appendText( text ) {
		this.text += text;
	}

	/**
	 * Returns the text of this sentence.
	 *
	 * @returns {string} The text of this senence.
	 */
	getText() {
		return this.text;
	}

	/**
	 * Sets the start index of this sentence.
	 *
	 * @param {number} startIndex The start index of this sentence.
	 * @returns {void}
	 */
	setStartIndex( startIndex ) {
		this.startIndex = startIndex;
	}

	/**
	 * Sets the end index of this sentence.
	 *
	 * @param {number} endIndex The end index of this sentence.
	 * @returns {void}
	 */
	setEndIndex( endIndex ) {
		this.endIndex = endIndex;
	}

	/**
	 * Returns the start index of this sentence.
	 *
	 * @returns {number} The start index of this sentence.
	 */
	getStartIndex() {
		return this.startIndex;
	}

	/**
	 * Returns the end index of this sentence.
	 *
	 * @returns {number} The end index of this sentence.
	 */
	getEndIndex() {
		return this.endIndex;
	}
}

export default Sentence;
