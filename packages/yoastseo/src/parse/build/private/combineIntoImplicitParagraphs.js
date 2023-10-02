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
 * Updates the source code location of an implicit paragraph based on its children.
 * @param {Paragraph} implicitParagraph The implicit paragraph to update.
 * @returns {void}
 */
const updateImplicitParagraphLocation = ( implicitParagraph ) => {
	const [ firstChild ] = implicitParagraph.childNodes.slice( 0 );
	const [ lastChild ] = implicitParagraph.childNodes.slice( -1 );
	if ( ( firstChild.sourceCodeRange || firstChild.sourceCodeLocation ) && ( lastChild.sourceCodeRange || lastChild.sourceCodeLocation ) ) {
		const startOffset = firstChild.sourceCodeRange ? firstChild.sourceCodeRange.startOffset : firstChild.sourceCodeLocation.startOffset;
		const endOffset = lastChild.sourceCodeRange ? lastChild.sourceCodeRange.endOffset : lastChild.sourceCodeLocation.endOffset;
		implicitParagraph.sourceCodeLocation = new SourceCodeLocation( { startOffset: startOffset, endOffset: endOffset } );
	}
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
	nodes.forEach( node => {
		if ( isPhrasingContent( node.name ) && ! isInterElementWhitespace( node ) ) {
			// If the node is phrasing content, add it to the implicit paragraph.
			implicitParagraph.childNodes.push( node );
		} else {
			// If the node is not phrasing content, this means that the implicit paragraph has ended.
			if ( hasChildren( implicitParagraph ) ) {
				// If the implicit paragraph has children this means an implicit paragraph was created:
				// end the current implicit paragraph and start a new one.

				// But before pushing, we need to update the source code location of the implicit paragraph based on its child nodes.
				updateImplicitParagraphLocation( implicitParagraph );

				// Update the startOffset of the next implicit paragraph to be the end of the current node.
				if ( node.sourceCodeLocation ) {
					currentSourceCodeLocation.startOffset = node.sourceCodeLocation.endOffset;
				}

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
