/**
 * Represents formatting elements (e.g. link, image, bold text) within a document.
 */
class FormattingElement {
	/**
	 * Represents a formatting element (e.g. link, image, bold text) within a document.
	 *
	 * @param {string} type          		The type of this element ("link", "image", "bold", etc.).
	 * @param {number} start        		The start position of this element within the text.
	 * @param {number} end               	The end position of the element within the text.
	 * @param {Object} [attributes=null] 	The attributes (as key-value pairs, e.g. "href='...'" => { href: '...' } ).
	 */
	constructor( type, start, end, attributes = null ) {
		this.type = type;
		this.attributes = attributes;
		this.start = start;
		this.end = end;

		// Swap end and start positions when end is smaller.
		if ( this.end < this.start ) {
			const endTemp = this.end;
			this.end = this.start;
			this.start = endTemp;

			console.warn( `End position smaller than start of '${type}' element. They have been swapped.` );
		}

		// Set start position to zero when smaller than zero.
		if ( this.start < 0 ) {
			this.start =  0;

			console.warn( `Start position of '${type}' element smaller than zero. It has been set to zero.` );
		}
	}
}

export default FormattingElement;
