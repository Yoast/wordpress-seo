/**
 * Represents formatting elements (e.g. <strong>, <a>, <em>, "_" (MarkDown)) within a document.
 */
class FormattingElement {
	/**
	 * Represents a formatting element (e.g. <strong>, <a>, <em>) within a document.
	 *
	 * @param {string} tag          		The tag of this element (e.g. "strong", "_", etc.).
	 * @param {number} start        		The start position of the tag within the text.
	 * @param {number} end               	The end position of the tag within the text.
	 * @param {Object} [attributes=null] 	The attributes (as key-value pairs, e.g. "href='...'" => { href: '...' } ).
	 * @param {boolean} [selfClosing=false]	If this element is self-closing (like for `img` elements).
	 */
	constructor( tag, start, end, attributes = null, selfClosing = false ) {
		this.tag = tag;
		this.attributes = attributes;
		this.start = start;
		this.end = end;
		this.selfClosing = selfClosing;

		// Swap end and start positions when end is smaller.
		if ( this.end < this.start ) {
			const endTemp = this.end;
			this.end = this.start;
			this.start = endTemp;

			console.warn( `End position smaller than start of '${tag}' element. They have been swapped.` );
		}

		// Set start position to zero when smaller than zero.
		if ( this.start < 0 ) {
			this.start =  0;

			console.warn( `Start position of '${tag}' element smaller than zero. It has been set to zero.` );
		}
	}
}

export default FormattingElement;
