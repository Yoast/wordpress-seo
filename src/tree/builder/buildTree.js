import { parseFragment } from "parse5";

import TreeBuilder from "./TreeBuilder";

/**
 * Parses the given html-string to a tree, to be used in further analysis.
 *
 * @param {string} html	The html-string that should be parsed.
 * @returns {Node} The tree.
 */
export default function( html ) {
	const treeBuilder = new TreeBuilder();
	return parseFragment( html, { treeAdapter: treeBuilder } );
}
