import Node from "./Node";
/**
 * A header in a document.
 */
class Heading extends Node {
	/**
	 * Makes a new header object.
	 *
	 * @param {number} startIndex			The index in the original text-string where this Node begins.
	 * @param {number} endIndex			The index in the original text-string where this Node ends.
	 * @param {number} level				The header level (e.g. 1 for main heading, 2 for subheading lvl 2, etc.)
	 * @param {TextContainer} textContainer	The text contained within this heading.
	 */
	constructor( startIndex, endIndex, level, textContainer ) {
		super( "heading", startIndex, endIndex );
		this.level = level;
		this.textContainer = textContainer;
	}
}
export default Heading;
