import { dispatch } from "@wordpress/data";

import { BlockInstance, createBlock } from "@wordpress/blocks";
import { getBlockDefinition } from "../../../core/blocks/BlockDefinitionRepository";
import InnerBlocks from "../../../instructions/blocks/InnerBlocks";
import recurseOverBlocks from "../../blocks/recurseOverBlocks";
import BlockDefinition from "../../../core/blocks/BlockDefinition";

/**
 * Maps the given callback function over all the blocks (including all innerBlocks) and returns the results as a flat array.
 *
 * @param blocks The blocks.
 * @param callback The callback function.
 *
 * @returns The transformed blocks, in a flat array.
 */
function mapRecursively( blocks: BlockInstance[], callback: ( block: BlockInstance ) => unknown ): unknown[] {
	const result: unknown[] = [];
	recurseOverBlocks( blocks, ( block: BlockInstance ) => {
		// eslint-disable-next-line callback-return
		result.push( callback( block ) );
	} );
	return result;
}

/**
 * Gets the inner blocks instruction of the block definition with the given name.
 *
 * Returns `null` if no block definition with this name exists.
 *
 * @param blockName The name of the block definition.
 *
 * @returns The inner blocks instruction if it exists, `null` if not.
 */
function getInnerBlocksInstruction( blockName: string ): InnerBlocks | null {
	const blockDefinition: BlockDefinition = getBlockDefinition( blockName );

	if ( ! blockDefinition ) {
		return null;
	}

	return Object.values( blockDefinition.instructions )
		.find( instruction => instruction instanceof InnerBlocks ) as InnerBlocks;
}

/**
 * Creates a warning block.
 *
 * @param innerBlock The inner block that has been removed.
 * @param message The message that should be shown in the warning.
 * @param isRequired If the removed block was a required block.
 *
 * @returns The warning block.
 */
function createWarning( innerBlock: BlockInstance, message: string, isRequired = true ): BlockInstance {
	if ( ! message ) {
		message = `You've just removed the ‘${ innerBlock.attributes.title }’ block,
						but this is a required block for Schema output.
						Without this block no Schema will be generated. Do you want this?`;
	}

	const attributes = {
		removedBlock: innerBlock.name,
		removedAttributes: innerBlock.attributes,
		isRequired,
		warningText: message,
	};

	return createBlock( "yoast/warning-block", attributes );
}

/**
 * Compares the current list of blocks with the previous list of blocks and
 * checks whether any were removed. If a required or recommended block was removed,
 * a warning block is added in its place.
 *
 * @param blocks The current list of blocks.
 * @param previousBlocks The previous list of blocks.
 */
export default function warningWatcher( blocks: BlockInstance[], previousBlocks: BlockInstance[] = [] ): void {
	const currentBlockIds = mapRecursively( blocks, block => block.clientId );

	recurseOverBlocks( previousBlocks, ( block: BlockInstance ) => {
		if ( ! block.innerBlocks ) {
			return;
		}

		const removedInnerBlocks = block.innerBlocks
			.filter( innerBlock => ! currentBlockIds.includes( innerBlock.clientId ) );

		if ( removedInnerBlocks.length === 0 ) {
			return;
		}

		const innerBlocksInstruction: InnerBlocks = getInnerBlocksInstruction( block.name );

		if ( ! innerBlocksInstruction ) {
			return;
		}

		const requiredBlocks = innerBlocksInstruction.options.requiredBlocks;

		if ( ! requiredBlocks ) {
			return;
		}

		const removedRequiredInnerBlocks = removedInnerBlocks
			.filter( innerBlock => requiredBlocks.some( requiredBlock => innerBlock.name === requiredBlock.name ) );

		removedRequiredInnerBlocks.forEach( ( innerBlock ) => {
			const index = block.innerBlocks.findIndex( aBlock => aBlock.clientId === innerBlock.clientId );
			const message = innerBlocksInstruction.options.warnings[ block.clientId ] as string;
			const warning = createWarning( innerBlock, message );
			dispatch( "core/block-editor" ).insertBlock( warning, index, block.clientId );
		} );
	} );
}
