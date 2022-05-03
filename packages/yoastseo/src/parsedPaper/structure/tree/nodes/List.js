import StructuredNode from "./StructuredNode";
import ListItem from "./ListItem";

/**
 * Represents a list of items.
 *
 * @extends module:parsedPaper/structure.Node
 *
 * @memberOf module:parsedPaper/structure
 */
class List extends StructuredNode {
	/**
	 * Represents a list of items.
	 *
	 * @param {boolean} ordered            Whether the list is ordered or not.
	 * @param {Object}  sourceCodeLocation The parse5 formatted location of the element inside of the source code.
	 *
	 * @returns {void}
	 */
	constructor( ordered, sourceCodeLocation ) {
		super( "List", sourceCodeLocation );
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
	addChild( child ) {
		if ( ! ( child instanceof ListItem ) ) {
			console.warn( "Added child is not a ListItem!" );
		}
		this.children.push( child );
	}
}
export default List;
