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
 *             type: "strong",
 *             startIndex: 13,
 *             endIndex: 24,
 *             attributes: {
 *                 id: "elem-id"
 *             }
 *         }
 *     ]
 * }
 * ```
 */
class TextContainer {
	/**
	 * Represents a text (with optional formatting element(s)) within a document that can be read by a reader.
	 */
	constructor() {
		this.text = "";
		this.formatting = [];
	}

	/**
	 * Adds a text string to the text attribute within the TextContainer.
	 *
	 * @param {string} text The text to be added to the TextContainer.
	 *
	 * @returns {void}
	 */
	appendText( text ) {
		this.text += text;
	}
}

export default TextContainer;
