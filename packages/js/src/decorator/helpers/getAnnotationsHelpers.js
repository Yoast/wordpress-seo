import { flatMap, flattenDeep } from "lodash";
import { create } from "@wordpress/rich-text";
import { createAnnotationsFromPositionBasedMarks } from "./positionBasedAnnotationHelper";
import { calculateAnnotationsForTextFormat } from "./searchBasedAnnotationHelper";

/**
 * Creates the annotations for a block.
 *
 * @param {string} html								The string where we want to apply the annotations.
 * @param {string} richTextIdentifier				The identifier for the annotatable rich text.
 * @param {Object} attributeWithAnnotationSupport	The attribute we have annotation support for.
 * @param {Object} block							The block object from the editor.
 * @param {Mark[]} marks							The marks to turn into annotations.
 *
 * @returns {[{startOffset: number, endOffset: number}]}  An array of annotations for a specific block.
 */
function createAnnotations( html, richTextIdentifier, attributeWithAnnotationSupport, block, marks ) {
	const blockClientId = block.clientId;

	const record = create( {
		html: html,
		multilineTag: attributeWithAnnotationSupport.multilineTag,
		multilineWrapperTag: attributeWithAnnotationSupport.multilineWrapperTag,
	} );

	const richText = record.text;

	return flatMap( marks, mark => {
		let annotations;
		if ( mark.hasBlockPosition && mark.hasBlockPosition() ) {
			annotations = createAnnotationsFromPositionBasedMarks( mark, blockClientId, block.name, html, richText );
		} else {
			annotations = calculateAnnotationsForTextFormat( richText, mark );
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
 * Gets the key name for a given identifier by making the first letter of the identifier capitalized.
 *
 * @param {string} identifier The identifier to get the key name for.
 *
 * @returns {string} The key name for the given identifier.
 */
const getKeyName = ( identifier ) => {
	return identifier[ 0 ].toUpperCase() + identifier.slice( 1 );
};

/**
 * Retrieves the array of Mark objects for a Yoast sub-block.
 *
 * @param {Mark[]} marks				An array of Mark objects.
 * @param {Object} annotatableAttribute	An annotatable attribute from a Yoast block.
 *
 * @returns {{marksForFirstSection: Mark[], marksForSecondSection: Mark[]}}	The filtered array of Mark objects.
 */
const getMarksForYoastBlock = ( marks, annotatableAttribute ) => {
	const marksForFirstSection = marks.filter( mark => {
		if ( mark.hasBlockPosition && mark.hasBlockPosition() ) {
			// Filter the marks array and only include the marks that are intended for the first sub-block section.
			return mark.getBlockAttributeId() === annotatableAttribute.id && mark.isMarkForFirstBlockSection();
		}
		return mark;
	} );

	const marksForSecondSection = marks.filter( mark => {
		if ( mark.hasBlockPosition && mark.hasBlockPosition() ) {
			// Filter the marks array and only include the marks that are intended for the second sub-block section.
			return mark.getBlockAttributeId() === annotatableAttribute.id && ! mark.isMarkForFirstBlockSection();
		}
		return mark;
	} );

	return {
		marksForFirstSection,
		marksForSecondSection,
	};
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
 * @param {Object[]}	annotatableAttributesFromBlock	An array of annotatable attributes from the block.
 * @param {Mark[]}		marks							An array mark object to create annotations for.
 * @param {Object}		attributeWithAnnotationSupport	The attribute we have annotation support for.
 * @param {Object}		block							The block object from the editor.
 * @param {Array}		identifierPair					An array of identifier pair for the block.
 * For example, the identifier pair for the FAQ block is `[ "question", "answer" ]`, in this order.
 *
 * @returns {Array} The annotations created for the block attribute.
 */
const getAnnotationsFromBlockAttributes = ( annotatableAttributesFromBlock, marks, attributeWithAnnotationSupport, block, identifierPair ) => {
	annotatableAttributesFromBlock = annotatableAttributesFromBlock.map( annotatableAttribute => {
		/*
 		 * Get the rich text identifiers for the first and second section.
 		 * In case of a how-to block the first section is the name and the second section is the text explaining the step.
 		 * In case of a Q&A block, the first section is the question and the second section is the answer.
 		 *
 		 * The rich text identifier of the first section is always the sub-block id + "-question" for Yoast FAQ block
 		 * and the sub-block id + "-name" for Yoast How-To block.
 		 *
 		 * The rich text identifier of the second section is always the sub-block id + "-answer" for Yoast FAQ block
 		 * and the sub-block id + "-text" for Yoast How-To block.
 		 *
 		 * These values are set by us in `packages/js/src/structured-data-blocks/faq/components/Question.js` and
 		 * `packages/js/src/structured-data-blocks/how-to/components/HowToStep.js`.
		 */
		const firstSectionIdentifier = `${ annotatableAttribute.id }-${ identifierPair[ 0 ] }`;
		const secondSectionIdentifier = `${ annotatableAttribute.id }-${ identifierPair[ 1 ] }`;

		// Get the first item of the identifier pair and make the first letter uppercase, e.g. "question" -> "Question".
		const firstSectionKeyName = getKeyName( identifierPair[ 0 ] );
		// Get the second item of the identifier pair and make the first letter uppercase, e.g. "answer" -> "Answer".
		const secondSectionKeyName = getKeyName( identifierPair[ 1 ] );

		const firstSectionHtml = annotatableAttribute[ `json${ firstSectionKeyName }` ];
		const secondSectionHtml = annotatableAttribute[ `json${ secondSectionKeyName }` ];

		const { marksForFirstSection, marksForSecondSection } = getMarksForYoastBlock( marks, annotatableAttribute );
		// eslint-disable-next-line stylistic/max-len
		const firstSectionAnnotations = createAnnotations( firstSectionHtml, firstSectionIdentifier, attributeWithAnnotationSupport, block, marksForFirstSection );
		// eslint-disable-next-line stylistic/max-len
		const secondSectionAnnotations = createAnnotations( secondSectionHtml, secondSectionIdentifier, attributeWithAnnotationSupport, block, marksForSecondSection );

		return firstSectionAnnotations.concat( secondSectionAnnotations );
	} );

	return flattenDeep( annotatableAttributesFromBlock );
};

/**
 * Gets the annotations for Yoast FAQ block.
 *
 * @param {Object} attributeWithAnnotationSupport	The attribute we have annotation support for.
 * @param {Object} block	The block object from the editor.
 * @param {Mark[]} marks	The marks to turn into annotations.
 *
 * @returns {[{startOffset: number, endOffset: number}]} The created annotations for Yoast FAQ block.
 */
export const getAnnotationsForFAQ = ( attributeWithAnnotationSupport, block, marks ) => {
	const annotatableTextsFromBlock = block.attributes[ attributeWithAnnotationSupport.key ];
	if ( annotatableTextsFromBlock.length === 0 ) {
		return [];
	}

	return getAnnotationsFromBlockAttributes( annotatableTextsFromBlock, marks, attributeWithAnnotationSupport, block, [ "question", "answer" ] );
};

/**
 * Gets the annotations for Yoast How-To block.
 *
 * @param {Object} attributeWithAnnotationSupport The attribute we have annotation support for.
 * @param {Object} block	The block object from the editor.
 * @param {Mark[]}  marks	The marks to turn into annotations.
 *
 * @returns {[{startOffset: number, endOffset: number}]} The created annotations for Yoast How-To block.
 */
export const getAnnotationsForHowTo = ( attributeWithAnnotationSupport, block, marks ) => {
	const annotatableTextsFromBlock = block.attributes[ attributeWithAnnotationSupport.key ];
	if ( annotatableTextsFromBlock && annotatableTextsFromBlock.length === 0 ) {
		return [];
	}
	const annotations = [];
	if ( attributeWithAnnotationSupport.key === "steps" ) {
		annotations.push( getAnnotationsFromBlockAttributes( annotatableTextsFromBlock, marks, attributeWithAnnotationSupport, block, [ "name", "text" ] ) );
	}
	if ( attributeWithAnnotationSupport.key === "jsonDescription" ) {
		// Filter out marks that are intended for the "steps" attribute above.
		marks = marks.filter( mark => {
			if ( mark.hasBlockPosition && mark.hasBlockPosition() ) {
				return ! mark.getBlockAttributeId();
			}
			return mark;
		} );
		annotations.push( createAnnotations( annotatableTextsFromBlock, "description", attributeWithAnnotationSupport, block, marks ) );
	}
	return flattenDeep( annotations );
};

/**
 * Retrieves the HTML for a RichText block given its identifier.
 * Before, the HTML content could be retrieved by directly calling on the RichText block's attributes.
 * Since Gutenberg 17.3.0, that returns a RichTextData object, from which we can retrieve the HTML through `toString()`.
 * Note that we can not use getBlockContent from `@wordpress/blocks` here, as the richTextIdentifier may differ per block.
 *
 * @param {Object} block The block.
 * @param {string} richTextIdentifier The identifier.
 * @returns {string} The HTML.
 */
const getBlockHtml = ( block, richTextIdentifier ) => {
	const richTextData = block.attributes[ richTextIdentifier ];
	return typeof richTextData === "string" ? richTextData : ( richTextData || "" ).toString();
};

/**
 * Gets the annotations for non-Yoast blocks.
 *
 * @param {Object} attributeWithAnnotationSupport The attribute we have annotation support for.
 * @param {Object} block	The block object from the editor.
 * @param {Mark[]} marks	The marks to turn into annotations.
 *
 * @returns {[{startOffset: number, endOffset: number}]} The annotations to apply.
 */
export function getAnnotationsForWPBlock( attributeWithAnnotationSupport, block, marks ) {
	const richTextIdentifier = attributeWithAnnotationSupport.key;
	const blockHtml = getBlockHtml( block, richTextIdentifier );

	return createAnnotations( blockHtml, richTextIdentifier, attributeWithAnnotationSupport, block, marks );
}
