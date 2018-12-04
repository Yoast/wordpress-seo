/**
 * Represents phrasing content (e.g. <strong>, <a>, <em>), except text, within an HTML-text.
 */
class FormattingElement {
	/**
	 * Represents phrasing content (e.g. <strong>, <a>, <em>), except text, within an HTML-text.
	 *
	 * @param {string} tag          		The HTML-tag of this element (e.g. "strong", "a", etc.).
	 * @param {number} start        		The start position of the tag within the text.
	 * @param {number} end               	The end position of the tag within the text.
	 * @param {Object} [attributes=null] 	The attributes (as key-value pairs, e.g. "href='...'" => { href: '...' } ).
	 */
	constructor( tag, start, end, attributes ) {
		this.tag = tag;
		this.attributes = attributes;
		this.start = start;
		this.end = end;
	}

	/**
	 * Stringifies the given HTML-attributes to a string of " key=value" pairs.
	 *
	 * @param {Object} attributes The attributes to serialize.
	 *
	 * @returns {string} The stringified attributes.
	 */
	getAttributeString( attributes ) {
		if ( attributes ) {
			return Object.keys( attributes ).reduce( ( string, key ) => {
				return string + ` ${key}="${attributes[ key ]}"`;
			}, "" );
		}
		return "";
	}

	/**
	 * Stringifies this phrasing content to an HTML-string.
	 *
	 * @param {string} content The content to insert between the content tags.
	 *
	 * @returns {string} The HTML-string.
	 */
	toHtml( content ) {
		return `<${this.tag}${this.getAttributeString( this.attributes )}>${content}</${this.tag}>`;
	}
}

export default FormattingElement;
