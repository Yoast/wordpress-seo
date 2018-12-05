/**
 * Represents a paragraph with text within an HTML-document that can be read by a reader.
 */
class Paragraph {
	/**
	 * A paragraph within an HTML-document that can be read by a reader.
	 *
	 * @param {TextContainer} textContainer That includes the text without any formatting and phrasing elements if any.
	 * @param {string} [start = "<p>"] The opening tag/marking of the paragraph.
	 * @param {string} [end = "</p>"] The closing tag/marking of the paragraph.
	 */
	constructor( textContainer, start = "<p>", end = "</p>" ) {
		// The text with markup inside the paragraph.
		this.textContainer = textContainer;
		// The opening tag/marking of the paragraph.
		this.start = start;
		// The closing tag/marking of the paragraph.
		this.end = end;
	}
}

export default Paragraph;
