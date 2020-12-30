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
 * Adds a warning block to the block with the given ID at the given place.
 *
 * @param attributes The attributes of the warning block.
 * @param index The index of the parent's innerBlocks at which the place the warning.
 * @param parentBlockClientId The client ID of the parent.
 */
function addWarning( attributes: Record<string, unknown>, index: number, parentBlockClientId: string ): void {
	const warning = createBlock( "yoast/warning-block", attributes );
	dispatch( "core/block-editor" ).insertBlock( warning, index, parentBlockClientId );
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

		const innerBlocksInstruction: InnerBlocks = getInnerBlocksInstruction( block.name );

		if ( ! innerBlocksInstruction ) {
			return;
		}

		const requiredBlocks = innerBlocksInstruction.options.requiredBlocks;

		block.innerBlocks.forEach( ( innerBlock, index ) => {
			if ( currentBlockIds.includes( innerBlock.clientId ) ) {
				return;
			}

			const isRequired = requiredBlocks.some( requiredBlock => innerBlock.name === requiredBlock.name );

			if ( isRequired ) {
				const attributes = {
					removedBlock: innerBlock.name,
					removedAttributes: innerBlock.attributes,
					isRequired,
					warningText: "Oh no! You are bad!",
				};

				addWarning( attributes, index, block.clientId );
			}
		} );
	} );
}
