/* External dependencies */
import isFunction from "lodash/isFunction";
import isUndefined from "lodash/isUndefined";
import find from "lodash/find";
import { create } from "@wordpress/rich-text";
import { select, dispatch } from "@wordpress/data";
import { string } from "yoastseo";

const { stripHTMLTags } = string;

const ANNOTATION_SOURCE = "yoast";

let annotationQueue = [];

const ANNOTATION_ATTRIBUTES = {
	"core/quote": [
		{
			key: "value",
			multilineTag: "p",
		},
		{
			key: "citation",
		},
	],
	"core/paragraph": [
		{
			key: "content",
		},
	],
	"core/list": [
		{
			key: "values",
			multilineTag: "li",
			multilineWrapperTag: [ "ul", "ol" ],
		},
	],
	"core/heading": [
		{
			key: "content",
		},
	],
};

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

	dispatch( "core/annotations" ).__experimentalAddAnnotation( nextAnnotation );

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
		! isUndefined( select( "core/annotations" ) ) &&
		isFunction( dispatch( "core/annotations" ).__experimentalAddAnnotation );
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
 * @param {string} content             The content of the block.
 * @param {Mark}   mark                The mark to apply to the content.
 * @param {string} block               The block ID to apply the mark to.
 * @param {string} multilineTag        The tag the block uses to signify multiple parts.
 * @param {string} multilineWrapperTag The tag the block uses as a container.
 * @returns {Array} The array of annotations to apply.
 */
function calculateAnnotationsForTextFormat( content, mark, block, multilineTag = false, multilineWrapperTag = false ) {
	// Create a rich text record, because those are easier to work with.
	const record = create( { html: content, multilineTag, multilineWrapperTag } );
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
			startOffset,
			endOffset,
		} );
	}

	return annotations;
}

/**
 * Returns an array of all the attributes of which we can annotate text for, for a specific block type name.
 *
 * @param {string} blockTypeName The name of the block type.
 * @returns {string[]} The attributes that we can annotate.
 */
function getAnnotateAbleAttributes( blockTypeName ) {
	return ANNOTATION_ATTRIBUTES[ blockTypeName ];
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
		dispatch( "core/annotations" ).__experimentalRemoveAnnotationsBySource( ANNOTATION_SOURCE );
		return;
	}

	const blocks = select( "core/editor" ).getBlocks();
	const annotations = [];

	blocks.forEach( ( block ) => {
		// We can only annotate certain block types.
		if ( ! Object.keys( ANNOTATION_ATTRIBUTES ).includes( block.name ) ) {
			return;
		}

		const annotateAbleAttributes = getAnnotateAbleAttributes( block.name );

		annotateAbleAttributes.forEach( ( attribute ) => {
			const attributeKey = attribute.key;

			const { attributes } = block;
			const attributeValue = attributes[ attributeKey ];

			// For each mark see if it applies to this block.
			marks.forEach( ( mark ) => {
				let addAnnotations = [];

				addAnnotations = calculateAnnotationsForTextFormat(
					attributeValue,
					mark,
					block,
					attribute.multilineTag,
					attribute.multilineWrapperTag
				);

				addAnnotations.forEach( ( addAnnotation ) => {
					annotations.push( {
						...addAnnotation,
						richTextIdentifier: attributeKey,
					} );
				} );
			} );
		} );
	} );

	annotationQueue = annotations.map( ( annotation ) => ( {
		blockClientId: annotation.block,
		source: ANNOTATION_SOURCE,
		richTextIdentifier: annotation.richTextIdentifier,
		range: {
			start: annotation.startOffset,
			end: annotation.endOffset,
		},
	} ) );
	scheduleAnnotationQueueApplication();
}
