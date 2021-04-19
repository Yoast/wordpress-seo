import SourceCodeLocation from "./SourceCodeLocation";

/**
 * Represents formatting elements (e.g. link, image, bold text) within a document.
 *
 * @memberOf module:parsedPaper/structure
 */
class FormattingElement {
	/**
	 * Represents a formatting element (e.g. link, image, bold text) within a document.
	 *
	 * @param {string} type               The type of this element ("link", "image", "bold", etc.).
	 * @param {Object} sourceCodeLocation The parse5 formatted location of the element inside of the source code.
	 * @param {Object} [attributes=null]  The attributes (as key-value pairs, e.g. `{ href: '...' }` ).
	 */
	constructor( type, sourceCodeLocation, attributes = null ) {
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
		 * Location inside of the source code.
		 * @type {SourceCodeLocation}
		 */
		this.sourceCodeLocation = new SourceCodeLocation( sourceCodeLocation );
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
		/**
		 * This formatting element's parent.
		 * @type {LeafNode}
		 */
		this.parent = null;
	}

	/**
	 * Returns the attribute with the given name if it exists.
	 *
	 * @param {string} name The name of the attribute.
	 *
	 * @returns {false|*} The attribute or `false` if the attribute does not exist.
	 */
	getAttribute( name ) {
		if ( ! this.attributes ) {
			return false;
		}
		if ( name in this.attributes ) {
			return this.attributes[ name ];
		}
		return false;
	}
}

export default FormattingElement;
