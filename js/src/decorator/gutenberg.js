/* External dependencies */
import isFunction from "lodash/isFunction";
import isArray from "lodash/isArray";
import { create, getFormatType } from "@wordpress/rich-text";
import { select, dispatch } from "@wordpress/data";
import { string } from "yoastseo";

const { stripHTMLTags } = string;

const ANNOTATION_SOURCE = "yoast";

let annotationQueue = [];

/**
 * Retrieves the next annotation from the annotation queue.
 *
 * @returns {Object} An annotation object that can be applied to Gutenberg.
 */
function getNextAnnotation() {
	return annotationQueue.shift();
}

/**
 * Applies the next time annotation in the queue.
 *
 * @returns {void}
 */
function applyAnnotationQueueItem() {
	const nextAnnotation = getNextAnnotation();

	if ( ! nextAnnotation ) {
		return;
	}

	dispatch( "core/editor" ).addAnnotation( nextAnnotation );

	// eslint-disable-next-line no-use-before-define
	scheduleAnnotationQueueApplication();
}

/**
 * Schedules the application of the next available annotation in the queue.
 *
 * @returns {void}
 */
function scheduleAnnotationQueueApplication() {
	if ( isFunction( window.requestIdleCallback ) ) {
		window.requestIdleCallback( applyAnnotationQueueItem, { timeout: 1000 } );
	} else {
		setTimeout( applyAnnotationQueueItem, 150 );
	}
}

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
	const { text, formats } = record;

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
		let xpath;

		/*
		 * Because the Gutenberg implementation only works with positions we can simply pass
		 * the first element in the RichText in the XPaths and use the absolute positions as
		 * the offsets.
		 */
		const firstFormat = formats[ 0 ];
		if ( ! firstFormat || ( isArray( firstFormat ) && firstFormat.length === 0 ) ) {
			xpath = "text()[1]";
		} else {
			const firstFormats = firstFormat.map( ( format ) => {
				let tagName = format.type;
				const formatType = getFormatType( tagName );

				if ( formatType ) {
					tagName = formatType.match.tagName;
				}

				return tagName + "[1]";
			} );

			xpath = firstFormats.join( "/" ) + "/text()[1]";
		}

		const startXPath = xpath;
		const endXPath = xpath;
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
	if ( marks.length === 0 ) {
		annotationQueue = [];
		dispatch( "core/editor" ).removeAnnotationsBySource( ANNOTATION_SOURCE );
		return;
	}

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

	annotationQueue = annotations.map( ( annotation ) => ( {
		blockClientId: annotation.block,
		source: ANNOTATION_SOURCE,
		range: {
			startXPath: annotation.startXPath,
			startOffset: annotation.startOffset,
			endXPath: annotation.endXPath,
			endOffset: annotation.endOffset,
		},
	} ) );
	scheduleAnnotationQueueApplication();
}
