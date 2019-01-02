/**
 * Represents formatting elements (e.g. link, image, bold text) within a document.
 */
class FormattingElement {
	/**
	 * Represents a formatting element (e.g. link, image, bold text) within a document.
	 *
	 * @param {string} type          		The type of this element ("link", "image", "bold", etc.).
	 * @param {Object} [attributes=null] 	The attributes (as key-value pairs, e.g. `"href='...'"` => `{ href: '...' }` ).
	 */
	constructor( type, attributes = null ) {
		this.type = type;
		this.attributes = attributes;
		this.startIndex = null;
		this.endIndex = null;
		this.startText = null;
		this.endText = null;
	}
}

export default FormattingElement;
