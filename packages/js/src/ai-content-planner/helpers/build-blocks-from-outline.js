import { createBlock } from "@wordpress/blocks";

/**
 * Builds the list of blocks from a content outline.
 *
 * Supports two formats:
 * - `items` array: each item has a `type` ("section" or "faq") and renders in order.
 *   Used when the user has edited/reordered the outline in the modal.
 * - `sections` + `faqContentNotes` (legacy): sections render first, FAQ always at the end.
 *   Used when applying the raw API response without user edits.
 *
 * @param {Object} outline The content outline from the store.
 * @returns {Array} The list of blocks to insert into the editor.
 */
export const buildBlocksFromOutline = ( outline ) => {
	const blocks = [];

	if ( outline.items ) {
		for ( const item of outline.items ) {
			if ( item.type === "faq" ) {
				blocks.push( createBlock( "yoast-seo/content-suggestion", { suggestions: item.contentNotes } ) );
				blocks.push( createBlock( "yoast/faq-block" ) );
			} else {
				blocks.push( createBlock( "core/heading", { content: item.heading, level: 2 } ) );
				blocks.push( createBlock( "yoast-seo/content-suggestion", { suggestions: item.contentNotes } ) );
				blocks.push( createBlock( "core/paragraph" ) );
			}
		}
	} else {
		for ( const { heading, contentNotes } of outline.sections ) {
			blocks.push( createBlock( "core/heading", { content: heading, level: 2 } ) );
			blocks.push( createBlock( "yoast-seo/content-suggestion", { suggestions: contentNotes } ) );
			blocks.push( createBlock( "core/paragraph" ) );
		}
		blocks.push( createBlock( "yoast-seo/content-suggestion", { suggestions: outline.faqContentNotes } ) );
		blocks.push( createBlock( "yoast/faq-block" ) );
	}

	return blocks;
};
