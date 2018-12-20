/**
 * @module traverseTree
 * Utility functions for traversing the tree.
 */

/**
 * Finds the most recent ancestor (parent of parent of ... ) of this node that returns true
 * on the given predicate.
 *
 * @param {Node|FormattingElement} element  The node to find the ancestor of.
 * @param {predicate} predicate	             The predicate to check the ancestors on.
 *
 * @returns {Node|null} The most recent ancestor that returns true on the given predicate.
 */
const findAncestor = function( element, predicate ) {
	let parent = element.parent;
	while ( ! predicate( parent ) && parent.parent !== null ) {
		parent = parent.parent;
	}
	return parent;
};

export {
	findAncestor,
};
