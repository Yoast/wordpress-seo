import { LeafNode } from "../../structure";
import Ignored from "../../structure/nodes/Ignored";
import calculateTextIndices from "./calculateTextIndices";

/**
 * Calculates the start and end index of the given node or formatting element,
 * based on its source code location as parsed by `parse5`.
 *
 * @param {module:tree/structure.Node|module:tree/structure.FormattingElement} element  The element to set the start and end index of
 *
 * @returns {void}
 *
 * @private
 */
const calculateSourceStartEndIndex = function( element ) {
	if ( element.location ) {
		element.sourceStartIndex = element.location.startOffset;
		element.sourceEndIndex = element.endTag ? element.location.endTag.endOffset : element.location.endOffset;
	}
};

/**
 * Deletes parameters from the element that are used during parsing,
 * but are not needed for analysis.
 *
 * @param {Object} element  The element to delete parameters of.
 *
 * @returns {void}
 *
 * @private
 */
const deleteParseParameters = function( element ) {
	delete element.location;
	delete element.namespace;
	delete element.tagName;
	delete element.documentMode;
};

/**
 * Gets the content of an element (the part _between_ the opening and closing tag) from the HTML source code.
 *
 * @param {module:tree/structure.Node|module:tree/structure.FormattingElement} element The element to parse the contents of
 * @param {string} html                                                                The source code to parse the contents from
 *
 * @returns {string} The element's contents.
 *
 * @private
 */
const getElementContent = function( element, html ) {
	const location = element.location;
	if ( location ) {
		const start = location.startTag ? location.startTag.endOffset : location.startOffset;
		const end = location.endTag ? location.endTag.startOffset : location.endOffset;
		return html.slice( start, end );
	}
	return "";
};

/**
 * Cleans up a node in the tree.
 *
 * @param {module:tree/structure.Node} node The node that needs to be cleaned.
 * @param {string} html                     The original html source code from which the node has been parsed.
 *
 * @returns {module:tree/structure.Node} The cleaned up node.
 *
 * @private
 */
const cleanUpNode = function( node, html ) {
	// Set content of ignored node, based on original source code.
	if ( node instanceof Ignored ) {
		node.content = getElementContent( node, html );
	}

	// Clean up formatting elements in headings and paragraphs.
	if ( node instanceof LeafNode ) {
		calculateTextIndices( node );
		node.textContainer.formatting = node.textContainer.formatting.map( element => {
			calculateSourceStartEndIndex( element );
			deleteParseParameters( element );

			return element;
		} );
	}

	calculateSourceStartEndIndex( node );
	deleteParseParameters( node );

	return node;
};

/**
 * Sets the end index of the root node to the end of the text.
 *
 * @param {module:tree/structure.Node} tree The tree of which to set the root node's end index.
 *
 * @returns {void}
 *
 * @private
 */
const setEndIndexRootNode = function( tree ) {
	let endIndexRootNode = 0;
	tree.forEach( node => {
		endIndexRootNode = Math.max( node.sourceEndIndex, endIndexRootNode );
	} );
	tree.sourceEndIndex = endIndexRootNode;
};

/**
 * Cleans up the given tree after parsing of the HTML source code.
 *
 * These steps are setting the start and end index of each node and
 * deleting attributes needed for parsing, but not needed for further analysis.
 *
 * @param {module:tree/structure.Node} tree The tree structure to be cleaned.
 * @param {string} html                     The original HTML source code.
 *
 * @returns {module:tree/structure.Node} The cleaned up tree.
 *
 * @private
 */
const cleanUpTree = function( tree, html ) {
	tree.map( node => cleanUpNode( node, html ) );
	setEndIndexRootNode( tree );
	return tree;
};

export default cleanUpTree;
