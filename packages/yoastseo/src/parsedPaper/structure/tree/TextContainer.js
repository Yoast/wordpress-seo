/**
 * Represents a text (with optional formatting element(s)) within a document that can be read by a reader.
 *
 * Example (in the case of HTML):
 * ```html
 * This text is <strong id="elem-id">very strong</strong>.
 * ```
 * is transformed to:
 * ```js
 * TextContainer {
 *     text: "This text is very strong".
 *     formatting: [
 *         FormattingElement {
 *             type: "strong",
 *             sourceStartIndex: 13, // "This text is ".length
 *             sourceEndIndex: 54,   // "This text is <strong id="elem-id">very strong</strong>".length
 *             textStartIndex: 13,  // "This text is ".length
 *             textEndIndex: 24,    // "This text is very strong".length
 *             attributes: {
 *                 id: "elem-id"
 *             }
 *         }
 *     ]
 * }
 * ```
 *
 * @memberOf module:parsedPaper/structure
 */
class TextContainer {
	/**
	 * Represents a text (with optional formatting element(s)) within a document that can be read by a reader.
	 */
	constructor() {
		/**
		 * Clean, analyzable text, without formatting.
		 * @type {string}
		 */
		this.text = "";
		/**
		 * This text's formatting (e.g. bold text, links, etc.).
		 * @type {Array<module:parsedPaper/structure.FormattingElement||module:parsedPaper/structure.Ignored>}
		 */
		this.formatting = [];
	}

	/**
	 * Adds a text string to this container's text.
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
