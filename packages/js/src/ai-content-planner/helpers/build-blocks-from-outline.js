import { createBlock } from "@wordpress/blocks";

/**
 * Appends blocks for a content section: heading, content suggestion, empty paragraph.
 *
 * @param {Array}  blocks      The blocks array to push to.
 * @param {string} heading     The section heading text.
 * @param {Array}  contentNotes The content suggestion notes.
 */
const pushSectionBlocks = ( blocks, heading, contentNotes ) => {
	blocks.push( createBlock( "core/heading", { content: heading, level: 2 } ) );
	blocks.push( createBlock( "yoast-seo/content-suggestion", { suggestions: contentNotes } ) );
	blocks.push( createBlock( "core/paragraph" ) );
};

/**
 * Appends blocks for the FAQ section: content suggestion, FAQ block.
 *
 * @param {Array} blocks       The blocks array to push to.
 * @param {Array} contentNotes The FAQ content suggestion notes.
 */
const pushFaqBlocks = ( blocks, contentNotes ) => {
	blocks.push( createBlock( "yoast-seo/content-suggestion", { suggestions: contentNotes } ) );
	blocks.push( createBlock( "yoast/faq-block" ) );
};

/**
 * Builds the list of blocks from a content outline.
 *
 * Supports two formats:
 * - `items` array: each item has a `type` ("section" or "faq") and renders in order.
 *   Used when the user has edited/reordered the outline in the modal.
 * - `sections` + `faqContentNotes`: sections render first, FAQ always at the end.
 *   Used when applying the API response directly without user edits.
 *
 * @param {Object} outline The content outline from the store.
 * @returns {Array} The list of blocks to insert into the editor.
 */
export const buildBlocksFromOutline = ( outline ) => {
	const blocks = [];

	if ( outline.items ) {
		for ( const item of outline.items ) {
			if ( item.type === "faq" ) {
				pushFaqBlocks( blocks, item.contentNotes );
			} else {
				pushSectionBlocks( blocks, item.heading, item.contentNotes );
			}
		}
	} else {
		for ( const { heading, contentNotes } of outline.sections ) {
			pushSectionBlocks( blocks, heading, contentNotes );
		}
		pushFaqBlocks( blocks, outline.faqContentNotes );
	}

	return blocks;
};
