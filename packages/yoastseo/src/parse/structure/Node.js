import { findAllInTree, getParentNode, innerText } from "../traverse";
import SourceCodeLocation from "./SourceCodeLocation";
import { isEmpty } from "lodash";

/**
 * A node in the tree.
 */
class Node {
	/**
	 * Creates a new node.
	 *
	 * @param {string} 			name 					The node's name or tag.
	 * @param {Object} 			attributes 				This node's attributes.
	 * @param {(Node|Text)[]} 	childNodes 				This node's child nodes.
	 * @param {Object} 			sourceCodeLocationInfo 	This node's location in the source code, from parse5.
	 */
	constructor( name, attributes = {}, childNodes = [], sourceCodeLocationInfo = {} ) {
		/**
		 * This node's name or tag.
		 * @type {string}
		 */
		this.name = name;

		/**
		 * This node's attributes.
		 * @type {Object}
		 */
		this.attributes = attributes;

		/**
		 * This node's child nodes.
		 * @type {(Node|Text)[]}
		 */
		this.childNodes = childNodes;

		// Don't add the source code location when unavailable.
		if ( ! isEmpty( sourceCodeLocationInfo ) ) {
			/**
			 * The location of this node inside the HTML.
			 * @type {SourceCodeLocation}
			 */
			this.sourceCodeLocation = new SourceCodeLocation( sourceCodeLocationInfo );
		}
	}

	/**
	 * Finds all nodes in the tree that satisfies the given condition.
	 *
	 * @param {function} 	condition 					The condition that a node should satisfy to end up in the list.
	 * @param {boolean} 	recurseFoundNodes=false 	Whether to recurse into found nodes to see if the condition
	 *  also applies to sub-nodes of the found node.
	 *
	 * @returns {(Node|Text|Paragraph|Heading)[]} The list of nodes that satisfy the condition.
	 */
	findAll( condition, recurseFoundNodes = false ) {
		return findAllInTree( this, condition, recurseFoundNodes );
	}

	/**
	 * Retrieves the parent node for the current node.
	 * @param {Node} tree The full tree for this node.
	 * @returns {Node} The parent node.
	 */
	getParentNode( tree ) {
		return getParentNode( tree, this );
	}

	/**
	 * Returns the inner text (text without any markup) from this node.
	 *
	 * @returns {string} The inner text from this node.
	 */
	innerText() {
		return innerText( this );
	}

	/**
	 * Retrieves the start offset for this node.
	 * @returns {number} The start offset.
	 */
	getStartOffset() {
		return this.sourceCodeLocation?.startTag?.endOffset || this.sourceCodeLocation?.startOffset || 0;
	}
}

export default Node;
