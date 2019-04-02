import ListItem from "./ListItem";
import Node from "./Node";
/**
 * Represents a list of items.
 *
 * @extends module:parsedPaper/structure.Node
 *
 * @memberOf module:parsedPaper/structure
 */
class List extends Node {
	/**
	 * Represents a list of items.
	 *
	 * @param {boolean} ordered Whether the list is ordered or not.
	 *
	 * @returns {void}
	 */
	constructor( ordered ) {
		super( "List" );
		/**
		 * If this list is ordered.
		 * @type {boolean}
		 */
		this.ordered = ordered;
		/**
		 * This node's children (should only be list items).
		 * @type {ListItem[]}
		 */
		this.children = [];
	}

	/**
	 * Appends the child to this List's children.
	 *
	 * @param {ListItem} child The child to add.
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
