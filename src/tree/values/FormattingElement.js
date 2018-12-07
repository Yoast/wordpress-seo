/**
 * Represents formatting elements (e.g. link, image, bold text) within a document.
 */
class FormattingElement {
	/**
	 * Represents a formatting element (e.g. link, image, bold text) within a document.
	 *
	 * @param {string} type          		The type of this element ("link", "image", "bold", etc.).
	 * @param {number} startIndex        		The start position of this element within the text.
	 * @param {number} endIndex               	The end position of the element within the text.
	 * @param {Object} [attributes=null] 	The attributes (as key-value pairs, e.g. "href='...'" => { href: '...' } ).
	 */
	constructor( type, startIndex, endIndex, attributes = null ) {
		this.type = type;
		this.attributes = attributes;
		this.startIndex = startIndex;
		this.endIndex = endIndex;

		// Swap end and start positions when end is smaller.
		if ( this.endIndex < this.startIndex ) {
			this._swapStartAndEnd();
			console.warn( `End position smaller than start of '${type}' element. They have been swapped.` );
		}

		// Set start position to zero when smaller than zero.
		if ( this.startIndex < 0  ||  this.endIndex < 0 ) {
			this.startIndex =  0;
			this.endIndex = 0;
			console.warn( `Start position of '${type}' element smaller than zero. It has been set to zero.` );
		}
	}

	/**
	 * Swaps the end and start positions around.
	 *
	 * @returns {void}
	 * @private
	 */
	_swapStartAndEnd() {
		const endTemp = this.endIndex;
		this.endIndex = this.startIndex;
		this.startIndex = endTemp;
	}
}

export default FormattingElement;
