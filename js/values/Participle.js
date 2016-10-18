/**
 * Construct the Participle object and set the participle, sentence part, auxiliary and type.
 *
 * @param {string} participle The participle.
 * @param {string} sentencePart The sentence part where the participle is from.
 * @param {Array} auxiliaries The list with auxiliaries.
 * @param {string} type The type of participle.
 * @constructor
 */
// Todo: move auxiliaries, type and locale to attributes object. See Paper.
var Participle = function( participle, sentencePart, auxiliaries, type ) {
	this._participle = participle || "";
	this._sentencePart = sentencePart || "";
	this._type = type || "";
	this._auxiliaries = auxiliaries || [];
	this._determinesSentencePartIsPassive = false;
};

/**
 * Returns the participle.
 * @returns {String} The participle.
 */
Participle.prototype.getParticiple = function() {
	return this._participle;
};

/**
 * Returns the sentence part.
 * @returns {String} The sentence part.
 */
Participle.prototype.getSentencePart = function() {
	return this._sentencePart;
};

/**
 * Returns the type.
 * @returns {String} The type.
 */
Participle.prototype.getType = function() {
	return this._type;
};

/**
 * Returns the auxiliaries.
 * @returns {String} The auxiliaries.
 */
Participle.prototype.getAuxiliaries = function() {
	return this._auxiliaries;
};

/**
 * Returns if the participle is passive or not.
 * @returns {boolean} True if it is passive.
 */
Participle.prototype.determinesSentencePartIsPassive = function() {
	return this._determinesSentencePartIsPassive;
};

/**
 * Determines if the sentence is passive or not.
 * @param {boolean} passive Whether the sentence part is passive.
 * @returns {void}
 */
Participle.prototype.setSentencePartPassiveness = function( passive ) {
	this._determinesSentencePartIsPassive = passive;
};

module.exports = Participle;
