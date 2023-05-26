import { defaults, isUndefined } from "lodash-es";

/**
 * Represents a place where highlighting should be applied.
 * We allow both replacement-based highlighting (through providing `original`, `marked`, and potentially `fieldsToMark`) and
 * position-based highlighting (through providing a `position`).
 *
 * @param {Object}   properties                  The properties of this Mark.
 *
 * @param {string?}  properties.original         The original text that should be marked.
 * @param {string?}  properties.marked           The new text including marks.
 * @param {array?}   properties.fieldsToMark     The array that specifies which text section(s) to mark.
 *
 * @param {SourceCodeRange?} properties.position The position object: a range in the source code.
 *
 * @constructor
 */
function Mark( properties ) {
	// eslint-disable-next-line no-warning-comments
	// TODO: decide later whether we want to add a default value for `position` property
	defaults( properties, { original: "", marked: "", fieldsToMark: [] } );
	this._properties = properties;
	this.isValid();
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
 * @returns {number} The start position.
 */
Mark.prototype.getPositionStart = function() {
	return this._properties.position && this._properties.position.startOffset;
};

/**
 * Returns the end position.
 *
 * @returns {number} The end position.
 */
Mark.prototype.getPositionEnd = function() {
	return this._properties.position && this._properties.position.endOffset;
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

	const newPositionEnd = this.getPositionEnd() + markStart.length;

	text = text.substring( 0, this.getPositionStart() ) + markStart + text.substring( this.getPositionStart() );
	text = text.substring( 0, newPositionEnd ) + markEnd + text.substring( newPositionEnd );

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
 * Checks if the mark object is valid for position-based highlighting.
 * @returns {void}
 */
// eslint-disable-next-line complexity
Mark.prototype.isValid = function() {
	if ( ! isUndefined( this.getPositionStart() ) && this.getPositionStart() < 0 ) {
		throw new RangeError( "positionStart should be larger or equal than 0." );
	}
	if ( ! isUndefined( this.getPositionEnd() ) && this.getPositionEnd() <= 0 ) {
		throw new RangeError( "positionEnd should be larger than 0." );
	}
	if ( ! isUndefined( this.getPositionStart() ) && ! isUndefined( this.getPositionEnd() ) &&
		this.getPositionStart() >= this.getPositionEnd() ) {
		throw new RangeError( "The positionStart should be smaller than the positionEnd." );
	}
	if ( isUndefined( this.getPositionStart() ) && ! isUndefined( this.getPositionEnd() ) ||
		 isUndefined( this.getPositionEnd() ) && ! isUndefined( this.getPositionStart() ) ) {
		throw new Error( "A mark object should either have start and end defined or start and end undefined." );
	}
};

/**
 * Checks if a mark has position information available.
 * @returns {boolean} Returns true if the Mark object has position information, false otherwise.
 */
Mark.prototype.hasPosition = function() {
	return !! this.getPositionStart && this.getPositionStart();
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
