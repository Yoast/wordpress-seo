/**
 * Represents a paragraph with text within an HTML-document that can be read by a reader.
 */
class Paragraph {
	/**
	 * A paragraph within an HTML-document that can be read by a reader.
	 *
	 * @param {TextContainer} textContainer That includes the text without any formatting and phrasing elements if any.
	 * @param {string} openingTag The opening tag of the paragraph.
	 * @param {string} closingTag The closing tag of the paragraph.
	 */
	constructor( textContainer, openingTag = "<p>", closingTag = "</p>" ) {
		// The text with markup inside the paragraph.
		this.textContainer = textContainer;
		// The opening tag of the paragraph.
		this.startHtml = openingTag;
		// The closing tag of the paragraph.
		this.endHtml = closingTag;
	}
}

export default Paragraph;
