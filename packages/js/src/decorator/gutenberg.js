/* External dependencies */
import {
	isFunction,
	flatMap,
} from "lodash-es";
// The WP annotations package isn't loaded by default so force loading it.
import "@wordpress/annotations";
import { create } from "@wordpress/rich-text";
import { select, dispatch } from "@wordpress/data";

const ANNOTATION_SOURCE = "yoast";

export const START_MARK = "<yoastmark class='yoast-text-mark'>";
export const END_MARK =   "</yoastmark>";

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

const ASSESSMENT_SPECIFIC_ANNOTATION_ATTRIBUTES = {
	singleH1: {
		"core/heading": [
			{
				key: "content",
				filter: ( blockAttributes ) => {
					return blockAttributes.level === 1;
				},
			},
		],
	},
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
	return select( "core/block-editor" ) && isFunction( select( "core/block-editor" ).getBlocks ) &&
		select( "core/annotations" ) && isFunction( dispatch( "core/annotations" ).__experimentalAddAnnotation );
}

/**
 * Returns the offsets of the <yoastmark> occurrences in the given mark.
 *
 * @param {string} marked The mark object to calculate offset for.
 *
 * @returns {Array<{startOffset: number, endOffset: number}>} The start and end indices for this mark.
 */
export function getYoastmarkOffsets( marked ) {
	let startMarkIndex = marked.indexOf( START_MARK );
	let endMarkIndex = null;

	const offsets = [];

	/**
	 * Step by step search for a yoastmark-tag and its corresponding en tag. Each time a tag is found
	 * it is removed from the string because the function should return the indexes based on the string
	 * without the tags.
	 */
	while ( startMarkIndex >= 0 ) {
		marked = marked.replace( START_MARK, "" );
		endMarkIndex = marked.indexOf( END_MARK );

		if ( endMarkIndex < startMarkIndex ) {
			return [];
		}
		marked = marked.replace( END_MARK, "" );

		offsets.push( {
			startOffset: startMarkIndex,
			endOffset: endMarkIndex,
		} );

		startMarkIndex = marked.indexOf( START_MARK );
		endMarkIndex = null;
	}

	return offsets;
}

/**
 * Finds all indices for a given string in a text.
 *
 * @param {string}  text          Text to search through.
 * @param {string}  stringToFind  Text to search for.
 * @param {boolean} caseSensitive True if the search is case sensitive.
 *
 * @returns {Array} All indices of the found occurrences.
 */
export function getIndicesOf( text, stringToFind, caseSensitive = true ) {
	const indices = [];

	if ( text.length  === 0 ) {
		return indices;
	}

	let searchStartIndex = 0;
	let index;

	if ( ! caseSensitive ) {
		stringToFind = stringToFind.toLowerCase();
		text = text.toLowerCase();
	}

	while ( ( index = text.indexOf( stringToFind, searchStartIndex ) ) > -1 ) {
		indices.push( index );
		searchStartIndex = index + stringToFind.length;
	}

	return indices;
}

/**
 * Calculates an annotation if the given mark is applicable to the content of a block.
 *
 * @param {string} text The content of the block.
 * @param {Mark}   mark The mark to apply to the content.
 *
 * @returns {Array} The annotations to apply.
 */
export function calculateAnnotationsForTextFormat( text, mark ) {
	/*
	 * Remove all tags from the original sentence.
	 *
     * A cool <b>keyword</b>. => A cool keyword.
	 */
	const originalSentence = mark.getOriginal().replace( /(<([^>]+)>)/ig, "" );

	/*
	 * Remove all tags except yoastmark tags from the marked sentence.
	 *
     * A cool <b><yoastmark>keyword</yoastmark></b>. => A cool <yoastmark>keyword</yoastmark>
	 */
	const markedSentence = mark.getMarked().replace( /(<(?!\/?yoastmark)[^>]+>)/ig, "" );

	/*
	 * A sentence can occur multiple times in a text, therefore we calculate all indices where
	 * the sentence occurs. We then calculate the marker offsets for a single sentence and offset
	 * them with each sentence index.
	 *
	 * ( "A cool text. A cool keyword.", "A cool keyword." ) => [ 13 ]
	 */
	const sentenceIndices = getIndicesOf( text, originalSentence );

	if ( sentenceIndices.length === 0 ) {
		return [];
	}

	/*
	 * Calculate the mark offsets within the sentence that the current mark targets.
	 *
	 * "A cool <yoastmark>keyword</yoastmark>." => [ { startOffset: 7, endOffset: 14 } ]
	 */
	const yoastmarkOffsets = getYoastmarkOffsets( markedSentence );

	const blockOffsets = [];

	/*
	 * The offsets array holds all start- and endtag offsets for a single sentence. We now need
	 * to apply all sentence offsets to each offset to properly map them to the blocks content.
	 */
	yoastmarkOffsets.forEach( ( yoastmarkOffset ) => {
		sentenceIndices.forEach( sentenceIndex => {
			/*
			 * The yoastmarkOffset.startOffset and yoastmarkOffset.endOffset are offsets of the <yoastmark>
			 * relative to the start of the Mark object. The sentenceIndex is the index form the start of the
			 * RichText until the matched Mark, so to calculate the offset from the RichText to the <yoastmark>
			 * we need to add those offsets.
			 *
			 * startOffset = ( sentenceIndex ) 13 + ( yoastmarkOffset.startOffset ) 7 = 20
			 * endOffset =   ( sentenceIndex ) 13 + ( yoastmarkOffset.endOffset ) 14  = 27
			 *
			 * "A cool text. A cool keyword."
			 *      ( startOffset ) ^20   ^27 ( endOffset )
			 */
			const startOffset = sentenceIndex + yoastmarkOffset.startOffset;
			let endOffset = sentenceIndex + yoastmarkOffset.endOffset;

			/*
			 * If the marks are at the beginning and the end we can use the length, which gives more
			 * consistent results given we strip HTML tags.
			 */
			if ( yoastmarkOffset.startOffset === 0 && yoastmarkOffset.endOffset === mark.getOriginal().length ) {
				endOffset = sentenceIndex + originalSentence.length;
			}

			blockOffsets.push( {
				startOffset,
				endOffset,
			} );
		} );
	} );

	return blockOffsets;
}

