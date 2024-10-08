import { defaults, isUndefined } from "lodash";

const defaultProperties = { original: "", marked: "", fieldsToMark: [] };

/**
 * Represents a place where highlighting should be applied.
 */
class Mark {
	/**
	 * Represents a place where highlighting should be applied.
	 * We allow both replacement-based highlighting (through providing `original`, `marked`, and potentially `fieldsToMark`) and
	 * position-based highlighting (through providing a `position`).
	 *
	 * @param {Object}   [properties]                  The properties of this Mark.
	 *
	 * @param {string}  [properties.original]         The original text that should be marked.
	 * @param {string}  [properties.marked]           The new text including marks.
	 * @param {array}   [properties.fieldsToMark]     The array that specifies which text section(s) to mark, e.g. "heading".
	 *
	 * @param {SourceCodeRange} [properties.position] The position object: a range in the source code.
	 */
	constructor( properties ) {
		properties = properties || {};
		defaults( properties, defaultProperties );
		this._properties = properties;
		this.isValid();
	}

	/**
	 * Returns the original text.
	 *
	 * @returns {string} The original text.
	 */
	getOriginal() {
		return this._properties.original;
	}

	/**
	 * Returns the marked text.
	 *
	 * @returns {string} The replaced text.
	 */
	getMarked() {
		return this._properties.marked;
	}

	/**
	 * Returns the fields to mark.
	 *
	 * @returns {array} The fields to mark.
	 */
	getFieldsToMark() {
		return this._properties.fieldsToMark;
	}

	/**
	 * Returns the position information.
	 *
	 * @returns {Object} The position information.
	 */
	getPosition() {
		return this._properties.position;
	}

	/**
	 * Returns the start position.
	 *
	 * @returns {number} The start position.
	 */
	getPositionStart() {
		return this._properties.position && this._properties.position.startOffset;
	}

	/**
	 * Returns the end position.
	 *
	 * @returns {number} The end position.
	 */
	getPositionEnd() {
		return this._properties.position && this._properties.position.endOffset;
	}

	/**
	 * Sets the start position.
	 *
	 * @param {number} positionStart The new start position.
	 *
	 * @returns {void}
	 */
	setPositionStart( positionStart ) {
		this._properties.position.startOffset = positionStart;
	}

	/**
	 * Sets the end position.
	 *
	 * @param {number} positionEnd The new end position.
	 *
	 * @returns {void}
	 */
	setPositionEnd( positionEnd ) {
		this._properties.position.endOffset = positionEnd;
	}

	/**
	 * Returns the start position of a block.
	 *
	 * @param {number} startOffsetBlock The block start offset.
	 *
	 * @returns {number} The start position of a block.
	 */
	setBlockPositionStart( startOffsetBlock ) {
		this._properties.position.startOffsetBlock = startOffsetBlock;
	}

	/**
	 * Returns the end position of a block.
	 *
	 * @param {number} endOffsetBlock The block end offset.
	 *
	 * @returns {number} The end position of a block.
	 */
	setBlockPositionEnd( endOffsetBlock ) {
		this._properties.position.endOffsetBlock = endOffsetBlock;
	}

	/**
	 * Gets the block client id.
	 *
	 * @returns {string} The block client id.
	 */
	getBlockClientId() {
		return this._properties.position && this._properties.position.clientId;
	}

	/**
	 * Gets the block attribute id.
	 *
	 * @returns {string} The block attribute id.
	 */
	getBlockAttributeId() {
		return this._properties.position && this._properties.position.attributeId;
	}


	/**
	 * Checks if the mark object is intended for the first section of a Yoast sub-block.
	 * This method will be used only for Yoast blocks where each block consists of sub-blocks
	 * with two sections.
	 *
	 * @returns {boolean} Whether the mark object is intended for the first section of a Yoast sub-block.
	 */
	isMarkForFirstBlockSection() {
		return this._properties.position && this._properties.position.isFirstSection;
	}

	/**
	 * Returns the start position inside block.
	 *
	 * @returns {number} The start position inside the block if the mark has position information, undefined otherwise.
	 */
	getBlockPositionStart() {
		return this._properties.position && this._properties.position.startOffsetBlock;
	}

	/**
	 * Returns the end position inside block if the mark has position information, undefined otherwise.
	 *
	 * @returns {number} The end position inside block.
	 */
	getBlockPositionEnd() {
		return this._properties.position && this._properties.position.endOffsetBlock;
	}

	/**
	 * Applies this mark to the given text with replacement-based highlighting.
	 *
	 * @param {string} text The original text without the mark applied.
	 * @returns {string} A new text with the mark applied to it.
	 */
	applyWithReplace( text ) {
		// (=^ ◡ ^=) Cute method to replace everything in a string without using regex.
		return text.split( this._properties.original ).join( this._properties.marked );
	}

	/**
	 * Applies this mark to the given text with position-based highlighting.
	 *
	 * @param {string} text The original text without the mark applied.
	 * @returns {string} A new text with the mark applied to it.
	 */
	applyWithPosition( text ) {
		const markStart = "<yoastmark class='yoast-text-mark'>";
		const markEnd = "</yoastmark>";

		const newPositionEnd = this.getPositionEnd() + markStart.length;

		text = text.substring( 0, this.getPositionStart() ) + markStart + text.substring( this.getPositionStart() );
		text = text.substring( 0, newPositionEnd ) + markEnd + text.substring( newPositionEnd );

		return text;
	}

	/**
	 * Serializes the Mark instance to an object.
	 *
	 * @returns {Object} The serialized Mark.
	 */
	serialize() {
		return {
			_parseClass: "Mark",
			...this._properties,
		};
	}

	/* eslint-disable complexity */
	/**
	 * Checks if the mark object is valid for position-based highlighting.
	 * @returns {void}
	 */
	isValid() {
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
	}
	/* eslint-enable complexity */

	/**
	 * Checks if a mark has position information available.
	 * @returns {boolean} Returns true if the Mark object has position information, false otherwise.
	 */
	hasPosition() {
		return ! isUndefined( this.getPositionStart() );
	}


	/**
	 * Checks if a mark has block position information available.
	 * A block has position information if the block start offset is available.
	 *
	 * @returns {boolean} Returns true if the Mark object has block position information, false otherwise.
	 */
	hasBlockPosition() {
		return ! isUndefined( this.getBlockPositionStart() );
	}

	/**
	 * Parses the object to a Mark.
	 *
	 * @param {Object} serialized The serialized object.
	 *
	 * @returns {Mark} The parsed Mark.
	 */
	static parse( serialized ) {
		delete serialized._parseClass;
		return new Mark( serialized );
	}
}

export default Mark;
