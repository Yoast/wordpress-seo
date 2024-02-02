import { Paragraph } from "../../structure";

/**
 * Checks if a node should be kept or discarded.
 * @param {Node} 		node 		A node.
 * @param {Function[]} 	filters 	An array of filter callbacks.
 * @returns {boolean} True if the node should be kept, false if the node should be discarded.
 */
function shouldRemoveNode( node, filters ) {
	// Always keep text nodes.
	if ( node.name === "#text" ) {
		return false;
	}

	// If any of the filters returns true, the node will be discarded.
	return filters.some( filter => filter( node ) );
}

/**
 * A recursive function that removes all nodes based on an array of filters.
 * @param {Node} 		node 		A node. (Could be the entire tree.)
 * @param {Function[]} 	filters 	An array of callbacks. If a callback returns true, the node is discarded.
 * @returns {Node|undefined} A Node with all undesired subtrees removed.
 */
export default function filterTree( node, filters ) {
	// Returns undefined when the node should be disregarded.
	if ( shouldRemoveNode( node, filters ) ) {
		return;
	}

	// Recursively filters the node's children.
	if ( node.childNodes ) {
		node.childNodes = node.childNodes.filter( childNode => filterTree( childNode, filters ) );

		// Drops implicit paragraphs if all their child nodes have been removed.
		if ( node.childNodes.length === 0 && node instanceof Paragraph && node.isImplicit ) {
			return;
		}
	}

	return node;
}
