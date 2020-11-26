import { BlockInstance } from "@wordpress/blocks";
import { countBy } from "lodash";
import { RequiredBlockOption, InvalidBlockReason } from "../../instructions/blocks/enums";
import { RequiredBlock, InvalidBlock } from "../../instructions/blocks/dto";
import { getInnerBlocks, getInnerblocksByName } from "../innerBlocksHelper";

/**
 * Finds all blocks that should be in the inner blocks, but aren't.
 *
 * @param requiredBlocks         All of the blocks that should occur in the inner blocks.
 * @param existingRequiredBlocks The actual array of all inner blocks.
 *
 * @returns {InvalidBlock[]} The names of blocks that should occur but don't, with reason 'missing'.
 */
function findMissingBlocks( requiredBlocks: RequiredBlock[], existingRequiredBlocks: BlockInstance[] ): InvalidBlock[] {
	const missingRequiredBlocks = requiredBlocks.filter( requiredBlock => {
		// If there are some (at least one) blocks with the name of a required block, that required block is NOT missing.
		return ! existingRequiredBlocks.some( block => block.name === requiredBlock.name );
	} );

	const invalidBlocks: InvalidBlock[] = [];
	missingRequiredBlocks.forEach( missingBlock => {
		// These blocks should've existed, but they don't.
		invalidBlocks.push( createInvalidBlock( missingBlock.name, InvalidBlockReason.Missing ) );
	} );

	return invalidBlocks;
}

/**
 * Finds all blocks that occur more than once in the inner blocks.
 *
 * @param requiredBlocks         Requirements of the blocks that should occur only once in the inner blocks.
 * @param existingRequiredBlocks The actual array of all inner blocks.
 *
 * @returns {InvalidBlock[]} The names of blocks that occur more than once in the inner blocks with reason 'TooMany'.
 */
function findRedundantBlocks( requiredBlocks: RequiredBlock[], existingRequiredBlocks: BlockInstance[] ): InvalidBlock[] {
	const onlyOneAllowed: string[] = [];
	const invalidBlocks: InvalidBlock[] = [];

	requiredBlocks
		.filter( block => block.option === RequiredBlockOption.One )
		.forEach( block => onlyOneAllowed.push( block.name ) );
	if ( onlyOneAllowed ) {
		// Count the occurrences of each block so we can find all keys that have too many occurrences.
		const countPerBlockType = countBy( existingRequiredBlocks, block => block.name );
		for ( const blockName in countPerBlockType ) {
			if ( countPerBlockType[ blockName ] > 1 ) {
				invalidBlocks.push( createInvalidBlock( blockName, InvalidBlockReason.TooMany ) );
			}
		}
	}
	return invalidBlocks;
}

/**
 * Finds all blocks that have found themselves invalid.
 *
 * @param requiredBlocks Requirements of the blocks that should occur in the inner blocks.
 * @param blocks         The blocks to validate.
 *
 * @returns {InvalidBlock[]} The array of blocks that have invalidated themselves.
 */
function validateBlocks( requiredBlocks: RequiredBlock[], blocks: BlockInstance[] ): InvalidBlock[] {
	const invalidBlocks: InvalidBlock[] = [];
	blocks.forEach( block => {
		if ( ! block.isValid ) {
			const isRequired: boolean = requiredBlocks.some( requiredBlock => requiredBlock.name === block.name );
			const reason: InvalidBlockReason = isRequired ? InvalidBlockReason.Internal : InvalidBlockReason.Optional;

			invalidBlocks.push( createInvalidBlock( block.name, reason ) );
		}
	} );
	return invalidBlocks;
}

/**
 * Validates all inner blocks recursively and returns all invalid blocks.
 *
 * @param requiredBlocks Requirements of the blocks that should occur in the inner blocks.
 * @param clientId       The clientId of the block whose inner blocks need to be validated.
 *
 * @returns {InvalidBlock[]} The names and reasons of the inner block that are invalid.
 */
function getInvalidInnerBlocks( requiredBlocks: RequiredBlock[], clientId: string ): InvalidBlock[]  {
	const invalidBlocks: InvalidBlock[] = [];

	const innerBlocks = getInnerBlocks( clientId );
	const requiredBlockKeys = Object.keys( requiredBlocks );

	// Find all instances of required block types.
	const existingRequiredBlocks = getInnerblocksByName( requiredBlockKeys, innerBlocks );

	// Find all block types that do not occur in existingBlocks.
	invalidBlocks.push( ...findMissingBlocks( requiredBlocks, existingRequiredBlocks ) );

	// Find all block types that allow only one occurrence.
	invalidBlocks.push( ...findRedundantBlocks( requiredBlocks, existingRequiredBlocks ) );

	// Find all blocks that have decided for themselves that they're invalid.
	invalidBlocks.push( ...validateBlocks( requiredBlocks, innerBlocks ) );

	return invalidBlocks;
}

/**
 * Helper function to create an invalid block.
 *
 * @param type   The block name.
 * @param reason The reason this block is invalid.
 *
 * @returns {InvalidBlock} The invalid block.
 */
function createInvalidBlock( type: string, reason: InvalidBlockReason ): InvalidBlock {
	return {
		name: type,
		reason,
	} as InvalidBlock;
}

export default getInvalidInnerBlocks;
export { findMissingBlocks, findRedundantBlocks, validateBlocks as findSelfInvalidatedBlocks, createInvalidBlock };
