/* External dependencies */
import isFunction from "lodash/isFunction";
import { create } from "@wordpress/rich-text";
import { select, dispatch } from "@wordpress/data";
import { string } from "yoastseo";

const { stripHTMLTags } = string;

/**
 * Returns whether or not annotations are available in Gutenberg.
 *
 * @returns {boolean} Whether or not annotations are available in Gutenberg.
 */
export function isAnnotationAvailable() {
	return isFunction( select( "core/editor" ).getBlocks ) &&
		isFunction( dispatch( "core/editor" ).addAnnotation );
}

/**
 * Returns the offset of the <yoastmark> in the given mark.
 *
 * @param {Mark} mark The mark object to calculate offset for.
 * @returns {{startOffset: number, endOffset: number}} The start and end for this mark.
 */
function getOffsets( mark ) {
	const marked = mark.getMarked();

	const startMark = "<yoastmark class='yoast-text-mark'>";
	const endMark = "</yoastmark>";

	const startOffset = marked.indexOf( startMark );
	let endOffset = marked.indexOf( endMark );

	endOffset = endOffset - startMark.length;

	return { startOffset, endOffset };
}

/**
 * Calculates an array of annotations for the given content inside a block.
 *
 * @param {string} content The content of the block.
 * @param {Mark}   mark    The mark to apply to the content.
 * @param {string} block   The block ID to apply the mark to.
 * @returns {Array} The array of annotations to apply.
 */
function calculateAnnotationsForTextFormat( content, mark, block ) {
	// Create a rich text record, because those are easier to work with.
	const record = create( { html: content } );
	const { text } = record;

	const annotations = [];

	let original = stripHTMLTags( mark.getOriginal() );
	let foundIndex = text.indexOf( original );

	/*
	 * Try again with a different HTML tag strip tactic.
	 *
	 * The rich text format in Gutenberg has no HTML at all while our marks might have some HTML.
	 * So we try to find a mark index based on the mark content with all tags stripped.
	 */
	if ( foundIndex === -1 ) {
		original = mark.getOriginal().replace( /(<([^>]+)>)/ig, "" );
		foundIndex = text.indexOf( original );
	}

	if ( foundIndex !== -1 ) {
		const offsets = getOffsets( mark );

		const startXPath = "text()[1]";
		const endXPath = "text()[1]";
		const startOffset = foundIndex + offsets.startOffset;
		let endOffset = foundIndex + offsets.endOffset;

		// If the marks are at the beginning and the end we can use the length
		// Which gives more consistent results given we strip HTML tags in there.
		if ( offsets.startOffset === 0 && offsets.endOffset === mark.getOriginal().length ) {
			endOffset = foundIndex + original.length;
		}


		// Simplest possible solution:
		annotations.push( {
			block: block.clientId,
			startXPath,
			endXPath,
			startOffset,
			endOffset,
		} );
	}

	return annotations;
}

/**
 * Applies the given marks as annotations in the block editor.
 *
 * @param {Paper} paper The paper that the marks are calculated on.
 * @param {Mark[]} marks The marks to annotate in the text.
 * @returns {void}
 */
export function applyAsAnnotations( paper, marks ) {
	const blocks = select( "core/editor" ).getBlocks();
	let annotations = [];

	blocks.forEach( ( block ) => {
		if ( block.name !== "core/paragraph" ) {
			return;
		}

		const { attributes } = block;
		const { content } = attributes;

		// For each mark see if it applies to this block.
		marks.forEach( ( mark ) => {
			let addAnnotations = [];

			addAnnotations = calculateAnnotationsForTextFormat( content, mark, block );

			annotations = annotations.concat( addAnnotations );
		} );
	} );

	if ( marks.length === 0 ) {
		wp.data.dispatch( "core/editor" ).removeAnnotationsBySource( "yoast" );
	} else {
		setTimeout( function() {
			annotations.forEach( ( annotation ) => {
				wp.data.dispatch( "core/editor" ).addAnnotation( {
					block: annotation.block,
					source: "yoast",
					startXPath: annotation.startXPath,
					startOffset: annotation.startOffset,
					endXPath: annotation.endXPath,
					endOffset: annotation.endOffset,
				} );
			} );
		}, 100 );
	}
}
