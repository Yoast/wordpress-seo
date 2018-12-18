/* External dependencies */
import { parseFragment } from "parse5";

/* Internal dependencies */
import TreeAdapter from "./TreeAdapter";

/**
 * Cleans up a node after parsing of the HTML source code.
 *
 * These steps are setting the start and end index of each node and
 * deleting attributes needed for parsing, but not needed for further analysis.
 *
 * @param {Node} node	The node to clean up.
 * @returns {Node} The cleaned up node.
 */
const cleanUpNodeAfterParsing = function( node ) {
	// Set start and end index from location.
	if ( node.location ) {
		// (Need to do this here since end tag info is only completely available after parsing).
		node.startIndex = node.location.startOffset;

		if ( node.endTag ) {
			node.endIndex = node.location.endTag.endOffset;
		} else {
			// Some elements do not have an end tag, like comments or images.
			node.endIndex = node.location.endOffset;
		}
	}

	// Delete temporary parameters used for parsing.
	delete node.location;
	delete node.namespace;
	delete node.tagName;

	return node;
};

/**
 * Cleans up the given tree after parsing of the HTML source code.
 *
 * These steps are setting the start and end index of each node and
 * deleting attributes needed for parsing, but not needed for further analysis.
 *
 * @param {Node} tree	The tree structure to be cleaned.
 * @returns {Node} The cleaned u tree.
 */
const cleanUpAfterParsing = function( tree ) {
	let endIndexRootNode = 0;
	tree.map( node => {
		node = cleanUpNodeAfterParsing( node );

		if ( node.textContainer ) {
			node.textContainer.formatting = node.textContainer.formatting.map( cleanUpNodeAfterParsing );
		}

		endIndexRootNode = Math.max( node.endIndex, endIndexRootNode );

		return node;
	} );
	// Set root node's end index to end of text.
	tree.endIndex = endIndexRootNode;
	return tree;
};

/**
 * Parses the given html-string to a tree, to be used in further analysis.
 *
 * @param {string} html	The html-string that should be parsed.
 * @returns {Node} The tree.
 */
export default function( html ) {
	const treeAdapter = new TreeAdapter();
	let tree = parseFragment( html, { treeAdapter: treeAdapter, sourceCodeLocationInfo: true } );
	tree = cleanUpAfterParsing( tree );
	return tree;
}
