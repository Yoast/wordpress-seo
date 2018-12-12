import Node from "./Node";
/**
 * Represents an item within a list.
 */
class ListItem extends Node {
	/**
	 * Represents an item within a list.
	 *
	 * @returns {void}
	 */
	constructor() {
		super( "ListItem" );
		this.children = [];
	}
}
export default ListItem;
