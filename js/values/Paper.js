/**
 * Construct the Paper object and set the keyword property
 * @param keyword
 * @constructor
 */
var Paper = function( keyword ) {
	this.keyword = keyword || "";
};

/**
 * Check whether a keyword is available
 * @returns {boolean}
 */
Paper.prototype.hasKeyword = function() {
	return ( typeof this.keyword !== "undefined" && this.keyword !== "" );
};

/**
 * Return the associated keyword or an empty string if no keyword is available
 * @returns {string}
 */
Paper.prototype.getKeyword = function() {
	if ( this.hasKeyword() ) {
		return this.keyword;
	}

	return "";
};

module.exports = Paper;
