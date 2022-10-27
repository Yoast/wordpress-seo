/**
 * Finds all nodes in the tree that satisfies the given condition.
 *
 * @param {Object} tree The tree.
 * @param {function} condition The condition that a node should satisfy to end up in the list.
 *
 * @returns {Object[]} The list of nodes that satisfy the condition.
 */
export default function findAllInTree( tree, condition ) {
	const nodes = [];

	if ( ! tree.childNodes ) {
		return nodes;
	}

	tree.childNodes.forEach( child => {
		if ( condition( child ) ) {
			nodes.push( child );
		} else {
			nodes.push( ...findAllInTree( child, condition ) );
		}
	} );

	return nodes;
}
