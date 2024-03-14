import { languageProcessing, markers } from "yoastseo";
import { forEach, isEmpty, orderBy } from "lodash";

export const MARK_TAG = "yoastmark";


/**
 * Cleans the editor of any invalid marks. Invalid marks are marks where < and > are converted to
 * html entities by tinyMCE so these can be filtered out to keep the output text clean.
 *
 * @param {tinyMCE.Editor} editor The editor to remove invalid marks from.
 *
 * @returns {void}
 */
function removeInvalidMarks( editor ) {
	let html = editor.getContent();

	html = html
		.replace( new RegExp( "&lt;yoastmark.+?&gt;", "g" ), "" )
		.replace( new RegExp( "&lt;/yoastmark&gt;", "g" ), "" );

	editor.setContent( html );
}

/**
 * Applies marks with the old search and replace method.
 *
 * @param {object}  editor  Editor object. Is retrieved from the tinyMCE global.
 * @param {Paper}   paper   The paper.
 * @param {Mark[]}  marks   An array of marks that need to be applied.
 * @param {string}  html    The html to which the marks need to be applied.
 *
 * @returns {string} The HTML with the marks applied.
 */
function markTinyMCESearchBased( editor, paper, marks, html ) {
	/*
	 * Get the information whether we want to mark a specific part of the HTML. If we do, `fieldsToMark` should return an array with that information.
	 * For example, [ "heading" ] means that we want to apply the markings in subheadings only, and not the other parts.
	 * `selectedHTML` is an array of the HTML parts that we want to apply the marking to.
	 */
	const { fieldsToMark, selectedHTML } = languageProcessing.getFieldsToMark( marks, html );

	// Generate marked HTML.
	forEach( marks, function( mark ) {
		/*
		 * Classic editor uses double quotes for HTML attribute values. However, Block editor uses single quotes for HTML tag attributes,
		 * and that's why in `yoastseo`, we use single quotes for the attribute values when we create the marked object. As a result,
		 * the replacement did not work, as the marks passed by `yoastseo` did not match anything in the original text.
		 * This step is replacing the single quotes in the marked object output by `yoastseo` with double quotes.
		 * This way, we make sure that the replacement can find a match between the original text of the marked object and the text in the page.
		 */
		if ( editor.id !== "acf_content" ) {
			mark._properties.marked = languageProcessing.normalizeHTML( mark._properties.marked );
			mark._properties.original = languageProcessing.normalizeHTML( mark._properties.original );
		}

		// Check if we want to mark only specific part of the HTML.
		if ( fieldsToMark.length > 0 ) {
			// Apply the marking to the selected HTML parts.
			selectedHTML.forEach( element => {
				const markedElement = mark.applyWithReplace( element );
				html = html.replace( element, markedElement );
			} );
		} else {
			html = mark.applyWithReplace( html );
		}
	} );

	return html;
}

/**
 * Checks if either the start offset or end offset is larger than the length of the text to highlight.
 *
 * @param {Mark}    mark    A Mark object.
 * @param {string}  html    The html the mark will be checked against.
 *
 * @returns {boolean} true if the mark is out of bounds, false otherwise.
 */
function markOutOfBounds( mark, html ) {
	return mark._properties.position.startOffset > html.length ||
		mark._properties.position.endOffset > html.length;
}

function markTinyMCEPositionBased() {
	const documentWindow = document.getElementById( "content_ifr" ).contentWindow;
	const element = documentWindow.document.getElementById( "tinymce" );
	if ( ! element ) {
		console.error( "Element not found." );
		return;
	}
	console.log( element, "ELEMENT" );
	element.insertAdjacentHTML( "beforeend", "<style>::highlight(my-custom-highlight) { background-color: yellow; }</style>" );
	// Assuming 'marks' is an array of objects with text properties to highlight
	// For demonstration, let's highlight the text "cat" as an example
	const str = "cat".toLowerCase(); // The text to highlight
	// Check if the CSS Custom Highlight API is supported
	if ( ! CSS.highlights ) {
		console.error( "CSS Custom Highlight API not supported." );
		return;
	}
	// Clear the HighlightRegistry to remove previous search results
	CSS.highlights.clear();
	// Find all text nodes
	const treeWalker = document.createTreeWalker( element, NodeFilter.SHOW_TEXT );
	let currentNode = treeWalker.nextNode();
	const ranges = [];
	while ( currentNode ) {
		const textContent = currentNode.textContent.toLowerCase();
		let startIndex = 0;
		// Find occurrences of 'str' in the text node
		while ( ( startIndex = textContent.indexOf( str, startIndex ) ) !== -1 ) {
			const range = new Range();
			range.setStart( currentNode, startIndex );
			range.setEnd( currentNode, startIndex + str.length );
			/* const yoastmark = document.createElement( "yoastmark" );
			yoastmark.classList.add( "yoast-text-mark" );
			range.surroundContents( yoastmark );*/
			ranges.push( range );
			startIndex += str.length;
		}
		currentNode = treeWalker.nextNode();
	}
	// Create a Highlight object for the found ranges and add it to the highlights
	if ( ranges.length > 0 ) {
		console.log( ranges, "RANGES" );
		const searchResultsHighlight = new Highlight( ...ranges );
		console.log( searchResultsHighlight, "HIGHLIGHT" );
		documentWindow.CSS.highlights.set( "my-custom-highlight", searchResultsHighlight );
	}
}

