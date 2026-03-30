import { createBlock } from "@wordpress/blocks";

const PARAGRAPH_KEYS = [
	{ heading: "heading1", contentNotes: "paragraph1ContentNotes" },
	{ heading: "heading2", contentNotes: "paragraph2ContentNotes" },
	{ heading: "heading3", contentNotes: "paragraph3ContentNotes" },
	{ heading: "heading4", contentNotes: "paragraph4ContentNotes" },
	{ heading: "heading5", contentNotes: "paragraph5ContentNotes" },
	{ heading: "heading6", contentNotes: "paragraph6ContentNotes" },
];

/**
 * Builds the list of blocks from a content outline.
 *
 * For each of the 6 sections: heading block, empty paragraph block, content suggestion block.
 * At the end: empty FAQ block, content suggestion block with FAQ content notes.
 *
 * @param {Object} outline The content outline from the store.
 * @returns {Array} The list of blocks to insert into the editor.
 */
export const buildBlocksFromOutline = ( outline ) => {
	const blocks = [];

	for ( const { heading, contentNotes } of PARAGRAPH_KEYS ) {
		blocks.push( createBlock( "core/heading", { content: outline[ heading ], level: 2 } ) );
		blocks.push( createBlock( "yoast-seo/content-suggestion", { suggestions: outline[ contentNotes ] } ) );
		blocks.push( createBlock( "core/paragraph" ) );
	}

	blocks.push( createBlock( "yoast-seo/content-suggestion", { suggestions: outline.faqContentNotes } ) );
	blocks.push( createBlock( "yoast/faq-block" ) );

	return blocks;
};
