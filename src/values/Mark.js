const defaults = require( "lodash/defaults" );

/**
 * Represents a marked piece of text
 *
 * @param {Object} properties The properties of this Mark.
 * @param {string} properties.original The original text that should be marked.
 * @param {string} properties.marked The new text including marks.
 * @constructor
 */
function Mark( properties ) {
	defaults( properties, { original: "", marked: "" } );

	this._properties = properties;
}


/**
 * Returns the original text
 *
 * @returns {string} The original text.
 */
Mark.prototype.getOriginal = function() {
	return this._properties.original;
};

/**
 * Returns the marked text
 *
 * @returns {string} The replaced text.
 */
Mark.prototype.getMarked = function() {
	return this._properties.marked;
};

/**
 * Applies this mark to the given text
 *
 * @param {string} text The original text without the mark applied.
 * @returns {string} The A new text with the mark applied to it.
 */
Mark.prototype.applyWithReplace = function( text ) {
	// Cute method to replace everything in a string without using regex.
	return text.split( this._properties.original ).join( this._properties.marked );
};

/**
 * Serializes the Mark instance to an object.
 *
 * @returns {Object} The serialized Mark.
 */
Mark.prototype.serialize = function() {
	return {
		_parseClass: "Mark",
		...this._properties,
	};
};

/**
 * Parses the object to a Mark.
 *
 * @param {Object} serialized The serialized object.
 *
 * @returns {Mark} The parsed Mark.
 */
Mark.parse = function( serialized ) {
	return new Mark( serialized );
};

module.exports = Mark;
