/**
 * Constructs a sentence part object.
 *
 * @param {string} sentencePartText The text in the sentence part.
 * @param {Array} auxiliaries The list of auxiliaries from the sentence part.
 * @param {string} locale The locale used for this sentence part.
 *
 * @constructor
 */
var SentencePart = function( sentencePartText, auxiliaries, locale ) {
	this._sentencePartText = sentencePartText;
	this._auxiliaries = auxiliaries;
	this._locale = locale;
	this._isPassive = false;
};

/**
 * Returns the sentence part string.
 *
 * @returns {string} The sentence part.
 */
SentencePart.prototype.getSentencePartText = function() {
	return this._sentencePartText;
};

/**
 * Returns the passiveness of a sentence part.
 *
 * @returns {boolean} returns true if passive, otherwise returns false.
 */
SentencePart.prototype.isPassive = function() {
	return this._isPassive;
};

/**
 * Returns the list of auxiliaries from a sentence part.
 *
 * @returns {Array} The list of auxiliaries.
 */
SentencePart.prototype.getAuxiliaries = function() {
	return this._auxiliaries;
};

/**
 * Returns the locale of the sentence part.
 *
 * @returns {string} The locale of the sentence part.
 */
SentencePart.prototype.getLocale = function() {
	return this._locale;
};

/**
 * Sets the passiveness of the sentence part.
 *
 * @param {boolean} passive Whether the sentence part is passive or not.
 * @returns {void}
 */
SentencePart.prototype.setPassive = function( passive ) {
	this._isPassive = passive;
};

/**
 * Serializes the SentencePart instance to an object.
 *
 * @returns {Object} The serialized SentencePart.
 */
SentencePart.prototype.serialize = function() {
	return {
		_parseClass: "SentencePart",
		sentencePartText: this._sentencePartText,
		auxiliaries: this._auxiliaries,
		locale: this._locale,
		isPassive: this._isPassive,
	};
};

/**
 * Parses the object to a SentencePart.
 *
 * @param {Object} serialized The serialized object.
 *
 * @returns {SentencePart} The parsed SentencePart.
 */
SentencePart.parse = function( serialized ) {
	const sentencePart = new SentencePart( serialized.sentencePartText, serialized.auxiliaries, serialized.locale );
	sentencePart.setPassive( serialized.isPassive );

	return sentencePart;
};

export default SentencePart;
