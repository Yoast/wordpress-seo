import { flatMap, flattenDeep } from "lodash";
import { create } from "@wordpress/rich-text";

const htmlTagsRegex = /(<([^>]+)>)/ig;
export const START_MARK = "<yoastmark class='yoast-text-mark'>";
const START_MARK_DOUBLE_QUOTED = "<yoastmark class=\"yoast-text-mark\">";
export const END_MARK =   "</yoastmark>";

/**
 * Returns the offsets of the <yoastmark> occurrences in the given mark.
 * A helper for search-based highlighting.
 *
 * @param {string} marked The mark object to calculate offset for.
 *
 * @returns {Array<{startOffset: number, endOffset: number}>} The start and end indices for this mark.
 */
export function getYoastmarkOffsets( marked ) {
	let startMarkIndex = marked.indexOf( START_MARK );

	// Checks if the start mark is single quoted.
	// Note: if doesNotContainDoubleQuotedMark is true, this does necessary mean that the start mark is single quoted.
	// It could also be that the start mark doesn't occur at all in startMarkIndex.
	// In that case, startMarkIndex will be -1 during later tests.
	const doesNotContainDoubleQuotedMark = startMarkIndex >= 0;

	// If the start mark is not found, try the double-quoted version.
	if ( ! doesNotContainDoubleQuotedMark ) {
		startMarkIndex = marked.indexOf( START_MARK_DOUBLE_QUOTED );
	}

	let endMarkIndex = null;

	const offsets = [];

	/**
	 * Step by step search for a yoastmark-tag and its corresponding end tag. Each time a tag is found
	 * it is removed from the string because the function should return the indexes based on the string
	 * without the tags.
	 */
	while ( startMarkIndex >= 0 ) {
		marked = doesNotContainDoubleQuotedMark ? marked.replace( START_MARK, "" ) : marked.replace( START_MARK_DOUBLE_QUOTED, "" );

		endMarkIndex = marked.indexOf( END_MARK );

		if ( endMarkIndex < startMarkIndex ) {
			return [];
		}
		marked = marked.replace( END_MARK, "" );

		offsets.push( {
			startOffset: startMarkIndex,
			endOffset: endMarkIndex,
		} );

		startMarkIndex = doesNotContainDoubleQuotedMark ? marked.indexOf( START_MARK ) : marked.indexOf( START_MARK_DOUBLE_QUOTED );

		endMarkIndex = null;
	}

	return offsets;
}

/**
 * Finds all indices for a given string in a text.
 * A helper for search-based highlighting.
 *
 * @param {string}  text          Text to search through.
 * @param {string}  stringToFind  Text to search for.
 * @param {boolean} caseSensitive True if the search is case-sensitive.
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
 * A helper for search-based highlighting.
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
 * Creates an annotation if the given mark is position based.
 * A helper for position-based highlighting.
 *
 * @param {string} clientId The client id of the block.
 * @param {Mark}   mark The mark to apply to the content.
 * @param {string} html The HTML of the block.
 * @param {string} text The text of the block.
 *
 * @returns {Array} The annotations to apply.
 */
export function createAnnotationsFromPositionBasedMarks( clientId, mark, html, text ) {
	if ( clientId === mark.getBlockClientId() ) {
		const slicedHtml = html.slice( mark.getBlockPositionStart(), mark.getBlockPositionEnd() );
		const slicedText = text.slice( mark.getBlockPositionStart(), mark.getBlockPositionEnd() );
		// Check if the html and the rich text contain the same text in the specified index.
		if ( slicedHtml === slicedText ) {
			return [
				{
					startOffset: mark.getBlockPositionStart(),
					endOffset: mark.getBlockPositionEnd(),
				},
			];
		}
		// Adjust block position start and end.
		let startOffset = mark.getBlockPositionStart();
		let endOffset = mark.getBlockPositionEnd();
		// Retrieve the html from the start until the startOffset of the mark.
		html = html.slice( 0, mark.getBlockPositionStart() );
		// Find all html tags.
		const foundHtmlTags = [ ...html.matchAll( htmlTagsRegex ) ];
		/*
		 * Loop through the found html tags backwards, and adjust the start and end offsets of the mark
		 * by subtracting them with the length of the found html tags.
		 */
		for ( let i = foundHtmlTags.length - 1; i >= 0; i-- ) {
			const currentHtmlTag = foundHtmlTags[ i ][ 0 ];
			startOffset -= currentHtmlTag.length;
			endOffset -= currentHtmlTag.length;
		}
		return [
			{
				startOffset: startOffset,
				endOffset: endOffset,
			},
		];
	}
	return [];
}

