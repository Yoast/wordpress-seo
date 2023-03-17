import combineIntoImplicitParagraphs from "./combineIntoImplicitParagraphs";
import adaptAttributes from "./adaptAttributes";
import isPhrasingContent from "./isPhrasingContent";

import { Paragraph, Text, Heading, Node } from "../../structure";

/**
 * Whether the element with the specified name is a paragraph.
 *
 * @param {string} nodeName The name/tag of the node.
 *
 * @returns {boolean} Whether the element is considered a paragraph.
 */
function isParagraph( nodeName ) {
	return nodeName === "p";
}

/**
 * Whether the element with the specified name is a heading.
 *
 * @param {string} nodeName The name/tag of the node.
 *
 * @returns {boolean} Whether the element is considered a heading.
 */
function isHeading( nodeName ) {
	return [ "h1", "h2", "h3", "h4", "h5", "h6" ].includes( nodeName );
}

/**
 * Whether the element is text.
 *
 * @param {string} nodeName The name/tag of the node.
 *
 * @returns {boolean} Whether the element is considered text.
 */
function isText( nodeName ) {
	return nodeName === "#text";
}

/**
 * Whether the element with the specified name is a block level element.
 *
 * @param {string} nodeName The name/tag of the node.
 *
 * @returns {boolean} Whether the element is considered a block level element.
 */
function isBlockElement( nodeName ) {
	return ! (
		isParagraph( nodeName ) ||
		isPhrasingContent( nodeName ) ||
		isHeading( nodeName )
	);
}

/**
 * Adapts the `parse5` tree to our own tree representation.
 *
 * By adapting the external `parse5` structure to our own tree representation
 * we reduce the coupling between our code and theirs, which makes our code
 * more robust against changes in the `parse5` library. [See also this blog post about coupling](https://mrpicky.dev/six-shades-of-coupling/)
 *
 * @param {Object} tree The parse5 tree representation.
 *
 * @returns {Node} The adapted tree.
 */
export default function adapt( tree ) {
	if ( isText( tree.nodeName ) ) {
		return new Text( tree.value );
	}

	let children = tree.childNodes.map( adapt );
	if ( isBlockElement( tree.nodeName ) ) {
		children = combineIntoImplicitParagraphs( children );
	}

	const attributes = adaptAttributes( tree.attrs );

	if ( isParagraph( tree.nodeName ) ) {
		return new Paragraph( attributes, children, tree.sourceCodeLocation );
	}

	if ( isHeading( tree.nodeName ) ) {
		const headingLevel = parseInt( tree.nodeName[ 1 ], 10 );
		return new Heading( headingLevel, attributes, children, tree.sourceCodeLocation );
	}

	return new Node( tree.nodeName, attributes, children, tree.sourceCodeLocation );
}
