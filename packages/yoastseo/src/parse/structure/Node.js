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
}

export default Node;
