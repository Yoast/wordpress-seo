import { isEqual } from "lodash";
import { subscribe, select, dispatch } from "@wordpress/data";

import SchemaDefinition, { schemaDefinitions } from "../../core/schema/SchemaDefinition";
import { BlockInstance } from "@wordpress/blocks";

let updatingSchema = false;
let previousRootBlocks: BlockInstance[];

/**
 * Returns whether or not a schema definition should be rendered.
 *
 * @param definition      The definition.
 * @param parentHasSchema Whether or not a parent has already rendered schema.
 *
 * @returns Whether or not this schema should be rendered.
 */
function shouldRenderSchema( definition: SchemaDefinition, parentHasSchema: boolean ): boolean {
	if ( typeof definition === "undefined" ) {
		return false;
	}
	if ( parentHasSchema && definition.separateInGraph() ) {
		return true;
	}
	if ( ! parentHasSchema && ! definition.onlyNested() ) {
		return true;
	}
	return false;
}

/**
 * Renders a block's schema and updates the attributes if it has changed.
 *
 * @param block      The block to render schema for.
 * @param definition The definition of the schema.
 */
function renderSchema( block: BlockInstance, definition: SchemaDefinition ) {
	const schema = definition.render( block );

	// eslint-disable-next-line no-console
	console.log( "Generated schema for block: ", block, schema );

	if ( isEqual( schema, block.attributes[ "yoast-schema" ] ) ) {
		return;
	}

	dispatch( "core/block-editor" ).updateBlockAttributes( block.clientId, { "yoast-schema": schema } );
}

/**
 * Generates schema for blocks.
 *
 * @param blocks          The blocks.
 * @param previousBlocks  Optional. The previous blocks used for schema generation.
 * @param parentHasSchema Optional. Whether or not the parent has already rendered schema.
 */
function generateSchemaForBlocks( blocks: BlockInstance[], previousBlocks: BlockInstance[] = [], parentHasSchema = false ) {
	// eslint-disable-next-line no-console
	console.log( "Generating schema!" );
	for ( let i = 0; i < blocks.length; i++ ) {
		const block = blocks[ i ];
		const previousBlock = previousBlocks[ i ];

		if ( block === previousBlock ) {
			continue;
		}

		const definition = schemaDefinitions[ block.name ];
		if ( shouldRenderSchema( definition, parentHasSchema ) ) {
			renderSchema( block, definition );
			if ( Array.isArray( block.innerBlocks ) ) {
				generateSchemaForBlocks( block.innerBlocks, previousBlock ? previousBlock.innerBlocks : [], true );
			}
			continue;
		}
		if ( Array.isArray( block.innerBlocks ) ) {
			generateSchemaForBlocks( block.innerBlocks, previousBlock ? previousBlock.innerBlocks : [], parentHasSchema );
		}
	}
}

/**
 * Watches Gutenberg for relevant changes.
 */
export default function watch() {
	subscribe( () => {
		if ( updatingSchema ) {
			return;
		}

		const rootBlocks = select( "core/block-editor" ).getBlocks();
		if ( rootBlocks === previousRootBlocks ) {
			return;
		}

		// Const validations = {};
		// For ( const block of rootBlocks ) {
		// 	Const def = getBlockDefinition( block.name ); // not all blocks are ours, some have innerblocks that may contain our blocks
		// 	Const result = def.valid( block );
		// 	Validations[ block.clientId ] = result; // => to store
		// }

		updatingSchema = true;
		generateSchemaForBlocks( rootBlocks, previousRootBlocks );
		previousRootBlocks = rootBlocks;
		updatingSchema = false;
	} );
}
