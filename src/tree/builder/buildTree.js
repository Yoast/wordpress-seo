import { parseFragment } from "parse5";

import NewTreeAdapter from "./NewTreeAdapter";
import TreeAdapter from "./TreeAdapter";

/**
 * Parses the given html-string to a tree, to be used in further analysis.
 *
 * @param {string} html	The html-string that should be parsed.
 * @returns {Node} The tree.
 */
export default function( html ) {
	const treeAdapter = new NewTreeAdapter();
	const tree = parseFragment( html, { treeAdapter: treeAdapter, sourceCodeLocationInfo: true } );
	// Delete temporary parameters that were needed for parsing, set endIndex of root node.
	let endIndexRootNode = 0;
	tree.map( node => {
		delete node.location;
		delete node.namespace;
		delete node.parent;

		endIndexRootNode = Math.max( node.endIndex, endIndexRootNode );

		return node;
	} );
	// Set root node's end index to end of text.
	tree.endIndex = endIndexRootNode;

	return tree;
}
