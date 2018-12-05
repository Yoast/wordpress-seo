/**
 * Represents a text (with optional formatting element(s)) within a document that can be read by a reader.
 *
 * Example (in the case of HTML):
 * ```
 * This text is <strong id="elem-id">very strong</strong>.
 * ```
 * should be transformed to:
 * ```
 * TextContainer {
 *     text: "This text is very strong".
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
	 * A piece of text (with optional formatting element(s)) within a text that can be read by a reader.
	 *
	 * @param {string} text                    The plain text, without any formatting.
	 * @param {FormattingElement[]} formatting The inline formatting elements (e.g. <strong>, ,"_" (MarkDown)) within the text.
	 */
	constructor( text, formatting ) {
		this.text = text;
		this.formatting = formatting;
		this._validate();
	}

	/**
	 * Checks if this is a valid TextContainer. If it is not, throws an error.
	 *
	 * @private
	 *
	 * @throws {RangeError}	When one of the formatting element's end positions are larger than this TextContainer's text.
	 *
	 * @returns {void}
	 */
	_validate() {
		// Check if a formatting element's end pos is larger than the length of the text.
		const elem = this.formatting.find( format => format.end > this.text.length );
		if ( elem ) {
			throw new RangeError(
				`The end position of the '${elem.tag}' formatting element should be smaller than the length of the text.`
			);
		}
	}

	/**
	 * Returns the content of this text in stringified HTML-format, including formatting.
	 *
	 * @returns {string}	The stringified HTML-content of this text.
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
