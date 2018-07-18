/**
 * Default attributes to be used by the Sentence if they are left undefined.
 * @type {{locale: string}}
 */
var defaultAttributes = {
	locale: "en_US",
};

/**
 * Construct the Sentence object and set the sentence text and locale.
 *
 * @param {string} sentence The text of the sentence.
 * @param {string} locale The locale.
 * @constructor
 */
var Sentence = function( sentence, locale ) {
	this._sentenceText = sentence || "";
	this._locale = locale || defaultAttributes.locale;
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
 * Returns the locale.
 * @returns {String} The locale.
 */
Sentence.prototype.getLocale = function() {
	return this._locale;
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

module.exports = Sentence;
