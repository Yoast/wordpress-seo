/* External dependencies */
import { subscribe, select, dispatch } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";

/* Internal dependencies */
import { collectTextualContent } from "./content";



/**
 * Adjust the description block if that is necessary.
 *
 * @param {Object} block The description block to adjust.
 *
 * @returns {void}
 */
function adjustDescriptionBlock( block ) {
	const content = collectTextualContent( block );

	if ( block.attributes.jsonDescription !== content ) {
		dispatch( "core/editor" ).updateBlockAttributes( block.clientId, { jsonDescription: content } );
	}
}

/**
 * Adjust the title block if that is necessary.
 *
 * @param {Object} block The title block to adjust
 *
 * @returns {void}
 */
function adjustTitleBlock( block ) {
	const content = collectTextualContent( block );

	if ( block.attributes.jsonTitle !== content ) {
		dispatch( "core/editor" ).updateBlockAttributes( block.clientId, { jsonTitle: content } );
	}
}

/**
 * Recurses over the blocks to adjust block specific attributes.
 *
 * @param {Array} blocks The blocks to recurse over.
 *
 * @returns {void}
 */
function recurseBlocks( blocks ) {
	for ( let i = 0; i < blocks.length; i++ ) {
		const block = blocks[ i ];

		if ( block.name === "yoast/description" ) {
			adjustDescriptionBlock( block );
		}

		if ( block.name === "yoast/title" ) {
			adjustTitleBlock( block );
		}

		if ( block.innerBlocks ) {
			recurseBlocks( block.innerBlocks );
		}
	}
}

/**
 * Sets up a subscriber to listen to Gutenberg store changes.
 *
 * This subscriber is set up to adjust certain attributes in Gutenberg blocks
 * that cannot be adjusted on the block level itself. For example, determining
 * the text content of a description block which is based on its inner blocks.
 * But the description block component itself doesn't have access to its own
 * inner blocks. So this needs to be done in a global context.
 *
 * @returns {void}
 */
function setupSubscriber() {
	let previousBlocks = null;

	subscribe( () => {
		const blocks = select( "core/editor" ).getBlocks();

		if ( blocks !== previousBlocks ) {
			recurseBlocks( blocks );

			previousBlocks = blocks;
		}
	} );
}

domReady( setupSubscriber );

export default setupSubscriber;
