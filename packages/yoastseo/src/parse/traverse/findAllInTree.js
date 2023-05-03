/**
 * Finds all nodes in the tree that satisfies the given condition.
 *
 * @param {Object} tree The tree.
 * @param {function} condition The condition that a node should satisfy to end up in the list.
 * @param {boolean} recurseFoundNodes=false Whether to recurse into found nodes to see if the condition also applies to sub-nodes of the found node.
 *
 * @returns {Object[]} The list of nodes that satisfy the condition.
 */
export default function findAllInTree( tree, condition, recurseFoundNodes = false ) {
	const nodes = [];

	if ( ! tree.childNodes ) {
		return nodes;
	}

	tree.childNodes.forEach( child => {
		if ( condition( child ) ) {
			nodes.push( child );
			if ( recurseFoundNodes ) {
				nodes.push( ...findAllInTree( child, condition ) );
			}
		} else {
			nodes.push( ...findAllInTree( child, condition ) );
		}
	} );

	return nodes;
}
