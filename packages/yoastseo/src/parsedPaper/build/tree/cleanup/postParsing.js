import { LeafNode } from "../../../structure/tree";
import calculateTextIndices from "./calculateTextIndices";

/**
 * Cleans up a node in the tree.
 *
 * @param {module:parsedPaper/structure.Node} node The node that needs to be cleaned.
 *
 * @returns {module:parsedPaper/structure.Node} The cleaned up node.
 *
 * @private
 */
const cleanUpNode = function( node ) {
	// Clean up formatting elements in headings and paragraphs.
	if ( node instanceof LeafNode ) {
		// Start and end position in leaf node's (header's or paragraph's) text without formatting.
		calculateTextIndices( node );
	}
	return node;
};

/**
 * Cleans up the given tree after parsing of the HTML source code
 * by setting the start and end index of each formatting element in a leaf node's text.
 *
 * @param {module:parsedPaper/structure.Node} tree The tree structure to be cleaned.
 *
 * @returns {module:parsedPaper/structure.Node} The cleaned up tree.
 *
 * @private
 */
const cleanUpTree = function( tree ) {
	tree.map( node => cleanUpNode( node ) );
	return tree;
};

export default cleanUpTree;