/**
 * Returns an array of all the attributes of which we can annotate text for, for a specific block type name.
 *
 * @param {string} blockTypeName The name of the block type.
 * @returns {string[]} The attributes that we can annotate.
 */
function getAnnotatableAttributes( blockTypeName ) {
	const activeMarker = select( "yoast-seo/editor" ).getActiveMarker();

	const assessmentAttributes = ASSESSMENT_SPECIFIC_ANNOTATION_ATTRIBUTES[ activeMarker ] || ANNOTATION_ATTRIBUTES;

	if ( ! assessmentAttributes.hasOwnProperty( blockTypeName ) ) {
		return [];
	}

	return assessmentAttributes[ blockTypeName ];
}

/**
 * Returns annotations that should be applied to the given attribute.
 *
 * @param {Object} attribute The attribute to apply annotations to.
 * @param {Object} block     The block information in the state.
 * @param {Array}  marks     The marks to turn into annotations.
 *
 * @returns {Array} The annotations to apply.
 */
function getAnnotationsForBlockAttribute( attribute, block, marks ) {
	const attributeKey = attribute.key;

	const { attributes: blockAttributes } = block;
	const attributeValue = blockAttributes[ attributeKey ];

	if ( attribute.filter && ! attribute.filter( blockAttributes ) ) {
		return [];
	}

	// Create a rich text record, because those are easier to work with.
	const record = create( {
		html: attributeValue,
		multilineTag: attribute.multilineTag,
		multilineWrapperTag: attribute.multilineWrapperTag,
	} );
	const text = record.text;

	// For each mark see if it applies to this block.
	return flatMap( marks, ( ( mark ) => {
		const annotations = calculateAnnotationsForTextFormat(
			text,
			mark
		);

		if ( ! annotations ) {
			return [];
		}

		return annotations.map( annotation => {
			return {
				...annotation,
				block: block.clientId,
				richTextIdentifier: attributeKey,
			};
		} );
	} ) );
}

/**
 * Removes all annotations from the editor.
 *
 * @returns {void}
 */
function removeAllAnnotations() {
	annotationQueue = [];
	dispatch( "core/annotations" ).__experimentalRemoveAnnotationsBySource( ANNOTATION_SOURCE );
}

/**
 * Formats annotations to objects the Gutenberg annotations API works with, and adds
 * them to the queue to be scheduled for adding them to the editor.
 *
 * @param {array} annotations Annotations to be mapped to the queue.
 *
 * @returns {void}
 */
function fillAnnotationQueue( annotations ) {
	annotationQueue = annotations.map( ( annotation ) => ( {
		blockClientId: annotation.block,
		source: ANNOTATION_SOURCE,
		richTextIdentifier: annotation.richTextIdentifier,
		range: {
			start: annotation.startOffset,
			end: annotation.endOffset,
		},
	} ) );
}

/**
 * Applies the given marks as annotations in the block editor.
 *
 * @param {Paper} paper The paper that the marks are calculated for.
 * @param {Mark[]} marks The marks to annotate in the text.
 *
 * @returns {void}
 */
export function applyAsAnnotations( paper, marks ) {
	// Do this always to allow people to select a different eye marker while another one is active.
	removeAllAnnotations();

	if ( marks.length === 0 ) {
		return;
	}
	const blocks = select( "core/block-editor" ).getBlocks();

	// For every block...
	const annotations = flatMap( blocks, ( ( block ) => {
		// We go through every annotatable attribute.
		return flatMap(
			getAnnotatableAttributes( block.name ),
			( ( attribute ) => getAnnotationsForBlockAttribute( attribute, block, marks ) )
		);
	} ) );

	fillAnnotationQueue( annotations );

	scheduleAnnotationQueueApplication();
}

/**
 * Remove all annotations on a block.
 *
 * @param {string} blockClientId The block client id.
 *
 * @returns {void}
 */
function removeAllAnnotationsFromBlock( blockClientId ) {
	const annotationsInBlock = select( "core/annotations" )
		.__experimentalGetAnnotations()
		.filter( annotation => annotation.blockClientId === blockClientId && annotation.source === ANNOTATION_SOURCE );

	annotationsInBlock.forEach( annotation => {
		dispatch( "core/annotations" ).__experimentalRemoveAnnotation( annotation.id );
	} );
}

/**
 * Reapply annotations in the currently selected block.
 *
 * @returns {void}
 */
export function reapplyAnnotationsForSelectedBlock() {
	const block = select( "core/editor" ).getSelectedBlock();
	const activeMarkerId  = select( "yoast-seo/editor" ).getActiveMarker();

	if ( ! block || ! activeMarkerId ) {
		return;
	}

	removeAllAnnotationsFromBlock( block.clientId );

	const activeMarker = select( "yoast-seo/editor" ).getResultById( activeMarkerId );

	if ( typeof activeMarker === "undefined" ) {
		return;
	}

	const marksForActiveMarker = activeMarker.marks;

	const annotations = flatMap(
		getAnnotatableAttributes( block.name ),
		attribute => getAnnotationsForBlockAttribute( attribute, block, marksForActiveMarker )
	);

	fillAnnotationQueue( annotations );

	scheduleAnnotationQueueApplication();
}
