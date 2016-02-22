/**
 * Construct the Paper object and set the keyword property
 * @param {string} keyword The keyword to use for analyses.
 * @param {object} metas The object containing all metavalues.
 * @constructor
 */
var Paper = function( keyword, metas ) {
	this._keyword = keyword || "";

	this._metaDescription = metas.metaDescription || "";
};

/**
 * Check whether a keyword is available
 * @returns {boolean} Returns true if keyword isn't empty
 */
Paper.prototype.hasKeyword = function() {
	return this._keyword !== "";
};

/**
 * Return the associated keyword or an empty string if no keyword is available
 * @returns {string} Returns Keyword
 */
Paper.prototype.getKeyword = function() {
	return this._keyword;
};

/**
 * Check whether a metaDescription is available
 * @returns {boolean} Returns true if metaDescription isn't empty
 */
Paper.prototype.hasMetaDescription = function() {
	return this._metaDescription !== "";
};

/**
 * Return the metaDescription or an empty string if no metaDescription is available
 * @returns {string} Returns the metaDescription
 */
Paper.prototype.getMetaDescription = function() {
	return this._metaDescription;
};
module.exports = Paper;
