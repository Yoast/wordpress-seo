/**
 * Represents formatting elements (e.g. link, image, bold text) within a document.
 *
 * @memberOf module:parsedPaper/structure
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
		this.sourceStartIndex = null;
		/**
		 * End of this element (including tags) within the source text.
		 * @type {?number}
		 */
		this.sourceEndIndex = null;
		/**
		 * Start of this element's content within the parent textContainer's text.
		 * @type {?number}
		 */
		this.textStartIndex = null;
		/**
		 * End of this element's content within the parent textContainer's text.
		 * @type {?number}
		 */
		this.textEndIndex = null;
	}
}

export default FormattingElement;
