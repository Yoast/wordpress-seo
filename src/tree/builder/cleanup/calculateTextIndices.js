import { pull } from "lodash-es";

import getElementContent from "./getElementContent";
import { ignoredHtmlElements } from "../htmlConstants";

const gatherElementsToBeClosed = function( currentElement, openElements ) {

};

/**
 * Closes the elements that can be closed given the position of the current element within the source code.
 *
 * This does two things:
 *  1. The closed element's text end index is calculated based on the current offset.
 *  2. The closed element's end tag lengths are counted towards the current offset, to make sure that the computed position
 * of the formatting elements are still correct.
 *
 * Elements that can be closed are all elements that are opened before this element, but in which this element is
 * not nested.
 * E.g.
 * ```html
 * <strong>Hello</strong><em>World<b>!!!</b></em>`
 * ```
 * with `<b>!!!</b>` as the current element,
 * means that the `<strong>` needs to be closed, but `<em>` **not**.
 *
 * @param {module:tree/structure.FormattingElement} currentElement The current element of which the text position is parsed
 * @param {Object[]} openElements                                    The current list of open elements (of which some will be closed)
 * @param {number} currentOffset                                   The current offset when parsing the formatting elements
 *
 * @returns {number} The updated current offset
 *
 * @private
 */
const closeElements = function( currentElement, openElements, currentOffset ) {
	/*
	  Gather all the elements that can be closed
	  (in other words when the current element is not nested inside the element to be closed).
	 */
	const elementsToClose = openElements.filter( el => {
		const endTag = el.location.endTag;
		return endTag.endOffset <= currentElement.location.startOffset;
	} );

	// Sort, so we close all elements in the right order.
	elementsToClose.sort( ( a, b ) => a.location.endTag.endOffset - b.location.endTag.endOffset );

	elementsToClose.forEach( elementToClose => {
		const endTag = elementToClose.location.endTag;
		// For example: "</strong>".length
		const endTagLength = endTag.endOffset - endTag.startOffset;

		elementToClose.textEndIndex = endTag.startOffset - currentOffset;
		/*
		  Add the end tag length of the to be closed element to the total offset,
		  and remove the element from the stack.
		 */
		currentOffset += endTagLength;
		const index = openElements.indexOf( elementToClose );
		openElements.splice( index, 1 );
	} );

	return currentOffset;
};

/**
 * Sets the start and end position of the formatting elements in the given node's text.
 *
 * @param {module:tree/structure.LeafNode} node The node containing a TextContainer
 * @param {string} html                         The original html source code
 *
 * @returns {void}
 *
 * @private
 */
const calculateTextIndices = function( node, html ) {
	if ( ! node.textContainer.formatting || node.textContainer.formatting.length === 0 ) {
		return;
	}

	const openElements = [];
	/*
	  Keeps track of the current total size of the start and end tags
	  and the ignored content that should not be counted towards
	  the start and end position of the elements in the text.
	 */
	let currentOffset = node.location.startTag ? node.location.startTag.endOffset : node.location.startOffset;

	node.textContainer.formatting.forEach( element => {
		// Close elements that can be closed.
		currentOffset = closeElements( element, openElements, currentOffset );

		const startTag = element.location.startTag;
		const endTag = element.location.endTag;

		// For example: "<strong>".length
		const startTagLength = startTag.endOffset - startTag.startOffset;

		currentOffset += startTagLength;

		// Set start position of element in heading's / paragraph's text.
		element.textStartIndex = startTag.endOffset - currentOffset;

		if ( endTag ) {
			// Keep track of the elements that needs to be closed.
			openElements.push( element );
		} else {
			/*
			  Some elements have no end tags,
			  e.g. void elements like <img/> or self-closing elements.
			  We can close them immediately (with length of 0).
			 */
			element.textEndIndex = element.textStartIndex;
		}

		/*
		  If this element is an ignored element
		  its contents are not in the text,
		  so the current offset should be updated.
		 */
		if ( ignoredHtmlElements.includes( element.type ) ) {
			// Has 0 length in text, so end = start.
			element.textEndIndex = element.textStartIndex;
			const rawContent = getElementContent( element, html );
			currentOffset += rawContent.length;
		}
	} );

	// Sort, so we close all elements in the right order.
	openElements.sort( ( a, b ) => a.location.endTag.endOffset - b.location.endTag.endOffset );

	openElements.forEach( element => {
		const endTag = element.location.endTag;
		// For example: "</strong>".length
		const endTagLength = endTag.endOffset - endTag.startOffset;

		element.textEndIndex = endTag.startOffset - currentOffset;

		currentOffset += endTagLength;
	} );
};

export default calculateTextIndices;

