import { isEqual } from "lodash";
import { subscribe, select, dispatch } from "@wordpress/data";
import SchemaDefinition, { schemaDefinitions } from "../../core/schema/SchemaDefinition";
import { BlockInstance } from "@wordpress/blocks";
import { getBlockDefinition } from "../../core/blocks/BlockDefinitionRepository";
import { BlockValidation, BlockValidationResult } from "../../core/validation";
import storeBlockValidation from "./storeBlockValidation";

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
 Validates blocks recursively.
@param blocks The block instances to validate.
@returns {BlockValidationResult[]} Validation results for each (inner)block of the given blocks.
 */
export function validateBlocks( blocks: BlockInstance[] ): BlockValidationResult[] {
	const validations: BlockValidationResult[] = [];
	blocks.forEach( block => {
		// This may be a third party block we cannot validate.
		const definition = getBlockDefinition( block.name );
		if ( definition ) {
			validations.push( definition.validate( block ) );
		} else {
			// eslint-disable-next-line no-console
			console.log( "Unable to validate block of type [" + block.name + "] " + block.clientId );
			validations.push( new BlockValidationResult( block.clientId, block.name, BlockValidation.Unknown ) );

			// Recursively validate all blocks' innerblocks.
			if ( block.innerBlocks && block.innerBlocks.length > 0 ) {
				validations.push( ...validateBlocks( block.innerBlocks ) );
			}
		}
	} );
	return validations;
}

/**
 * Watches Gutenberg for relevant changes.
 */
export default function watch() {
	subscribe( () => {
		if ( updatingSchema ) {
			return;
		}

		const rootBlocks: BlockInstance[] = select( "core/block-editor" ).getBlocks();
		if ( rootBlocks === previousRootBlocks ) {
			return;
		}

		updatingSchema = true;
		{
			const validations = validateBlocks( rootBlocks );
			storeBlockValidation( validations );

			generateSchemaForBlocks( rootBlocks, previousRootBlocks );
			previousRootBlocks = rootBlocks;
		}
		updatingSchema = false;
	} );
}
