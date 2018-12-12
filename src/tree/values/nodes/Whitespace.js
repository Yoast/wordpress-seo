import Node from "./Node.js";
/**
 * Represents a piece of whitespace that cannot be represented by any other structured element.
 */
class Whitespace extends Node {
	/**
	 * Represents a piece of whitespace that cannot be represented by any other structured element.
	 *
	 * @param {number} startIndex	The index in the original text-string where this Whitespace begins.
	 * @param {number} endIndex	    The index in the original text-string where this Whitespace ends.
	 * @param {string} content      The content of the Whitespace (e.g., any combination of tabs, spaces, line-feeds).
	 *
	 * @returns {void}
	 */
	constructor( startIndex, endIndex, content ) {
		super( "Whitespace", startIndex, endIndex );
		this.content = content;
	}
}

export default Whitespace;
