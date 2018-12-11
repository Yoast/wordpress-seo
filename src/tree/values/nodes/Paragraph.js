import Node from "./Node";
/**
 * Represents a paragraph with text within a document.
 */
class Paragraph extends Node {
	/**
	 * A paragraph within a document.
	 *
	 * @param {TextContainer} textContainer That includes the text without any formatting and phrasing elements if any.
	 * @param {number} startIndex 			Start position of this paragraph in the raw text-string.
	 * @param {number} endIndex			End position of this paragraph in the raw text-string.
	 * @param {string} [tag=""]			Optional tag to use for opening / closing this paragraph.
	 */
	constructor( textContainer, startIndex, endIndex, tag = "" ) {
		super( "paragraph", startIndex, endIndex );
		// The text with markup inside the paragraph.
		this.textContainer = textContainer;
		this.tag = tag;
	}
}

export default Paragraph;
