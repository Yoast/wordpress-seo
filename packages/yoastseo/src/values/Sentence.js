/**
 * Construct the Sentence object and set the sentence text and locale.
 *
 * @param {string} sentence The text of the sentence.
 * @constructor
 */
var Sentence = function( sentence ) {
	this._sentenceText = sentence || "";
	this._isPassive = false;
};

/**
 * Returns the sentence text.
 * @returns {String} The sentence.
 */
Sentence.prototype.getSentenceText = function() {
	return this._sentenceText;
};

/**
 * Returns the passiveness of a sentence.
 *
 * @returns {boolean} True if passive, otherwise returns false.
 */
Sentence.prototype.isPassive = function() {
	return this._isPassive;
};

/**
 * Sets the passiveness of the sentence.
 *
 * @param {boolean} passive Whether the sentence is passive or not.
 * @returns {void}
 */
Sentence.prototype.setPassive = function( passive ) {
	this._isPassive = passive;
};

/**
 * Serializes the Sentence instance to an object.
 *
 * @returns {Object} The serialized Participle.
 */
Sentence.prototype.serialize = function() {
	return {
		_parseClass: "Sentence",
		sentenceText: this._sentenceText,
		isPassive: this._isPassive,
	};
};

/**
 * Parses the object to a Sentence.
 *
 * @param {Object} serialized The serialized object.
 *
 * @returns {Sentence} The parsed Sentence.
 */
Sentence.parse = function( serialized ) {
	const sentence = new Sentence( serialized.sentenceText );
	sentence.setPassive( serialized.isPassive );

	return sentence;
};

export default Sentence;
