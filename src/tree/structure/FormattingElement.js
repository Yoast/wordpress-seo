/**
 * Represents formatting elements (e.g. link, image, bold text) within a document.
 */
class FormattingElement {
	/**
	 * Represents a formatting element (e.g. link, image, bold text) within a document.
	 *
	 * @param {string} type              The type of this element ("link", "image", "bold", etc.).
	 * @param {Object} [attributes=null] The attributes (as key-value pairs, e.g. `{ href: '...' }` ).
	 */
	constructor( type, attributes = null ) {
		/**
		 * Type of formatting element (e.g. "strong", "a").
		 * @type {string}
		 */
		this.type = type;
		/**
		 * Attributes of this element (e.g. "href", "id").
		 * @type {?Object}
		 */
		this.attributes = attributes;
		/**
		 * Start of this element (including tags) within the source text.
		 * @type {?number}
		 */
		this.startIndex = null;
		/**
		 * End of this element (including tags) within the source text.
		 * @type {?number}
		 */
		this.endIndex = null;
		/**
		 * Start of this element's content within the parent textContainer's text.
		 * @type {?number}
		 */
		this.startText = null;
		/**
		 * End of this element's content within the parent textContainer's text.
		 * @type {?number}
		 */
		this.endText = null;
	}
}

export default FormattingElement;
