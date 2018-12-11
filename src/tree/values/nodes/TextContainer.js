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

	constructor() {
		this.text = "";
	}

	appendText( text ) {
		this.text += text;
	}
}

export default TextContainer;
