import combineIntoImplicitParagraphs from "./combineIntoImplicitParagraphs";
import adaptAttributes from "./adaptAttributes";
import isPhrasingContent from "./isPhrasingContent";
import { isEmpty } from "lodash";
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
 * Checks whether the current node is an overarching paragraph.
 * Overarching paragraphs have double `<br>` nodes (line breaks) in their children.
 * We consider those to be indicating the end and start of an implicit paragraph, similar to the `autop` function in WordPress.
 *
 * @param {string} nodeName The name of the current node.
 * @param {Node[]} children The children of the current nodes.
 *
 * @returns {boolean} Whether the current node is an overarching paragraph.
 */
function isOverarchingParagraph( nodeName, children ) {
	return isParagraph( nodeName ) && children.some( ( node, index, childNodes ) => {
		const nextNode = childNodes.length - 1 !== index && childNodes[ index + 1 ];
		return node.name === "br" && nextNode && nextNode.name === "br";
	} );
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
		return new Text( tree );
	}

	let children = [];
	let isOverarching = false;
	if ( ! isEmpty( tree.childNodes ) ) {
		children = tree.childNodes.map( adapt );
		if ( isBlockElement( tree.nodeName ) ) {
			children = combineIntoImplicitParagraphs( children, tree.sourceCodeLocation );
		}
		if ( isOverarchingParagraph( tree.nodeName, children ) ) {
			isOverarching = true;
			children = combineIntoImplicitParagraphs( children, tree.sourceCodeLocation );
		}
	}

	const attributes = adaptAttributes( tree.attrs );

	if ( isParagraph( tree.nodeName ) ) {
		return new Paragraph( attributes, children, tree.sourceCodeLocation, false, isOverarching );
	}

	if ( isHeading( tree.nodeName ) ) {
		const headingLevel = parseInt( tree.nodeName[ 1 ], 10 );
		return new Heading( headingLevel, attributes, children, tree.sourceCodeLocation );
	}

	return new Node( tree.nodeName, attributes, children, tree.sourceCodeLocation );
}
