import { createBlock } from "@wordpress/blocks";

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

	outline.forEach( ( { heading, contentNotes } ) => {
		blocks.push( createBlock( "core/heading", { content: heading, level: 2 } ) );
		blocks.push( createBlock( "yoast-seo/content-suggestion", { suggestions: contentNotes } ) );
		blocks.push( createBlock( "core/paragraph" ) );
	} );

	return blocks;
};
