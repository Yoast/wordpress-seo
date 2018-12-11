import Node from "./Node";
/**
 * A header in a document.
 */
class Heading extends Node {
	/**
	 * Makes a new header object.
	 *
	 * @param {number} level				The header level (e.g. 1 for main heading, 2 for subheading lvl 2, etc.)
	 */
	constructor( level ) {
		super( "heading" );
		this.level = level;
	}
}
export default Heading;
