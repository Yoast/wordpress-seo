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
	 * @param {boolean} [selfClosing=false]	If this (HTML) element is self-closing (like for `img` elements).
	 */
	constructor( tag, start, end, attributes, selfClosing = false ) {
		this.tag = tag;
		this.attributes = attributes;
		this.start = start;
		this.end = end;
		this.selfClosing = selfClosing;
		this._validate();
	}

	/**
	 * Checks if this is a valid FormattingElement. If it is not, throws an error.
	 *
	 * @private
	 * @returns {void}
	 */
	_validate() {
		if ( this.end < this.start ) {
			throw new TypeError( "End position should be larger than start position." );
		} else if ( this.start < 0 ) {
			throw new TypeError( "Start position should be larger than zero." );
		}
	}

	/**
	 * Stringifies this elements HTML-attributes to a string of " key=value" pairs.
	 *
	 * @private
	 * @returns {string} The stringified attributes.
	 */
	_getAttributeString() {
		if ( this.attributes ) {
			return Object.keys( this.attributes ).reduce( ( string, key ) => {
				return string + ` ${key}="${this.attributes[ key ]}"`;
			}, "" );
		}
		return "";
	}

	/**
	 * Stringifies this phrasing content to an HTML-string.
	 *
	 * @param {string} [content=""] The optional content to insert between the content tags.
	 *
	 * @returns {string} The HTML-string.
	 */
	toHtml( content = "" ) {
		if ( this.selfClosing ) {
			return `<${this.tag}${this._getAttributeString()}/>`;
		}
		return `<${this.tag}${this._getAttributeString()}>${content}</${this.tag}>`;
	}
}

export default FormattingElement;
