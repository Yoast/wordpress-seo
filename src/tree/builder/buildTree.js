import { parseFragment } from "parse5";

import TreeAdapter from "./TreeAdapter";

/**
 * Parses the given html-string to a tree, to be used in further analysis.
 *
 * @param {string} html	The html-string that should be parsed.
 * @returns {Node} The tree.
 */
export default function( html ) {
	const treeAdapter = new TreeAdapter();
	return parseFragment( html, { treeAdapter: treeAdapter, sourceCodeLocationInfo: true } );
}
