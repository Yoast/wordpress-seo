/**
 * Sentence clause which should be checked for passiveness.
 *
 */
class Clause {
	/**
	 * Constructs a clause object.
	 *
	 * @param {string} clauseText The text in the clause.
	 * @param {Array} auxiliaries The auxiliaries in the clause.
	 *
	 * @constructor
	 */
	constructor( clauseText, auxiliaries ) {
		this._clauseText = clauseText;
		this._auxiliaries = auxiliaries;
		this._isPassive = false;
		this._participles = [];
	}
	/**
	 * Returns the clause text.
	 *
	 * @returns {string} The clause text.
	 */
	getClauseText() {
		return this._clauseText;
	}

	/**
	 * Returns true if the clause is passive.
	 *
	 * @returns {boolean} Whether the clause is passive.
	 */
	isPassive() {
		return this._isPassive;
	}

	/**
	 * Returns the auxiliaries of the clause.
	 *
	 * @returns {Array} The auxiliaries present in the clause.
	 */
	getAuxiliaries() {
		return this._auxiliaries;
	}

	/**
	 * Sets the passiveness of the clause.
	 *
	 * @param {boolean} passive	 Whether the clause is passive.
	 *
	 * @returns {void}
	 */
	setPassive( passive ) {
		this._isPassive = passive;
	}

	/**
	 * Sets the participles.
	 *
	 * @param {Array} participles	The participles.
	 *
	 * @returns {void}
	 */
	setParticiples( participles ) {
		this._participles = participles;
	}

	/**
	 * Returns the found participles.
	 *
	 * @returns {Array} The participles
	 */
	getParticiples() {
		return this._participles;
	}

	/**
	 * Serializes the Clause instance to an object.
	 *
	 * @returns {Object} The serialized Clause.
	 */
	serialize() {
		return {
			_parseClass: "Clause",
			clauseText: this._clauseText,
			auxiliaries: this._auxiliaries,
			isPassive: this._isPassive,
			participles: this._participles,
		};
	}

	/**
	 * Parses the object to a Clause.
	 *
	 * @param {Object} serialized The serialized object.
	 *
	 * @returns {Clause} The parsed Clause.
	 */
	static parse( serialized ) {
		const clause = new Clause( serialized.clauseText, serialized.auxiliaries );
		clause.setPassive( serialized.isPassive );

		return clause;
	}
}

export default Clause;