/**
 * Creates the annotations for a block.
 *
 * @param {string} html					The string where we want to apply the annotations.
 * @param {string} richTextIdentifier   The identifier for the annotatable richt text.
 * @param {Object} attribute			The attribute to apply annotations to.
 * @param {Object} block				The block information in the state.
 * @param {Mark[]} marks				The marks to turn into annotations.
 *
 * @returns {Array}  An array of annotations for a specific block.
 */
function createAnnotations( html, richTextIdentifier, attribute, block, marks ) {
	const blockClientId = block.clientId;

	const record = create( {
		html: html,
		multilineTag: attribute.multilineTag,
		multilineWrapperTag: attribute.multilineWrapperTag,
	} );

	const text = record.text;

	return flatMap( marks, mark  => {
		let annotations;
		if ( mark.hasBlockPosition && mark.hasBlockPosition() ) {
			annotations = createAnnotationsFromPositionBasedMarks( blockClientId, mark, html, text );
		} else {
			annotations = calculateAnnotationsForTextFormat(
				text,
				mark
			);
		}

		if ( ! annotations ) {
			return [];
		}

		return annotations.map( annotation => {
			return {
				...annotation,
				block: blockClientId,
				richTextIdentifier: richTextIdentifier,
			};
		} );
	} );
}
const firstIdentifierRegex = /(<strong class=["'](schema-faq-question|schema-how-to-step-name)["']>)(.*?)(<\/strong>)/gis;

/**
 * Adjusts the block start and end offset for a given mark.
 *
 * @param {Mark} mark The Mark object to adjust.
 * @param {Object} block The block to get the original content from.
 * @param {String} firstIdentifierHtml	The html of the first identifier.
 *
 * @returns {Mark} The adjusted mark object.
 */
const adjustBlockOffset = ( mark, block, firstIdentifierHtml ) => {
	const originalContent = block.originalContent;
	const firstPairElements = [ ...originalContent.matchAll( firstIdentifierRegex ) ];
	if ( firstPairElements.length === 0 ) {
		return mark;
	}
	const startOffset = mark.getBlockPositionStart();
	const endOffset = mark.getBlockPositionEnd();
	firstPairElements.forEach( firstPairElement => {
		if ( firstPairElement[ 3 ] === firstIdentifierHtml ) {
			mark.setBlockPositionStart( startOffset - firstPairElement[ 1 ].length );
			mark.setBlockPositionEnd( endOffset - firstPairElement[ 1 ].length );
		}
	} );
	return mark;
};

/**
 * Gets annotations from an array of annotatable block attribute.
 * This is a helper specifically for Yoast blocks.
 * Yoast blocks' annotatable attribute is an array of objects where each object contains a pair of annotatble texts.
 * For example Yoast FAQ block's annotatable attribute is `questions`:
 * {
 *     attributes: {
 *         questions: [
 *         		{ jsonQuestion: "", jsonAnswers: "" },
 *         		{ jsonQuestion: "", jsonAnswers: "" },
 *         ]
 *     }
 * }
 *
 * @param {Object[]}	array			An array of annotatable block attribute.
 * @param {Mark[]}		marks			An array mark object to create annotations for.
 * @param {Object}		attribute		The attribute to apply annotations to.
 * @param {Object}		block			The block information in the state.
 * @param {Array}		identifierPair	An array of identifier pair for the block.
 * For example, the identifier pair for the FAQ block is `[ "question", "answer" ]`, in this order.
 *
 * @returns {Array} The annotations created for the block attribute.
 */
const getAnnotationsFromArray = ( array, marks, attribute, block, identifierPair ) => {
	array = array.map( item => {
		const firstIdentifier = `${ item.id }-${ identifierPair[ 0 ] }`;
		const secondIdentifier = `${ item.id }-${ identifierPair[ 1 ] }`;

		// Get the first item of the identifier pair and make the first letter uppercase.
		identifierPair[ 0 ] = identifierPair[ 0 ][ 0 ].toUpperCase() + identifierPair[ 0 ].slice( 1 );
		// Get the second item of the identifier pair and make the first letter uppercase.
		identifierPair[ 1 ] = identifierPair[ 1 ][ 0 ].toUpperCase() + identifierPair[ 1 ].slice( 1 );

		const firstIdentifierHtml = item[ `json${ identifierPair[ 0 ] }` ];
		const secondIdentifierHtml = item[ `json${ identifierPair[ 1 ] }` ];

		let marksForFirstIdentifier = marks.filter( mark => {
			if ( mark.hasBlockPosition() ) {
				return mark.getBlockAttributeId() === item.id && mark.isMarkForFirstBlockPair();
			}
			return mark;
		} );
		marksForFirstIdentifier = marksForFirstIdentifier.map( mark => {
			if ( mark.hasBlockPosition() ) {
				return adjustBlockOffset( mark, block, firstIdentifierHtml );
			}
			return mark;
		} );
		const marksForSecondIdentifier = marks.filter( mark => {
			if ( mark.hasBlockPosition() ) {
				return mark.getBlockAttributeId() === item.id && ! mark.isMarkForFirstBlockPair();
			}
			return mark;
		} );


		const firstIdentifierAnnotations = createAnnotations( firstIdentifierHtml, firstIdentifier, attribute, block, marksForFirstIdentifier );
		const secondIdentifierAnnotations = createAnnotations( secondIdentifierHtml, secondIdentifier, attribute, block, marksForSecondIdentifier );

		return firstIdentifierAnnotations.concat( secondIdentifierAnnotations );
	} );
	return flattenDeep( array );
};

/**
 * Gets the annotations for Yoast FAQ block.
 *
 * @param {Object} attribute The attribute to apply annotations to.
 * @param {Object} block     The block information in the state.
 * @param {Array}  marks     The marks to turn into annotations.
 * @returns {Array} The created annotations.
 */
const getAnnotationsForFAQ = ( attribute, block, marks ) => {
	const annotatableTexts = block.attributes[ attribute.key ];
	if ( annotatableTexts.length === 0 ) {
		return [];
	}

	return getAnnotationsFromArray( annotatableTexts, marks, attribute, block, [ "question", "answer" ] );
};

/**
 * Gets the annotations for Yoast How-To block.
 *
 * @param {Object} attribute The attribute to apply annotations to.
 * @param {Object} block     The block information in the state.
 * @param {Array}  marks     The marks to turn into annotations.
 * @returns {Array} The created annotations.
 */
const getAnnotationsForHowTo = ( attribute, block, marks ) => {
	const annotatableTexts = block.attributes[ attribute.key ];
	if ( annotatableTexts.length === 0 ) {
		return [];
	}
	const annotations = [];
	if ( attribute.key === "steps" ) {
		annotations.push( getAnnotationsFromArray( annotatableTexts, marks, attribute, block, [ "name", "text" ] ) );
	}
	if ( attribute.key === "jsonDescription" ) {
		marks = marks.filter( mark => {
			return mark.hasBlockPosition() && ! mark.getBlockAttributeId();
		} );
		annotations.push( createAnnotations( annotatableTexts, "description", attribute, block, marks ) );
	}
	return flattenDeep( annotations );
};

/**
 * Gets the annotations for Yoast FAQ block and Yoast How-To block.
 *
 * @param {Object} attribute The attribute to apply annotations to.
 * @param {Object} block     The block information in the state.
 * @param {Array}  marks     The marks to turn into annotations.
 *
 * @returns {Array} An array of annotations for Yoast blocks.
 */
export function getAnnotationsForYoastBlock( attribute, block, marks ) {
	// For Yoast FAQ and How-To blocks, we create separate annotation objects for each individual Rich Text found in the attribute.
	if ( block.name === "yoast/faq-block" ) {
		return getAnnotationsForFAQ( attribute, block, marks );
	}
	// The check for getting the annotations for Yoast How-To block.
	if ( block.name === "yoast/how-to-block" ) {
		return getAnnotationsForHowTo( attribute, block, marks );
	}
}

/**
 * Gets the annotations for non-Yoast blocks.
 *
 * @param {Object} attribute The attribute to apply annotations to.
 * @param {Object} block     The block information in the state.
 * @param {Array}  marks     The marks to turn into annotations.
 *
 * @returns {Array} The annotations to apply.
 */
export function getAnnotationsForWPBlock( attribute, block, marks ) {
	const richTextIdentifier = attribute.key;
	const html = block.attributes[ richTextIdentifier ];

	return createAnnotations( html, richTextIdentifier, attribute, block, marks );
}
