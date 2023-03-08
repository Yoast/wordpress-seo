import { findAllInTree, innerText } from "../traverse";

/**
 * A node in the tree.
 */
class Node {
	/**
	 * Creates a new node.
	 *
	 * @param {string} name The node's name or tag.
	 * @param {Object} attributes This node's attributes.
	 * @param {(Node|Text)[]} childNodes This node's child nodes.
	 */
	constructor( name, attributes = {}, childNodes = [] ) {
		this.name = name;
		this.attributes = attributes;
		this.childNodes = childNodes;
	}

	/**
	 * Finds all nodes in the tree that satisfies the given condition.
	 *
	 * @param {function} condition The condition that a node should satisfy to end up in the list.
	 *
	 * @returns {(Node|Text|Paragraph|Heading)[]} The list of nodes that satisfy the condition.
	 */
	findAll( condition ) {
		return findAllInTree( this, condition );
	}

	/**
	 * Returns the inner text (text without any markup) from this node.
	 *
	 * @returns {string} The inner text from this node.
	 */
	innerText() {
		return innerText( this );
	}
}

export default Node;
