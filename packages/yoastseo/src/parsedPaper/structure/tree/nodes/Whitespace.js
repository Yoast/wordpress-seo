import Node from "./Node.js";
/**
 * Represents a piece of whitespace that cannot be represented by any other structured element.
 *
 * @extends module:parsedPaper/structure.Node
 *
 * @memberOf module:parsedPaper/structure
 */
class Whitespace extends Node {
	/**
	 * Represents a piece of whitespace that cannot be represented by any other structured element.
	 *
	 * @returns {void}
	 */
	constructor() {
		super( "Whitespace" );
		this.content = "";
	}
}

export default Whitespace;
