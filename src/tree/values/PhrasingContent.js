/**
 * Represents phrasing content (e.g. <strong>, <a>, <em>) within an HTML-text.
 */
class PhrasingContent {
	/**
	 * Represents phrasing content (e.g. <strong>, <a>, <em>) within an HTML-text.
	 *
	 * @param {string} tag the HTML-tag of this element (e.g. "strong", "a", etc.)
	 * @param {number} start the start position of the tag within the text.
	 * @param {number} end the end position of the tag within the text.
	 * @param {Object} [attributes] the attributes (as key-value pairs, e.g. "href='...'" => { href: '...' } ).
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
	 * @param {Object} attributes the attributes to serialize.
	 * @returns {string} the stringified attributes.
	 */
	getAttributeString( attributes ) {
		if ( attributes ) {
			return Object.keys( attributes ).reduce( ( string, key ) => {
				return string + ` ${key}='${attributes[ key ]}'`;
			}, "" );
		}
		return "";
	}

	/**
	 * Stringifies this phrasing content to an HTML-string.
	 *
	 * @param {string} content the content to insert between the content tags.
	 * @returns {string} the HTML-string.
	 */
	toHtml( content ) {
		return `<${this.tag}${this.getAttributeString( this.attributes )}>${content}</${this.tag}>`;
	}
}

export default PhrasingContent;
