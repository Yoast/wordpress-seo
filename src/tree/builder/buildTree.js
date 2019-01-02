/* External dependencies */
import { parseFragment } from "parse5";
import Heading from "../values/nodes/Heading";
import Paragraph from "../values/nodes/Paragraph";
import StructuredIrrelevant from "../values/nodes/StructuredIrrelevant";
import { irrelevantHtmlElements } from "./htmlClasses";

/* Internal dependencies */
import TreeAdapter from "./TreeAdapter";

/**
 * Sets the start and end index of the given node or formatting element,
 * based on its source code location as parsed by `parse5`.
 *
 * @param {Node|FormattingElement} element  The element to set the start and end index of.
 *
 * @returns {void}
 */
const setStartEndIndex = function( element ) {
	if ( element.location ) {
		element.startIndex = element.location.startOffset;
		element.endIndex = element.endTag ? element.location.endTag.endOffset : element.location.endOffset;
	}
};

/**
 * Deletes parameters from the element that are used during parsing,
 * but are not needed for analysis.
 *
 * These are the parameters 'location', 'namespace' and 'tagName'.
 *
 * @param {Object} element  The element to delete parameters of.
 *
 * @returns {void}
 */
const deleteParseParameters = function( element ) {
	delete element.location;
	delete element.namespace;
	delete element.tagName;
};

/**
 * Gets the content of an element (the part _between_ the opening and closing tag) from the HTML source code.
 *
 * @param {StructuredIrrelevant|FormattingElement} element  The element to parse the contents of
 * @param {string} html                                     The source code to parse the contents from
 *
 * @returns {string} The element's contents.
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
 * Sets the start and end position of the formatting elements in the given TextContainer,
 * as found within the text container's text.
 *
 * @param {TextContainer} textContainer  The TextContainer
 * @param {string} html                  The original html source code
 *
 * @returns {void}
 */
const setStartEndText = function( textContainer, html ) {
	let startIndex = 0;
	let prevEndOffset = 0;
	let end = 0;

	textContainer.formatting.forEach( element => {
		if ( ! ( element.location.endOffset < prevEndOffset ) ) {
			/*
			  Not a nested element, update start index to make sure we do not find
			  the same text again when two elements have the same content.
			 */
			startIndex = end;
		}
		let elementText = getElementContent( element, html );
		/*
		  Remove html tags in case there are one or more elements nested inside this one.
		  E.g. "<strong>This <em>is</em></strong>" content is "This <em>is</em>", but need to find "This is" in text.
		 */
		irrelevantHtmlElements.forEach( tag => {
			// Need to remove contents of nested irrelevant elements as well as tags. (Quick and dirty, but should work 99% of the time)
			const regex = new RegExp( `<${tag}.*>.*</${tag}>`, "g" );
			elementText = elementText.replace( regex, "" );
		} );
		elementText = elementText.replace( /<[^>]*>/g, "" );

		// Search for element's content in container's text.
		const start = textContainer.text.indexOf( elementText, startIndex );
		end = start + elementText.length;

		// Set start and end position (to -1 if not found).
		element.startText = start;
		element.endText =  start === -1 ? -1 : end;

		prevEndOffset = element.location.endOffset;
	} );
};

/**
 * Cleans up the given tree after parsing of the HTML source code.
 *
 * These steps are setting the start and end index of each node and
 * deleting attributes needed for parsing, but not needed for further analysis.
 *
 * @param {Node} tree		The tree structure to be cleaned.
 * @param {string} html	The original HTML source code.
 *
 * @returns {Node} The cleaned u tree.
 */
const cleanUpAfterParsing = function( tree, html ) {
	let endIndexRootNode = 0;
	tree.map( node => {
		// Set content of irrelevant node, based on original source code.
		if ( node instanceof StructuredIrrelevant ) {
			node.content = getElementContent( node, html );
		}

		// Clean up formatting elements.
		if ( node instanceof Paragraph || node instanceof Heading ) {
			setStartEndText( node.textContainer, html );
			node.textContainer.formatting = node.textContainer.formatting.map( element => {
				setStartEndIndex( element );
				deleteParseParameters( element );

				return element;
			} );
		}

		setStartEndIndex( node );
		deleteParseParameters( node );

		endIndexRootNode = Math.max( node.endIndex, endIndexRootNode );

		return node;
	} );
	// Set root node's end index to end of text.
	tree.endIndex = endIndexRootNode;
	return tree;
};

/**
 * Parses the given html-string to a tree, to be used in further analysis.
 *
 * @param {string} html	The html-string that should be parsed.
 * @returns {Node} The tree.
 */
export default function( html ) {
	const treeAdapter = new TreeAdapter();
	let tree = parseFragment( html, { treeAdapter: treeAdapter, sourceCodeLocationInfo: true } );
	// Cleanup takes < 2ms, even after parsing a big HTML file. (measured using `console.time`).
	tree = cleanUpAfterParsing( tree, html );
	return tree;
}
