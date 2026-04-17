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
 * For each section: heading block, content suggestion block, empty paragraph block.
 * At the end: FAQ content suggestion block, empty FAQ block.
 *
 * @param {Object} outline The content outline from the store.
 * @returns {Array} The list of blocks to insert into the editor.
 */
export const buildBlocksFromOutline = ( outline ) => {
	const blocks = [];

	for ( const { heading, contentNotes } of outline.sections ) {
		blocks.push( createBlock( "core/heading", { content: heading, level: 2 } ) );
		blocks.push( createBlock( "yoast-seo/content-suggestion", { suggestions: contentNotes } ) );
		blocks.push( createBlock( "core/paragraph" ) );
	}

	blocks.push( createBlock( "yoast-seo/content-suggestion", { suggestions: outline.faqContentNotes } ) );
	blocks.push( createBlock( "yoast/faq-block" ) );

	return blocks;
};