/**
 * Applies a list of mark objects to an html string.
 *
 * @param {Mark[]}  marks   An array of mark objects that need to be applied.
 * @param {string}  html    The html to which the marks need to be applied to.
 *
 * @returns {string} The html with the marks applied.
 */
/* function markTinyMCEPositionBased( marks, html, dom ) {
	// If html is empty. Return an empty string.
	// This behaviour is set as default with no deliberate thoughts. Feel free to change this if needed.
	if ( ! html ) {
		return "";
	}

	const element = document.getElementById( "content_ifr" ).contentWindow.document.getElementById( "tinymce" );
	console.log( "ELEMENt", element );

	marks = orderBy( marks, mark => mark._properties.position.startOffset, [ "asc" ] );

	for ( let index = marks.length - 1; index >= 0; index-- ) {
		// Loop over the marks array and get the block start offset and end offset.


		const mark = marks[ index ];
		if ( markOutOfBounds( mark, html ) ) {
			continue;
		}
		const treeWalker = document.createTreeWalker( element, NodeFilter.SHOW_TEXT );
		console.log( "TREEWALKER", treeWalker );
		const allTextNodes = [];
		let currentNode = treeWalker.nextNode();
		while ( currentNode ) {
			allTextNodes.push( currentNode );
			currentNode = treeWalker.nextNode();
		}
		const ranges = allTextNodes
			.map( ( el ) => {
				return { el, text: el.textContent.toLowerCase() };
			} )
			.map( ( { text, el } ) => {
				const indices = [];
				let startPos = 0;
				while ( startPos < text.length ) {
					startPos = index + mark.getEndOffset() - mark.getStartOffset();
				}
				console.log( "INDICES", indices );
				// Create a range object for each instance of
				// str we found in the text node.
				return indices.map( ( index ) => {
					console.log( "INDEX", index );
					console.log( { el, text } );

					const range = new Range();
					range.setStart( el, index );
					range.setEnd( el, index + mark.getEndOffset() - mark.getStartOffset() );
					console.log( "RANGE", range );
					range.surroundContents( document.createElement( "em" ) );
					return range;
				} );
			} );
		console.log( "RANGES", ranges );

		if ( ! CSS.highlights ) {
			element.textContent = "CSS Custom Highlight API not supported.";
			return;
		}
	}

	// Find all text nodes in the article. We'll search within
	// these text nodes.


	// If the CSS Custom Highlight API is not supported,
	// display a message and bail-out.


	// Clear the HighlightRegistry to remove the
	// previous search results.
	// CSS.highlights.clear();

	// Clean-up the search query and bail-out if
	// if it's empty.


	// Iterate over all text nodes and find matches.

	// Create a Highlight object for the ranges.
	const searchResultsHighlight = new Highlight( ...ranges.flat() );

	// Register the Highlight object in the registry.
	CSS.highlights.set( "my-custom-highlight", searchResultsHighlight );
	console.log( "HIGHLIGHTS", CSS.highlights );


	return html;
}*/

/**
 * Puts a list of marks into the given tinyMCE editor.
 *
 * @param {tinyMCE.Editor}  editor  The editor to apply the marks to.
 * @param {Paper}           paper   The paper for which the marks have been generated.
 * @param {Array.<Mark>}    marks   The marks to show in the editor.
 *
 * @returns {void}
 */
export default function markTinyMCE( editor, paper, marks ) {
	const dom = editor.dom;
	let html = editor.getContent();
	html = markers.removeMarks( html );

	if ( isEmpty( marks ) ) {
		editor.setContent( html );
		return;
	}
	if ( marks[ 0 ].hasPosition() ) {
		html = markTinyMCEPositionBased( marks, html, dom );
	} else {
		html = markTinyMCESearchBased( editor, paper, marks, html );
	}

	// Replace the contents in the editor with the marked HTML.
	// editor.setContent( html );

	removeInvalidMarks( editor );

	const markElements = dom.select( MARK_TAG );
	/*
	 * The `mce-bogus` data is an internal tinyMCE indicator that the elements themselves shouldn't be saved.
	 * Add data-mce-bogus after the elements have been inserted because setContent strips elements with data-mce-bogus.
	 */
	forEach( markElements, function( markElement ) {
		markElement.setAttribute( "data-mce-bogus", "1" );
	} );
}
