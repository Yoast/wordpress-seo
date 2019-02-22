/* External dependencies */
import { subscribe, select, dispatch } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";
import { __ } from "@wordpress/i18n";

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

const placeholdersConfig = {
	"yoast/how-to": {
		"core/paragraph": __( "Start writing a description for this howto", "wordpress-seo" ),
	},
	"yoast/how-to-section": {
		"core/heading": __( "Write a step title...", "wordpress-seo" ),
		"core/paragraph": __( "Start writing a description for this step", "wordpress-seo" ),
	},
	"yoast/question": {
		"core/heading": __( "Enter your question", "wordpress-seo" ),
	},
	"yoast/answer": {
		"core/paragraph": __( "Enter your answer", "wordpress-seo" ),
	},
};

/**
 * Adjusts the placeholder property if that is necessary.
 *
 * @param {Object} block The block to adjust
 * @param {Object} placeholders The placeholders to use.
 *
 * @returns {void}
 */
function adjustPlaceholders( block, placeholders = {} ) {
	const { name, attributes, clientId } = block;

	if ( Object.keys( placeholders ).includes( name ) ) {
		const placeholder = placeholders[ name ];

		if ( attributes.placeholder !== placeholder ) {
			dispatch( "core/editor" ).updateBlockAttributes( clientId, { placeholder } );
		}
	}
}

/**
 * Recurses over the blocks to adjust block specific attributes.
 *
 * @param {Array} blocks The blocks to recurse over.
 * @param {Object} context Context to use when recursing blocks.
 *
 * @returns {void}
 */
function recurseBlocks( blocks, context = { placeholders: {} } ) {
	const childContext = {
		...context,
	};

	for ( let i = 0; i < blocks.length; i++ ) {
		const block = blocks[ i ];

		if ( block.name === "yoast/description" ) {
			adjustDescriptionBlock( block );
		}

		if ( block.name === "yoast/title" ) {
			adjustTitleBlock( block );
		}

		adjustPlaceholders( block, context.placeholders );

		if ( placeholdersConfig.hasOwnProperty( block.name ) ) {
			childContext.placeholders = placeholdersConfig[ block.name ];
		}

		if ( block.innerBlocks ) {
			recurseBlocks( block.innerBlocks, childContext );
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
