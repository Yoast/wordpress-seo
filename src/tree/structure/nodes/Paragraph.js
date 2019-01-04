import Node from "./Node";
import TextContainer from "./TextContainer";
/**
 * Represents a paragraph with text within a document.
 */
class Paragraph extends Node {
	/**
	 * A paragraph within a document.
	 *
	 * @param {string} [tag=""] Optional tag to use for opening / closing this paragraph.
	 */
	constructor( tag = "" ) {
		super( "Paragraph" );
		/**
		 * Tag used to open or close this paragraph.
		 * @type {string}
		 */
		this.tag = tag;
		/**
		 * A container for keeping this paragraph's text and the text's formatting.
		 * @type {TextContainer}
		 */
		this.textContainer = new TextContainer();
	}

	/**
	 * If this paragraph is an explicit paragraph (with an explicit tag).
	 *
	 * @returns {boolean} If this paragraph is explicit.
	 */
	isExplicit() {
		return this.tag && this.tag.length > 0;
	}

	/**
	 * Retrieves the paragraph text (from the TextContainer).
	 *
	 * @returns {string} The text of the paragraph.
	 */
	get text() {
		return this.textContainer.text;
	}

	/**
	 * Sets the paragraph text (via the TextContainer).
	 *
	 * @param {string} text The text to assign as the paragraph text.
	 *
	 * @returns {void}
	 */
	set text( text ) {
		this.textContainer.text = text;
	}
}

export default Paragraph;
