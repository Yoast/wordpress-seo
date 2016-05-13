/**
 * Represents a marked piece of text
 *
 * @param {Object} props The properties of this Mark.
 * @param {string} props.original The original text that should be marked.
 * @param {string} props.marked The new text including marks.
 * @constructor
 */
function Mark( props ) {
	this._props = props;
}

/**
 * Returns the original text
 *
 * @returns {string} The original text.
 */
Mark.prototype.getOriginal = function() {
	return this._props.original;
};

/**
 * Returns the marked text
 *
 * @returns {string} The replaced text.
 */
Mark.prototype.getMarked = function() {
	return this._props.marked;
};

/**
 * Applies this mark to the given text
 *
 * @param {string} text The original text without the mark applied.
 * @returns {string} The A new text with the mark applied to it.
 */
Mark.prototype.applyWithReplace = function( text ) {
	return text.replace( this._props.original, this._props.marked );
};

module.exports = Mark;
