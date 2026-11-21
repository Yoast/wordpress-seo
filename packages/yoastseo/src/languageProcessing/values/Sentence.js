/**
 * Construct the Sentence object and set the sentence text.
 *
 * @param {string} sentence The text of the sentence.
 * @constructor
 */
class Sentence {
	/**
	 * Constructor.
	 *
	 * @param {string} sentence The sentence.
	 * @constructor
	 */
	constructor( sentence ) {
		this._sentenceText = sentence || "";
		this._isPassive = false;
		this._clauses = [];
	}

	/**
	 * Returns the sentence text.
	 *
	 * @returns {string} The sentence.
	 */
	getSentenceText() {
		return this._sentenceText;
	}

	/**
	 * Returns the passiveness of a sentence.
	 *
	 * @returns {boolean} True if passive, otherwise returns false.
	 */
	isPassive() {
		return this._isPassive;
	}

	/**
	 * Sets the passiveness of the sentence.
	 *
	 * @param {boolean} passive Whether the sentence is passive or not.
	 * @returns {void}
	 */
	setPassive( passive ) {
		this._isPassive = passive;
	}

	/**
	 * Returns an array of clauses.
	 *
	 * @returns {Clause[]} The clauses of the sentence.
	 */
	getClauses() {
		return this._clauses;
	}

	/**
	 * Sets the clauses.
	 *
	 * @param {Clause[]} clauses The clauses of the sentence.
	 *
	 * @returns {void}
	 */
	setClauses( clauses ) {
		this._clauses = clauses;

		// Directly set the sentence passiveness based on the passiveness of the clauses that are just set.
		this.setSentencePassiveness();
	}

	/**
	 * Sets the passiveness of the sentence. A sentence is passive if it contains at least one passive clause.
	 *
	 * @returns {void}
	 */
	setSentencePassiveness() {
		const passiveClauses = this.getClauses().filter( clause => clause.isPassive() === true );
		this.setPassive( passiveClauses.length > 0 );
	}

	/**
	 * Serializes the Sentence instance to an object.
	 *
	 * @returns {Object} The serialized Sentence.
	 */
	serialize() {
		return {
			_parseClass: "Sentence",
			sentenceText: this._sentenceText,
			isPassive: this._isPassive,
			clauses: this._clauses,
		};
	}

	/**
	 * Parses the object to a Sentence.
	 *
	 * @param {Object} serialized The serialized object.
	 *
	 * @returns {Sentence} The parsed Sentence.
	 */
	static parse( serialized ) {
		const sentence = new Sentence( serialized.sentenceText );
		sentence.setClauses( serialized.clauses );
		sentence.setPassive( serialized.isPassive );

		return sentence;
	}
}

export default Sentence;
