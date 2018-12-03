/**
 * Represents a text (with optional phrasing content) within an HTML-document that can be read by a reader.
 */
class TextContainer {
	/**
	 * A piece of text (with optional phrasing content) within an HTML-document that can be read by a reader.
	 *
	 * @param {string} text the text, without any formatting.
	 * @param {FormattingElement[]} formatting the inline HTML-elements (e.g. <strong>, <a>) within the text.
	 */
	constructor( text, formatting ) {
		this.text = text;
		this.formatting = formatting;
	}

	/**
	 * Returns the stringified HTML-content of this text, including formatting and other phrasing content.
	 *
	 * @returns {string} the stringified HTML-content of this text.
	 */
	toHtml() {
		return this.formatting.reduce( ( text, element ) => {
			const end = text.slice( element.end );
			const start = text.slice( 0, element.start );
			const content = text.slice( element.start, element.end );

			return start + element.toHtml( content ) + end;
		}, this.text );
	}
}

export default TextContainer;
