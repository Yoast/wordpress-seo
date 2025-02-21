/**
 * Retrieves the parent node for a given node.
 * @param {Node} 	tree 	The current tree.
 * @param {Node} 	node 	The current node.
 * @returns {Node} The parent node.
 */
export default function getParentNode( tree, node ) {
	// Includes a fallback so that if a parent node cannot be found for an implicit paragraph, we use the current node as the parent node.
	return tree.findAll( treeNode => treeNode.childNodes?.includes( node ) )[ 0 ] || node;
}
