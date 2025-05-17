/**
 * Represents a prominent word in the context of relevant words.
*/
class ProminentWord {
	/**
	 * Constructs Prominent word object.
	 *
	 * @constructor
	 *
	 * @param {string} word             The word.
	 * @param {string} [stem]           The stem / base form of the word, defaults to the word.
	 * @param {number} [occurrences]    The number of occurrences, defaults to 0.
	 */
	constructor( word, stem, occurrences ) {
		this._word = word;
		this._stem = stem ? stem : word;
		this._occurrences = occurrences || 0;
	}

	/**
	 * Sets the word.
	 *
	 * @param {string} word The word to set.
	 *
	 * @returns {void}.
	 */
	setWord( word ) {
		this._word = word;
	}

	/**
	 * Returns the word.
	 *
	 * @returns {string} The word.
	 */
	getWord() {
		return this._word;
	}

	/**
	 * Returns the stem of the word.
	 *
	 * @returns {string} The stem.
	 */
	getStem() {
		return this._stem;
	}

	/**
	 * Sets the number of occurrences to the word.
	 *
	 * @param {int} numberOfOccurrences The number of occurrences to set.
	 *
	 * @returns {void}.
	 */
	setOccurrences( numberOfOccurrences ) {
		this._occurrences = numberOfOccurrences;
	}

	/**
	 * Returns the amount of occurrences of this word.
	 *
	 * @returns {number} The number of occurrences.
	 */
	getOccurrences() {
		return this._occurrences;
	}

	/**
	 * Serializes the ProminentWord instance to an object.
	 *
	 * @returns {Object} The serialized ProminentWord.
	 */
	serialize() {
		return {
			_parseClass: "ProminentWord",
			word: this._word,
			stem: this._stem,
			occurrences: this._occurrences,
		};
	}

	/**
	 * Parses the object to a ProminentWord.
	 *
	 * @param {Object} serialized The serialized object.
	 *
	 * @returns {ProminentWord} The parsed ProminentWord.
	 */
	static parse( serialized ) {
		return new ProminentWord( serialized.word, serialized.stem, serialized.occurrences );
	}
}

export default ProminentWord;
