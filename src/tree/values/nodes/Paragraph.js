import Node from "./Node";
import TextContainer from "./TextContainer";
/**
 * Represents a paragraph with text within a document.
 */
class Paragraph extends Node {
	/**
	 * A paragraph within a document.
	 *
	 * @param {string} [tag=""]			Optional tag to use for opening / closing this paragraph.
	 */
	constructor( tag = "" ) {
		super( "Paragraph" );
		this.tag = tag;
		this.textContainer = new TextContainer();
	}
}

export default Paragraph;
