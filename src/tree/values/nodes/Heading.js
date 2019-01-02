import Node from "./Node";
import TextContainer from "./TextContainer";
/**
 * A header in a document.
 */
class Heading extends Node {
	/**
	 * Makes a new header object.
	 *
	 * @param {number} level The header level (e.g. 1 for main heading, 2 for subheading lvl 2, etc.)
	 */
	constructor( level ) {
		super( "Heading" );
		/**
		 * Heading's level (e.g. 1 for "h1", 2 for "h2", ... ).
		 * @type {number}
		 */
		this.level = level;
		/**
		 * A container for keeping this heading's
		 * @type {TextContainer}
		 */
		this.textContainer = new TextContainer();
	}

	/**
	 * Retrieves the heading text (from the TextContainer).
	 *
	 * @returns {string} The text of the heading.
	 */
	get text() {
		return this.textContainer.text;
	}

	/**
	 * Sets the heading text (via the TextContainer).
	 *
	 * @param {string} text The text to assign as the heading text.
	 *
	 * @returns {void}
	 */
	set text( text ) {
		this.textContainer.text = text;
	}
}
export default Heading;
