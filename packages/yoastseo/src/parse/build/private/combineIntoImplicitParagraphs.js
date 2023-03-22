import isPhrasingContent from "./isPhrasingContent";
import { Paragraph } from "../../structure";
import { isEmpty } from "lodash-es";

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
 * Combines runs of phrasing content ("inline" tags like `a` and `span`, and text) into implicit paragraphs.
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
	if ( ! isEmpty( parentSourceCodeLocation ) ) {
		currentSourceCodeLocation = {
			startOffset: parentSourceCodeLocation.startTag
				? parentSourceCodeLocation.startTag.endOffset
				: parentSourceCodeLocation.startOffset,
			endOffset: parentSourceCodeLocation.endTag
				? parentSourceCodeLocation.endTag.startOffset
				: parentSourceCodeLocation.endOffset,
		};
	}

	let implicitParagraph = Paragraph.createImplicit( {}, [], currentSourceCodeLocation );

	nodes.forEach( node => {
		if ( isPhrasingContent( node.name ) && ! isInterElementWhitespace( node ) ) {
			implicitParagraph.childNodes.push( node );
		} else {
			if ( hasChildren( implicitParagraph ) ) {
				// The implicit paragraph has children: end the current implicit paragraph and start a new one.

				if ( ! isEmpty( node.sourceCodeLocation ) ) {
					// Update the endOffset of the current implicit paragraph to be the start of the current node.
					if ( ! isEmpty( implicitParagraph.sourceCodeLocation ) ) {
						implicitParagraph.sourceCodeLocation.endOffset = node.sourceCodeLocation.startOffset;
					}
					// Update the startOffset of the next implicit paragraph to be the end of the current node.
					currentSourceCodeLocation.startOffset = node.sourceCodeLocation.endOffset;
				}

				newNodes.push( implicitParagraph );
				implicitParagraph = Paragraph.createImplicit( {}, [], currentSourceCodeLocation );
			}
			newNodes.push( node );
		}
	} );

	if ( hasChildren( implicitParagraph ) ) {
		newNodes.push( implicitParagraph );
	}

	return newNodes;
}

export default combineIntoImplicitParagraphs;
