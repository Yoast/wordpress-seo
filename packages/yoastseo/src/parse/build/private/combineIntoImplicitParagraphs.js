import isPhrasingContent from "./isPhrasingContent";
import { Paragraph } from "../../structure";
import { isEmpty } from "lodash-es";
import SourceCodeLocation from "../../structure/SourceCodeLocation";

/**
 * Checks whether a node is inter-element whitespace.
 *
 * @see https://html.spec.whatwg.org/#inter-element-whitespace
 *
 * @param {Object} node The node to check.
 *
 * @returns {boolean} Whether the node is inter-element whitespace.
 */
function isInterElementWhitespace( node ) {
	return node.name === "#text" && node.value && node.value.match( /^[\n\s]+$/g );
}

/**
 * Checks whether a node has any children.
 *
 * @param {Object} node The node to check.
 *
 * @returns {boolean} Whether the node has any children.
 */
function hasChildren( node ) {
	return node && node.childNodes.length > 0;
}

/**
 * Sets the new source code location for an implicit paragraph.
 * If the implicit paragraph already has a source code location, only update the start offset, if not, set a new source code location.
 *
 * @param {Paragraph} implicitParagraph The implicit paragraph to update.
 * @param {number} newStartOffset The new start offset.
 * @param {number} newEndOffset The new end offset.
 * @returns {void}
 */
const setNewLocation = ( implicitParagraph, newStartOffset, newEndOffset ) => {
	if ( implicitParagraph.sourceCodeLocation ) {
		implicitParagraph.sourceCodeLocation.startOffset = newStartOffset;
	} else {
		implicitParagraph.sourceCodeLocation = new SourceCodeLocation( {
			startOffset: newStartOffset,
			endOffset: newEndOffset,
		} );
	}
};

/**
 * Updates the source code location of an implicit paragraph based on its first child.
 * @param {Paragraph} implicitParagraph The implicit paragraph to update.
 * @returns {void}
 */
const updateImplicitParagraphLocation = ( implicitParagraph ) => {
	// Check if there is a source code range or location on the first child node. The reason for this is that tree-nodes have a source code location
	// and text-nodes have a source code range. Another approach would be is to check whether we are dealing with a text-node or a tree-node,
	// but this way we also do a bit of defensive programming.
	const firstChild = implicitParagraph.childNodes[ 0 ];
	if ( firstChild.sourceCodeRange && ! isEmpty( firstChild.sourceCodeRange ) ) {
		const newStartOffset = firstChild.sourceCodeRange.startOffset;
		const newEndOffset = firstChild.sourceCodeRange.endOffset;
		setNewLocation( implicitParagraph, newStartOffset, newEndOffset );
	} else if ( firstChild.sourceCodeLocation && ! isEmpty( firstChild.sourceCodeLocation ) ) {
		const newStartOffset = firstChild.sourceCodeLocation.startOffset;
		const newEndOffset = firstChild.sourceCodeLocation.endOffset;
		setNewLocation( implicitParagraph, newStartOffset, newEndOffset );
	}
};

/**
 * Updates the source code location of the implicit paragraph and the current source code location based on it's child nodes.
 * @param {Node} node The current node.
 * @param {Paragraph} implicitParagraph The implicit paragraph.
 * @param {SourceCodeLocation} currentSourceCodeLocation The current source code location.
 *
 * @returns {void}
 */
const updateSourceCodeLocation = ( node, implicitParagraph, currentSourceCodeLocation ) => {
	if ( ! isEmpty( node.sourceCodeLocation ) ) {
		// Update the endOffset of the current implicit paragraph to be the start of the current node.
		if ( ! isEmpty( implicitParagraph.sourceCodeLocation ) ) {
			implicitParagraph.sourceCodeLocation.endOffset = node.sourceCodeLocation.startOffset;
		}

		updateImplicitParagraphLocation( implicitParagraph );

		// Update the startOffset of the next implicit paragraph to be the end of the current node.
		currentSourceCodeLocation.startOffset = node.sourceCodeLocation.endOffset;
	}
};

/**
 * Checks whether the current node is part of a double line break.
 * @param {Node} currentNode The current node.
 * @param {Node} prevNode The previous node (if available).
 * @param {Node} nextNode The next node (if available).
 * @returns {boolean} Whether the current node is part of a double line break
 */
const isPartOfDoubleBreak = ( currentNode, prevNode, nextNode ) => {
	const prevNodeIsBreak = prevNode && prevNode.name === "br";
	const nextNodeIsBreak = nextNode && nextNode.name === "br";
	return currentNode.name === "br" && ( prevNodeIsBreak || nextNodeIsBreak );
};

/**
 * Combines series of consecutive phrasing content ("inline" tags like `a` and `span`, and text) into implicit paragraphs.
 *
 * @see https://html.spec.whatwg.org/#paragraphs
 *
 * @param {Array} nodes The nodes to combine where able to.
 * @param {Object} parentSourceCodeLocation This parent node's location in the source code, from parse5.
 *
 * @returns {Array} The combined nodes.
 */
function combineIntoImplicitParagraphs( nodes, parentSourceCodeLocation = {} ) {
	const newNodes = [];
	let currentSourceCodeLocation = {};
	// For implicit paragraphs, strip off the start and end tag information from the parent's source code location.
	if ( isEmpty( parentSourceCodeLocation ) ) {
		const firstNode = nodes[ 0 ];
		const lastNode = nodes[ nodes.length - 1 ];

		if ( firstNode && lastNode && firstNode.sourceCodeLocation && lastNode.sourceCodeLocation ) {
			currentSourceCodeLocation = new SourceCodeLocation( {
				startOffset: firstNode.sourceCodeLocation.startOffset,
				endOffset: lastNode.sourceCodeLocation.endOffset,
			} );
		}
	} else {
		currentSourceCodeLocation = new SourceCodeLocation( {
			startOffset: parentSourceCodeLocation.startTag
				? parentSourceCodeLocation.startTag.endOffset
				: parentSourceCodeLocation.startOffset,
			endOffset: parentSourceCodeLocation.endTag
				? parentSourceCodeLocation.endTag.startOffset
				: parentSourceCodeLocation.endOffset,
		} );
	}

	let implicitParagraph = Paragraph.createImplicit( {}, [], currentSourceCodeLocation );
	nodes.forEach( ( node, index, allNodes ) => {
		const prevNode = 0 !== index && allNodes[ index - 1 ];
		const nextNode = allNodes.length - 1 !== index && allNodes[ index + 1 ];

		if ( isPhrasingContent( node.name ) && ! isInterElementWhitespace( node ) && ! isPartOfDoubleBreak( node, prevNode, nextNode ) ) {
			// If the node is phrasing content, add it to the implicit paragraph.
			implicitParagraph.childNodes.push( node );
		} else {
			// If the node is not phrasing content, this means that the implicit paragraph has ended.
			if ( hasChildren( implicitParagraph ) ) {
				// If the implicit paragraph has children this means an implicit paragraph was created:
				// end the current implicit paragraph and start a new one.

				// But before pushing, we need to update the source code location of the implicit paragraph based on its child nodes.
				updateSourceCodeLocation( node, implicitParagraph, currentSourceCodeLocation );

				newNodes.push( implicitParagraph );
				implicitParagraph = Paragraph.createImplicit( {}, [], currentSourceCodeLocation );
			}
			newNodes.push( node );
		}
	} );

	if ( hasChildren( implicitParagraph ) ) {
		updateImplicitParagraphLocation( implicitParagraph );

		newNodes.push( implicitParagraph );
	}
	return newNodes;
}

export default combineIntoImplicitParagraphs;
