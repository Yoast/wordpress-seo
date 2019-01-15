import { pullAll } from "lodash-es";

import { ignoredHtmlElements } from "../htmlConstants";

/**
 * Gathers all elements that can be closed given the position of the current element in the source code.
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
 * @param {module:tree/structure.FormattingElement} currentElement The current element.
 * @param {module:tree/structure.FormattingElement[]} openElements The elements that are currently open.
 *
 * @returns {module:tree/structure.FormattingElement[]} The elements that can be closed.
 */
const elementsThatCanBeClosed = function( currentElement, openElements ) {
	return openElements.filter( el => {
		const endTag = el.location.endTag;
		return endTag.endOffset <= currentElement.location.startOffset;
	} );
};

/**
 * Closes the elements that can be closed given the position of the current element within the source code.
 *
 * This does two things:
 *  1. The closed element's text end index is calculated based on the current offset.
 *  2. The closed element's end tag lengths are counted towards the current offset, to make sure that the computed position
 * of the formatting elements are still correct.
 *
 * @param {module:tree/structure.FormattingElement[]} elementsToClose The list of open elements that need to be closed
 * @param {number} currentOffset                                      The current offset when parsing the formatting elements
 *
 * @returns {number} The updated current offset
 *
 * @private
 */
const closeElements = function( elementsToClose, currentOffset ) {
	// Sort, so we close all elements in the right order.
	elementsToClose.sort( ( a, b ) => a.location.endTag.endOffset - b.location.endTag.endOffset );

	elementsToClose.forEach( elementToClose => {
		const endTag = elementToClose.location.endTag;
		// Set the end position as seen in the text.
		elementToClose.textEndIndex = endTag.startOffset - currentOffset;
		/*
		  Add the end tag length of the to be closed element to the total offset,
		  and remove the element from the stack.
		 */
		// For example: "</strong>".length
		const endTagLength = endTag.endOffset - endTag.startOffset;
		currentOffset += endTagLength;
	} );

	return currentOffset;
};

/**
 * Adds the content length of the given element (the part between the tags) to the current offset.
 *
 * @param {module:tree/structure.FormattingElement} element The element of which to add the content length.
 * @param {number} currentOffset                            The current offset to which to add the length to.
 *
 * @returns {number} The updated current offset
 */
const addIgnoredContentToOffset = function( element, currentOffset ) {
	// Has 0 length in text, so end = start.
	element.textEndIndex = element.textStartIndex;

	// Update current offset.
	const location = element.location;
	const start = location.startTag ? location.startTag.endOffset : location.startOffset;
	const end = location.endTag ? location.endTag.startOffset : location.endOffset;

	currentOffset += end - start;

	return currentOffset;
};

/**
 * Sets the start and end position of the formatting elements in the given node's text.
 *
 * @param {module:tree/structure.LeafNode} node The node containing a TextContainer
 *
 * @returns {void}
 *
 * @private
 */
const calculateTextIndices = function( node ) {
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
		const elementsToClose = elementsThatCanBeClosed( element, openElements );
		currentOffset = closeElements( elementsToClose, currentOffset );
		// Remove closed elements from the list.
		pullAll( openElements, elementsToClose );

		const startTag = element.location.startTag;
		const endTag = element.location.endTag;

		// For example: "<strong>".length
		const startTagLength = startTag.endOffset - startTag.startOffset;

		currentOffset += startTagLength;

		// Set start position of element in heading's / paragraph's text.
		element.textStartIndex = startTag.endOffset - currentOffset;

		if ( endTag ) {
			// Keep track of the elements that need to be closed.
			openElements.push( element );
		} else {
			/*
			  Some elements have no end tags,
			  e.g. void elements like <img/> or self-closing elements.
			  We can close them immediately (with length of 0, since it has no content).
			 */
			element.textEndIndex = element.textStartIndex;
		}

		/*
		  If this element is an ignored element
		  its contents are not in the text,
		  so the current offset should be updated.
		 */
		if ( ignoredHtmlElements.includes( element.type ) ) {
			currentOffset = addIgnoredContentToOffset( element, currentOffset );
		}
	} );
	// Close all remaining elements.
	closeElements( openElements, currentOffset );
};

export default calculateTextIndices;

