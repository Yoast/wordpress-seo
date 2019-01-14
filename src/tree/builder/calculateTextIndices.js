import getElementContent from "./getElementContent";
import { ignoredHtmlElements } from "./htmlConstants";

/**
 * Removes html tags from the given html string.
 * **Note**: Only the tags are removed, _not_ the element's contents.
 *
 * @param {string} html The html string from which to remove the html tags from.
 *
 * @returns {string} The string with the html tags removed.
 *
 * @private
 */
const removeHtmlTags = function( html ) {
	return html.replace( /<[^>]*>/g, "" );
};

/**
 * Removes html elements deemed ignored in the analysis from the given html string.
 *
 * @param {string} html The html string to remove the ignored html elements from.
 *
 * @returns {string} The html string with the ignored html elements removed.
 *
 * @private
 */
const removeIrrelevantHtml = function( html ) {
	ignoredHtmlElements.forEach( tag => {
		const regex = new RegExp( `<${tag}.*>.*</${tag}>`, "g" );
		html = html.replace( regex, "" );
	} );
	return html;
};

/**
 * Closes the elements that can be closed given the position of the current element within the source code.
 *
 * The closed elements' end tag lengths are counted towards the current offset, to make sure that the computed position
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
 */
const closeElements = function( currentElement, openElements, currentOffset ) {
	/*
	  Gather all the elements that can be closed
	  (in other words when the current element is not nested inside the element to be closed).
	 */
	const elementsToClose = openElements.filter( el => el.endTagPosition <= currentElement.location.startOffset );
	elementsToClose.forEach( elementToClose => {
		/*
		  Add the end tag length of the to be closed element to the total offset,
		  and remove the element from the stack.
		 */
		currentOffset += elementToClose.endTagLength;
		const index = openElements.indexOf( elementToClose );
		openElements.splice( index, 1 );
	} );

	return currentOffset;
};

/**
 * Appends the given element to the list of opened elements (if it is not a self closing one or a void element like `img`).
 *
 * @param {module:tree/structure.FormattingElement} element        The element to append to the list.
 * @param {Object[]} openElements                     The current list of opened elements.
 *
 * @returns {void}
 */
const appendToOpenElements = function( element, openElements ) {
	const endTag = element.location.endTag;
	// Not all elements have end tags (e.g. void elements like images and self-closing elements).
	if ( endTag ) {
		// For example: "</strong>".length
		const endTagLength = endTag.endOffset - endTag.startOffset;
		openElements.push( {
			endTagPosition: endTag.endOffset,
			endTagLength: endTagLength,
		} );
	}
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

		// For example: "<strong>".length
		const startTagLength = startTag.endOffset - startTag.startOffset;

		currentOffset += startTagLength;

		appendToOpenElements( element, openElements );

		const rawContent = getElementContent( element, html );
		const content = removeHtmlTags( removeIrrelevantHtml( rawContent ) );

		// Set start and end position of element in textContainer's text.
		element.textStartIndex = startTag.endOffset - currentOffset;
		element.textEndIndex = element.textStartIndex + content.length;

		/*
		  If this element is an ignored element
		  its contents are not in the text,
		  so the current offset should be updated.
		 */
		if ( ignoredHtmlElements.includes( element.type ) ) {
			// Has 0 length in text, so end = start.
			element.textEndIndex = element.textStartIndex;
			currentOffset += rawContent.length;
		}
	} );
};

export default calculateTextIndices;

