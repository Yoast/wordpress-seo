import Node from "./Node";
/**
 * Represents an item within a list.
 *
 * @memberOf module:tree/structure
 */
class ListItem extends Node {
	/**
	 * Represents an item within a list.
	 *
	 * @returns {void}
	 */
	constructor() {
		super( "ListItem" );
		/**
		 * This ListItem's child nodes.
		 * @type {Node[]}
		 */
		this.children = [];
	}
}
export default ListItem;
