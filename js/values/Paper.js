var defaults = require( "lodash/object/defaults" );

var defaultAttributes = {
	keyword: "",
	description: "",
	title: "",
	url: ""
};

/**
 * Construct the Paper object and set the keyword property.
 * @param {string} text The text to use in the analysis.
 * @param {object} attributes The object containing all attributes.
 * @constructor
 */
var Paper = function( text, attributes ) {
	this._text = text || "";

	this._attributes = attributes || {};

	defaults( this._attributes, defaultAttributes );
};

/**
 * Check whether a keyword is available.
 * @returns {boolean} Returns true if keyword isn't empty
 */
Paper.prototype.hasKeyword = function() {
	return this._attributes.keyword !== "";
};

/**
 * Return the associated keyword or an empty string if no keyword is available
 * @returns {string} Returns Keyword
 */
Paper.prototype.getKeyword = function() {
	return this._attributes.keyword;
};

/**
 * Check whether the text is available.
 * @returns {boolean} Returns true if text isn't empty
 */
Paper.prototype.hasText = function() {
	return this._text !== "";
};

/**
 * Return the associated text or am empty string if no text is available.
 * @returns {string} Returns text
 */
Paper.prototype.getText = function() {
	return this._text;
};

/**
 * Check whether a metaDescription is available
 * @returns {boolean} Returns true if metaDescription isn't empty
 */
Paper.prototype.hasDescription = function() {
	return this._attributes.description !== "";
};

/**
 * Return the metaDescription or an empty string if no metaDescription is available
 * @returns {string} Returns the metaDescription
 */
Paper.prototype.getDescription = function() {
	return this._attributes.description;
};

/**
 * Check whether an title is available
 * @returns {boolean} Returns true if the Paper has a title.
 */
Paper.prototype.hasTitle = function() {
	return this._attributes.title !== "";
};

/**
 * Return the title, or an empty string of no title is available.
 * @returns {string}
 */
Paper.prototype.getTitle = function() {
	return this._attributes.title;
};

/**
 * Check whether an url is available
 * @returns {boolean} Returns true if the Paper has an Url.
 */
Paper.prototype.hasUrl = function() {
	return this._attributes.url !== "";
};

/**
 * Return the url, or an empty string of no url is available.
 * @returns {string}
 */
Paper.prototype.getUrl = function() {
	return this._attributes.url;
};

module.exports = Paper;
