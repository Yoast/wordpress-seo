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
	this._sentenceText = sentence;
	this._locale = locale || defaultAttributes.locale;
	this._isPassive = false;
	this._sentenceParts = [];
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
 * Returns the sentence parts.
 * @returns {Array} The list of sentence parts.
 */
Sentence.prototype.getSentenceParts = function() {
	return this._sentenceParts;
};

module.exports = Sentence;
