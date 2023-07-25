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
		// Adjust block start and end offset.
		let startOffset = mark.getBlockPositionStart();
		let endOffset = mark.getBlockPositionEnd();
		// Retrieve the html from the start until the startOffset of the mark.
		html = html.slice( 0, mark.getBlockPositionStart() );
		// Find all html tags.
		const foundHtmlTags = [ ...html.matchAll( htmlTagsRegex ) ];
		/*
		 * Loop through the found html tags backwards, and adjust the start and end offsets of the mark
		 * by subtracting them with the length of the found html tags.
		 *
		 * This step is necessary to account for the difference in the way we "parse" the block and calculate the token position
		 * between `yoastseo` package and block annotation API.
		 * Inside `yoastseo`, the token's position information also takes into account all the HTML tags surrounding it in a block.
		 * However, the block annotation API applies annotations to "clean" text/html without any HTML tags.
		 * As a result, the token position information we retrieve from `yoastseo` wouldn't match that of block annotation API.
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
 * @param {string} richTextIdentifier	The identifier for the annotatable rich text.
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

/**
 * The regex to capture the first section of a Yoast sub-block.
 * @type {RegExp}
 */
const firstSectionRegex = /(<strong class=["'](schema-faq-question|schema-how-to-step-name)["']>)(.*?)(<\/strong>)/gis;

/**
 * Adjusts the block start and end offset for a given mark.
 *
 * @param {Mark}	mark				The Mark object to adjust.
 * @param {Object}	block				The block to get the original content from.
 * @param {String}	firstSectionHtml	The html of the first section of the sub-block.
 *
 * @returns {Mark} The adjusted mark object.
 */
const adjustBlockOffset = ( mark, block, firstSectionHtml ) => {
	// Get the original content of the block, which still contains the html tags.
	// The original content example for a Yoast FAQ block:
	/*
	 <div class="schema-faq wp-block-yoast-faq-block"><div class="schema-faq-section" id="faq-question-1689322642789">
	 <strong class="schema-faq-question">What is giant panda</strong>
	 <p class="schema-faq-answer">Giant <strong>panda</strong> is test tests</p> </div>
	 <div class="schema-faq-section" id="faq-question-1689322667728"><strong class="schema-faq-question">Test</strong>
	 <p class="schema-faq-answer">Tests</p> </div> <div class="schema-faq-section" id="faq-question-1689936392675">
	 <strong class="schema-faq-question">giant panda is silly</strong> <p class="schema-faq-answer"></p> </div> </div>
	 */
	const originalContent = block.originalContent;

	/*
	 * From the original content, get all the first sections of the sub-block.
	 *
	 * Example of the first section of a Yoast FAQ sub-block from the original content above:
	 * 1. <strong className="schema-faq-question">What is giant panda</strong>
	 * 2. <strong class="schema-faq-question">Test</strong>
	 * 3. <strong class="schema-faq-question">giant panda is silly</strong>
	 */
	const firstSectionElements = [ ...originalContent.matchAll( firstSectionRegex ) ];

	if ( firstSectionElements.length === 0 ) {
		return mark;
	}

	const startOffset = mark.getBlockPositionStart();
	const endOffset = mark.getBlockPositionEnd();

	firstSectionElements.forEach( firstSectionElement => {
		// Destructure the matched element based on the capturing groups.
		const [ , openTag, , innerText ] = firstSectionElement;

		if ( innerText === firstSectionHtml ) {
			mark.setBlockPositionStart( startOffset - openTag.length );
			mark.setBlockPositionEnd( endOffset - openTag.length );
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
		/*
		 * Get the rich text identifier of the first section of the sub-block.
		 *
		 * The rich text identifier of the first section is always the sub-block id + "-question" for Yoast FAQ block
		 * (in line with what we set in `packages/js/src/structured-data-blocks/faq/components/Question.js`), and
		 * the sub-block id + "-name" for Yoast How-To block
		 * (in line with what we set in `packages/js/src/structured-data-blocks/how-to/components/HowToStep.js`).
		 */
		const firstSectionIdentifier = `${ item.id }-${ identifierPair[ 0 ] }`;
		/*
		 * Get the rich text identifier of the second section of the sub-block.
		 *
		 * The rich text identifier of the second section is always the sub-block id + "-answer" for Yoast FAQ block
		 * (in line with what we set in `packages/js/src/structured-data-blocks/faq/components/Question.js`), and
		 * the sub-block id + "-text" for Yoast How-To block
		 * (in line with what we set in `packages/js/src/structured-data-blocks/how-to/components/HowToStep.js`).
		 */
		const secondSectionIdentifier = `${ item.id }-${ identifierPair[ 1 ] }`;

		// Get the first item of the identifier pair and make the first letter uppercase, e.g. "question" -> "Question".
		identifierPair[ 0 ] = identifierPair[ 0 ][ 0 ].toUpperCase() + identifierPair[ 0 ].slice( 1 );
		// Get the second item of the identifier pair and make the first letter uppercase, e.g. "answer" -> "Answer".
		identifierPair[ 1 ] = identifierPair[ 1 ][ 0 ].toUpperCase() + identifierPair[ 1 ].slice( 1 );

		const firstSectionHtml = item[ `json${ identifierPair[ 0 ] }` ];
		const secondSectionHtml = item[ `json${ identifierPair[ 1 ] }` ];

		let marksForFirstSection = marks.filter( mark => {
			if ( mark.hasBlockPosition() ) {
				// Filter the marks array and only include the marks that are intended for the first sub-block section.
				return mark.getBlockAttributeId() === item.id && mark.isMarkForFirstBlockSection();
			}
			return mark;
		} );

		/*
		 * For the first section marks, we need to adjust the block start and end offset.
		 *
		 * This is because the first section of a Yoast block is always wrapped in `<strong>` tags.
		 * In `yoastseo`, when calculating the position information of the matched token, we also take
		 * into account the length of `<strong>` tags.
		 * However, here, the html for the first section doesn't include the `<strong>` tags.
		 * As a result, the position information of the matched token will be incorrect.
		 */
		marksForFirstSection = marksForFirstSection.map( mark => {
			if ( mark.hasBlockPosition() ) {
				return adjustBlockOffset( mark, block, firstSectionHtml );
			}
			return mark;
		} );

		const marksForSecondSection = marks.filter( mark => {
			if ( mark.hasBlockPosition() ) {
				// Filter the marks array and only include the marks that are intended for the second sub-block section.
				return mark.getBlockAttributeId() === item.id && ! mark.isMarkForFirstBlockSection();
			}
			return mark;
		} );


		const firstSectionAnnotations = createAnnotations( firstSectionHtml, firstSectionIdentifier, attribute, block, marksForFirstSection );
		const secondSectionAnnotations = createAnnotations( secondSectionHtml, secondSectionIdentifier, attribute, block, marksForSecondSection );

		return firstSectionAnnotations.concat( secondSectionAnnotations );
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
