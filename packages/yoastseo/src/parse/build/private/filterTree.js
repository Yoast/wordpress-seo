import permanentFilters from "./alwaysFilterElements";
import Node from "../../structure/Node";

/**
 * Checks if a node should be kept or discarded.
 * @param {Object} node A node.
 * @param {array} filters An array of filter callbacks.
 * @returns {boolean} true if the node should be kept, false if the node should be discarded.
 */
function shouldRemoveNode( node, filters ) {
	// Always keep text nodes.
	if ( node.name === "#text" ) {
		return false;
	}
	for ( const filter of filters ) {
		// If any of the filters returns true, the node will be disregarded.
		if ( filter( node ) ) {
			return true;
		}
	}
	// If all filters are not true, then keep the node.
	return false;
}

/**
 * A recursive fuunction that removes all nodes based on an array of filters.
 * @param {Node} node A node. (Could be the entire tree.)
 * @param {array} filters An array of callbacks. If a callback returns true, the node is discarded.
 * @returns {Node} A Node with all undesired subtrees removed.
 */
function filterTree( node, filters ) {
	// If the node should be disregarded. Return an empy node.
	if ( shouldRemoveNode( node, filters ) ) {
		return;
	}

	// If the node has childs.
	if ( node.childNodes ) {
		node.childNodes = node.childNodes.filter( childNode => filterTree( childNode, filters ) );
	}


	return node;
}

/**
 * A 'manager function' that starts of the recursive filter.
 * @param {Node} tree A node that should be filtered.
 * @param {CallableFunction[]} additionalFilters An array of additional filters that.
 * @returns {Node} A node without the filtered elements.
 */
export default function filterElements( tree, additionalFilters = [] ) {
	const fullFilter = permanentFilters.concat( additionalFilters );
	const newTree = new Node( tree.name, tree.attributes, tree.childNodes );
	return filterTree( newTree, fullFilter );
}
