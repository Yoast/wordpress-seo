import { debounce, isEqual } from "lodash";
import { dispatch, select, subscribe } from "@wordpress/data";
import SchemaDefinition, { schemaDefinitions } from "../../core/schema/SchemaDefinition";
import { BlockInstance } from "@wordpress/blocks";
import warningWatcher from "./watchers/warningWatcher";
import { getBlockDefinition } from "../../core/blocks/BlockDefinitionRepository";
import { BlockPresence, BlockValidation, BlockValidationResult } from "../../core/validation";
import storeBlockValidation from "./storeBlockValidation";
import logger from "../logger";
import { isResultValidForSchema } from "../validators/validateResults";
import { missingBlocks } from "../validators/missingBlocks";
import Schema from "../../instructions/schema/Schema";

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

	logger.debug( "Generated schema for block: ", block, schema );

	if ( isEqual( schema, block.attributes[ "yoast-schema" ] ) ) {
		return;
	}

	dispatch( "core/block-editor" ).updateBlockAttributes( block.clientId, { "yoast-schema": schema } );
}

/**
 * Removes any existing Schema output for a given block instance.
 *
 * @param block The block instance to clear schema for.
 */
function clearSchemaForBlocks( block: BlockInstance ) {
	dispatch( "core/block-editor" ).updateBlockAttributes( block.clientId, { "yoast-schema": null } );
}

/**
 * Generates schema for blocks.
 *
 * @param blocks          The blocks.
 * @param validations     The validation results for the blocks.
 * @param previousBlocks  Optional. The previous blocks used for schema generation.
 * @param parentHasSchema Optional. Whether or not the parent has already rendered schema.
 */
function generateSchemaForBlocks(
	blocks: BlockInstance[], validations: BlockValidationResult[], previousBlocks: BlockInstance[] = [], parentHasSchema = false ) {
	logger.info( "Generating schema!" );
	for ( let i = 0; i < blocks.length; i++ ) {
		const block = blocks[ i ];
		const previousBlock = previousBlocks[ i ];

		if ( block === previousBlock ) {
			continue;
		}

		const validation = validations.find( v => v.clientId === block.clientId );
		if ( validation && ! isResultValidForSchema( validation.result ) ) {
			clearSchemaForBlocks( block );
			continue;
		}

		const definition = schemaDefinitions[ block.name ];

		if ( definition ) {
			logger.debug( `${ block.name } has the following Schema definition`, definition );
		}

		if ( shouldRenderSchema( definition, parentHasSchema ) ) {
			renderSchema( block, definition );
			if ( Array.isArray( block.innerBlocks ) ) {
				generateSchemaForBlocks( block.innerBlocks, validations, previousBlock ? previousBlock.innerBlocks : [], true );
			}
			continue;
		}
		if ( Array.isArray( block.innerBlocks ) ) {
			generateSchemaForBlocks( block.innerBlocks, validations, previousBlock ? previousBlock.innerBlocks : [], parentHasSchema );
		}
	}
}

/**
 * Validates blocks recursively.
 *
 * @param blocks The block instances to validate.
 *
 * @returns Validation results for each (inner)block of the given blocks.
 */
export function validateBlocks( blocks: BlockInstance[] ): BlockValidationResult[] {
	const validations: BlockValidationResult[] = [];
	blocks.forEach( block => {
		// This may be a third party block we cannot validate.
		const definition = getBlockDefinition( block.name );
		if ( definition ) {
			validations.push( definition.validate( block ) );
		} else {
			logger.warning( "Unable to validate block of type [" + block.name + "] " + block.clientId );
			validations.push( new BlockValidationResult( block.clientId, block.name, BlockValidation.Unknown, BlockPresence.Unknown ) );

			// Recursively validate all blocks' innerblocks.
			if ( block.innerBlocks && block.innerBlocks.length > 0 ) {
				validations.push( ...validateBlocks( block.innerBlocks ) );
			}
		}
	} );
	return validations;
}

/**
 * Determines the Schema root to use when building up the Schema
 * for this page.
 *
 * @param rootBlocks The blocks at the root of the post.
 */
function determineSchemaRoot( rootBlocks: BlockInstance[] ) {
	for ( const block of rootBlocks ) {
		const definition = schemaDefinitions[ block.name ];

		if ( definition ) {
			const instructions = Object.values( definition.instructions );
			const schemaInstruction: Schema = instructions.find( instruction => instruction instanceof Schema );

			const { requiredFor, recommendedFor, name } = schemaInstruction.options;

			logger.debug( `${ name } is required for ${ requiredFor }` );
			logger.debug( `${ name } is recommended for ${ recommendedFor }` );
		}
	}
}

/**
 * Watches Gutenberg for relevant changes.
 */
export default function watch(): void {
	subscribe(
		debounce( () => {
			if ( updatingSchema ) {
				return;
			}

			const rootBlocks: BlockInstance[] = select( "core/block-editor" ).getBlocks();

			if ( rootBlocks === previousRootBlocks ) {
				return;
			}

			determineSchemaRoot( rootBlocks );

			updatingSchema = true;
			{
				const validationsForExistingBlocks = validateBlocks( rootBlocks );
				const validationsForMissingBlocks = missingBlocks( rootBlocks );

				const validations = [
					...validationsForExistingBlocks,
					...validationsForMissingBlocks,
				];

				storeBlockValidation( validations );

				warningWatcher( rootBlocks, previousRootBlocks );

				generateSchemaForBlocks( rootBlocks, validations, previousRootBlocks );

				previousRootBlocks = rootBlocks;
			}
			updatingSchema = false;
		}, 250, { trailing: true } ),
	);
}
