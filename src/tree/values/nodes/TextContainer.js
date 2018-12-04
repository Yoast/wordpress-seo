/**
 * Represents a text (with optional phrasing content) within an HTML-document that can be read by a reader.
 *
 * Example:
 * ```
 * This text is <strong id="elem-id">very strong</strong>.
 * ```
 * should be transformed to:
 * ```
 * TextContainer {
 *     text: "This text is very strong.
 *     formatting: [
 *         FormattingElement {
 *             tag: "strong",
 *             start: 13,
 *             end: 24,
 *             attributes: {
 *                 id: "elem-id"
 *             }
 *             selfClosing: false,
 *         }
 *     ]
 * }
 * ```
 */
class TextContainer {
	/**
	 * A piece of text (with optional phrasing content) within an HTML-document that can be read by a reader.
	 *
	 * @param {string} text                    The plain text, without any formatting.
	 * @param {FormattingElement[]} formatting The inline HTML-elements (e.g. <strong>, <a>) within the text.
	 */
	constructor( text, formatting ) {
		this.text = text;
		this.formatting = formatting;
	}

	/**
	 * Returns the stringified HTML-content of this text, including formatting and other phrasing content.
	 *
	 * @returns {string} The stringified HTML-content of this text.
	 */
	toHtml() {
		// Sort formatting elements so we start adding tags from the end of the text.
		const sortedFormatting = this.formatting.slice();
		sortedFormatting.sort( ( a, b ) => Math.abs( a.start - b.start ) );

		return sortedFormatting.reduce( ( text, element ) => {
			const end = text.slice( element.end );
			const start = text.slice( 0, element.start );
			const content = text.slice( element.start, element.end );

			return start + element.toHtml( content ) + end;
		}, this.text );
	}
}

export default TextContainer;
