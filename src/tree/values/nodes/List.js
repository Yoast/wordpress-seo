import Node from "./Node";
/**
 * Represents an item within a list.
 */
class List extends Node {
	/**
	 * Represents an item within a list.
	 *
	 * @param {number}            startIndex  The index of the beginning of the list item.
	 * @param {number}            endIndex    The index of the end of the list item.
	 * @param {Array<ListItem>}   children    The sub-elements of the list item.
	 *
	 * @returns {void}
	 */
	constructor( startIndex, endIndex, children ) {
		super( "list", startIndex, endIndex );
		this.children = children;
	}
}
export default List;
