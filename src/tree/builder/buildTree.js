/* External dependencies */
import { parseFragment } from "parse5";
import StructuredIrrelevant from "../values/nodes/StructuredIrrelevant";

/* Internal dependencies */
import TreeAdapter from "./TreeAdapter";

/**
 * Sets the start and end index of the given node or formatting element,
 * based on its source code location as parsed by `parse5`.
 *
 * @param {Node|FormattingElement} element	The element to set the start and end index of.
 *
 * @returns {void}
 */
const setStartEndIndex = function( element ) {
	element.startIndex = element.location.startOffset;

	if ( element.endTag ) {
		element.endIndex = element.location.endTag.endOffset;
	} else {
		// Some elements do not have an end tag, like comments or images.
		element.endIndex = element.location.endOffset;
	}
};

/**
 * Cleans up a node after parsing of the HTML source code.
 *
 * These steps are setting the start and end index of each node and
 * deleting attributes needed for parsing, but not needed for further analysis.
 *
 * @param {Node|FormattingElement} element	The node or formatting element to clean up.
 * @returns {Node} The cleaned up node.
 */
const cleanUpElementAfterParsing = function( element ) {
	// Set start and end index from location.
	if ( element.location ) {
		// (Need to do this here since end tag info is only completely available after parsing).
		setStartEndIndex( element );
	}

	// Delete temporary parameters used for parsing.
	delete element.location;
	delete element.namespace;
	delete element.tagName;

	return element;
};

/**
 * Cleans up the given tree after parsing of the HTML source code.
 *
 * These steps are setting the start and end index of each node and
 * deleting attributes needed for parsing, but not needed for further analysis.
 *
 * @param {Node} tree		The tree structure to be cleaned.
 * @param {string} html	The original HTML source code.
 *
 * @returns {Node} The cleaned u tree.
 */
const cleanUpAfterParsing = function( tree, html ) {
	let endIndexRootNode = 0;
	tree.map( node => {
		// Clean up node.
		node = cleanUpElementAfterParsing( node );

		// Clean up formatting elements.
		if ( node.textContainer ) {
			node.textContainer.formatting = node.textContainer.formatting.map( cleanUpElementAfterParsing );
		}

		// Set content of irrelevant node, based on original source code.
		if ( node instanceof StructuredIrrelevant ) {
			node.content = html.slice( node.startIndex, node.endIndex );
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
	tree = cleanUpAfterParsing( tree, html );
	return tree;
}
