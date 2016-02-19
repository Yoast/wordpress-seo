/**
 * Construct the Paper object and set the keyword property
 * @param {string} keyword
 * @constructor
 */
var Paper = function( keyword, text ) {
	this._keyword = keyword || "";
	this._text = text || "";
};

/**
 * Check whether a keyword is available
 * @returns {boolean}
 */
Paper.prototype.hasKeyword = function() {
	return this._keyword !== "";
};

/**
 * Return the associated keyword or an empty string if no keyword is available
 * @returns {string}
 */
Paper.prototype.getKeyword = function() {
	return this._keyword;
};

Paper.prototype.hasText = function() {
	return this._text !== "";
};

Paper.prototype.getText = function() {
	return this._text;
};

module.exports = Paper;
