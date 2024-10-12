/* eslint-disable complexity */
import { $getRoot, $isElementNode } from "lexical";

/** @typedef {import("lexical").LexicalNode} LexicalNode */

/**
 * Retrieves all nodes.
 * Adapted $dfs to filter nodes by type, and removing the depth parameter.
 * "Depth-First Search" starts at the root/top node of a tree and goes as far as it can down a branch end
 * before backtracking and finding a new path. Consider solving a maze by hugging either wall, moving down a
 * branch until you hit a dead-end (leaf) and backtracking to find the nearest branching path and repeat.
 * It will then return all the nodes found in the search in an array of objects.
 *
 * @param {LexicalNode} [startingNode] The node to start the search, if omitted, it will start at the root node.
 * @param {LexicalNode} [endingNode] The node to end the search, if omitted, it will find all descendants of the startingNode.
 * @param {?string} [type] The type of node to filter for. Null means any type.
 *
 * @returns {LexicalNode[]} An array of all the nodes found by the search.
 * It will always return at least 1 node (the ending node) so long as it exists.
 */
export const $getAllNodes = ( { startingNode, endingNode, type = null } = {} ) => {
	const nodes = [];
	const start = ( startingNode || $getRoot() ).getLatest();
	const end = endingNode || ( $isElementNode( start ) ? start.getLastDescendant() : start );
	let node = start;

	while ( node !== null && ! node.is( end ) ) {
		if ( type === null || node.getType() === type ) {
			nodes.push( node );
		}

		if ( $isElementNode( node ) && node.getChildrenSize() > 0 ) {
			node = node.getFirstChild();
		} else {
			// Find immediate sibling or nearest parent sibling.
			let sibling = null;

			while ( sibling === null && node !== null ) {
				sibling = node.getNextSibling();

				if ( sibling === null ) {
					node = node.getParent();
				} else {
					node = sibling;
				}
			}
		}
	}

	if ( node !== null && node.is( end ) && ( type === null || node.getType() === type ) ) {
		nodes.push( node );
	}

	return nodes;
};
