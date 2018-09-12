// Assumes one mark element per mark object.
import isString from "lodash/isString";
import isArray from "lodash/isArray";

import { string } from "yoastseo";
const { stripHTMLTags } = string;

function getOffsets( mark ) {
	const marked = mark.getMarked();

	const startMark = "<yoastmark class='yoast-text-mark'>";
	let endMark = "</yoastmark>";

	let startOffset = marked.indexOf( startMark );
	let endOffset = marked.indexOf( endMark );

	endOffset = endOffset - startMark.length;

	return { startOffset, endOffset };
}

let calculateAnnotationsForContentPieces = function( content, mark, block ) {
	// Keeps track of how many text nodes have become before the current content piece.
	let textNodes = 0;

	const annotations = [];

	// Content is an array so we need to loop over it.
	content.forEach( ( contentPiece ) => {
		if ( ! contentPiece.indexOf ) {
			return;
		}

		const found = contentPiece.indexOf( mark.getOriginal() );

		if ( found !== -1 ) {
			const offsets = getOffsets( mark );

			const startOffset = found + offsets.startOffset;
			const endOffset = found + offsets.endOffset;
			const startXPath = `text()[${ textNodes + 1 }]`;
			const endXPath = `text()[${ textNodes + 1 }]`;

			const annotation = {
				block: block.clientId,
				startXPath,
				endXPath,
				startOffset,
				endOffset,
			};

			annotations.push( annotation );
		}

		if ( isString( contentPiece ) ) {
			textNodes += 1;
		}
	} );

	return annotations;
};


function calculateAnnotationsForTextFormat( content, mark, block ) {
	const { text, formats } = content;

	const annotations = [];

	let original = stripHTMLTags( mark.getOriginal() );
	let foundIndex = text.indexOf( original );

	// Try again with a different HTML tag strip tactic.
	if ( foundIndex === -1 ) {
		original = mark.getOriginal().replace(/(<([^>]+)>)/ig, "");
		foundIndex = text.indexOf( original );
	}

	console.log( text, foundIndex );

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

	console.log( annotations );

	return annotations;
}

/**
 * Test
 *
 * @param {*} paper Test.
 * @param {*} marks Test.
 *
 * @returns {void}
 */
export function decorate( paper, marks ) {
	const blocks = wp.data.select( "core/editor" ).getBlocks();
	let annotations = [];

	blocks.forEach( ( block ) => {
		if ( block.name !== "core/paragraph" ) {
			return;
		}

		console.log( block );

		const { attributes } = block;
		const { content } = attributes;

		// For each mark see if it applies to this block.
		marks.forEach( ( mark ) => {
			let addAnnotations = [];

			if ( isArray( content ) ) {
				addAnnotations = calculateAnnotationsForContentPieces( content, mark, block );
			} else {
				addAnnotations = calculateAnnotationsForTextFormat( content, mark, block );
			}

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
