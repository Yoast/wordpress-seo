/**
 * Construct the Paper object and set the keyword property
 * @param {string} keyword
 * @constructor
 */
var Paper = function( keyword ) {
	this._keyword = keyword || "";
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

module.exports = Paper;
