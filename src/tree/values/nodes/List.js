import ListItem from "./ListItem";
import Node from "./Node";
/**
 * Represents an item within a list.
 */
class List extends Node {
	/**
	 * Represents an item within a list.
	 *
	 * @param {boolean}           ordered     Whether the list is ordered or not.
	 *
	 * @returns {void}
	 */
	constructor( ordered ) {
		super( "List" );
		this.ordered = ordered;
		this.children = [];
	}

	/**
	 * Appends the child to this List's children.
	 *
	 * @param {ListItem} child 	The child to add.
	 * @returns {void}
	 */
	appendChild( child ) {
		if ( ! ( child instanceof ListItem ) ) {
			console.warn( "Added child is not a ListItem!" );
		}
		this.children.push( child );
	}
}
export default List;
