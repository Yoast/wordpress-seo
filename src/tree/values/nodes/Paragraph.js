import Node from "./Node";
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
		super( "paragraph" );
		this.tag = tag;
	}
}

export default Paragraph;
