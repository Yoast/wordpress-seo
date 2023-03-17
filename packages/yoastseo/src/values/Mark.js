import { defaults } from "lodash-es";

/**
 * Represents a place where highlighting should be applied.
 * We allow both replacement-based highlighting (through providing `original`, `marked`, and potentially `fieldsToMark`) and
 * position-based highlighting (through providing a `position`).
 *
 * @param {Object}   properties                The properties of this Mark.
 *
 * @param {string?}  properties.original       The original text that should be marked.
 * @param {string?}  properties.marked         The new text including marks.
 * @param {array?}   properties.fieldsToMark   The array that specifies which text section(s) to mark.
 *
 * @param {Object?}  properties.position       The position object.
 * @param {int}      properties.position.start The start position of the HTML that should be marked.
 * @param {int}      properties.position.end   The end position of the HTML that should be marked.
 *
 * @constructor
 */
function Mark( properties ) {
	defaults( properties, { original: "", marked: "", fieldsToMark: [] } );
	this._properties = properties;
}

/**
 * Returns the original text.
 *
 * @returns {string} The original text.
 */
Mark.prototype.getOriginal = function() {
	return this._properties.original;
};

/**
 * Returns the marked text.
 *
 * @returns {string} The replaced text.
 */
Mark.prototype.getMarked = function() {
	return this._properties.marked;
};

/**
 * Returns the fields to mark.
 *
 * @returns {array} The fields to mark.
 */
Mark.prototype.getFieldsToMark = function() {
	return this._properties.fieldsToMark;
};

/**
 * Returns the start position.
 *
 * @returns {int} The start position.
 */
Mark.prototype.getPositionStart = function() {
	return this._properties.position.start;
};

/**
 * Returns the end position.
 *
 * @returns {int} The end position.
 */
Mark.prototype.getPositionEnd = function() {
	return this._properties.position.end;
};

/**
 * Applies this mark to the given text with replacement-based highlighting.
 *
 * @param {string} text The original text without the mark applied.
 * @returns {string} A new text with the mark applied to it.
 */
Mark.prototype.applyWithReplace = function( text ) {
	// (=^ ◡ ^=) Cute method to replace everything in a string without using regex.
	return text.split( this._properties.original ).join( this._properties.marked );
};

/**
 * Applies this mark to the given text with position-based highlighting.
 *
 * @param {string} text The original text without the mark applied.
 * @returns {string} A new text with the mark applied to it.
 */
Mark.prototype.applyWithPosition = function( text ) {
	const markStart = "<yoastmark class='yoast-text-mark'>";
	const markEnd = "</yoastmark>";

	const newEndOffset = this.getPositionEnd() + markStart.length;

	text = text.substring( 0, this.getPositionStart() ) + markStart + text.substring( this.getPositionStart() );
	text = text.substring( 0, newEndOffset ) + markEnd + text.substring( newEndOffset );

	return text;
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
	delete serialized._parseClass;
	return new Mark( serialized );
};

export default Mark;
