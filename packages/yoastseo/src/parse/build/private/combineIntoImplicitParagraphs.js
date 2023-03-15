import isPhrasingContent from "./isPhrasingContent";
import { Paragraph } from "../../structure";

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
 *
 * @returns {Array} The combined nodes.
 */
function combineIntoImplicitParagraphs( nodes ) {
	const newNodes = [];
	let implicitParagraph = Paragraph.createImplicit();

	nodes.forEach( node => {
		if ( isPhrasingContent( node.name ) && ! isInterElementWhitespace( node ) ) {
			implicitParagraph.childNodes.push( node );
		} else {
			if ( hasChildren( implicitParagraph ) ) {
				newNodes.push( implicitParagraph );
				implicitParagraph = Paragraph.createImplicit();
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
