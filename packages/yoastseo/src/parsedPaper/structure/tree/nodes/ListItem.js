import LeafNode from "./LeafNode";
/**
 * Represents an item within a list.
 *
 * @extends module:parsedPaper/structure.Node
 *
 * @memberOf module:parsedPaper/structure
 */
class ListItem extends LeafNode {
	/**
	 * Represents an item within a list.
	 *
	 * @param {Object} sourceCodeLocation The parse5 formatted location of the element inside of the source code.
	 *
	 * @returns {void}
	 */
	constructor( sourceCodeLocation ) {
		super( "ListItem", sourceCodeLocation );
		/**
		 * This ListItem's child nodes.
		 * @type {Node[]}
		 */
		this.children = [];
	}
}
export default ListItem;
