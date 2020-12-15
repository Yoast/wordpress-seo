import { BlockInstance } from "@wordpress/blocks";
import { countBy } from "lodash";
import { getBlockDefinition } from "../../core/blocks/BlockDefinitionRepository";
import { RequiredBlockOption, InvalidBlockReason } from "../../instructions/blocks/enums";
import { RequiredBlock, InvalidBlock } from "../../instructions/blocks/dto";
import { getInnerblocksByName } from "../innerBlocksHelper";

/**
 * Finds all blocks that should be in the inner blocks, but aren't.
 *
 * @param existingRequiredBlocks The actual array of all inner blocks.
 * @param requiredBlocks         All of the blocks that should occur in the inner blocks.
 *
 * @returns {InvalidBlock[]} The names of blocks that should occur but don't, with reason 'missing'.
 */
function findMissingBlocks( existingRequiredBlocks: BlockInstance[], requiredBlocks: RequiredBlock[] ): InvalidBlock[] {
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
 * @param existingRequiredBlocks The actual array of all inner blocks.
 * @param requiredBlocks         Requirements of the blocks that should occur only once in the inner blocks.
 *
 * @returns {InvalidBlock[]} The names of blocks that occur more than once in the inner blocks with reason 'TooMany'.
 */
function findRedundantBlocks( existingRequiredBlocks: BlockInstance[], requiredBlocks: RequiredBlock[] ): InvalidBlock[] {
	const invalidBlocks: InvalidBlock[] = [];

	const onlyOneAllowed = requiredBlocks.filter( block => block.option === RequiredBlockOption.One );

	if ( onlyOneAllowed.length > 0 ) {
		// Count the occurrences of each block so we can find all keys that have too many occurrences.
		const countPerBlockType = countBy( existingRequiredBlocks, ( block: BlockInstance ) => block.name );
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
 * @param blockInstance  The block whose InnerBlocks are validated.
 * @param requiredBlocks Requirements of the blocks that should occur in the inner blocks.
 *
 * @returns {InvalidBlock[]} The array of blocks that have invalidated themselves.
 */
function findSelfInvalidatedBlocks( blockInstance: BlockInstance, requiredBlocks: RequiredBlock[] ): InvalidBlock[] {
	const invalidBlocks: InvalidBlock[] = [];

	blockInstance.innerBlocks.forEach( block => {
		// E.g. JobTitleDefinition
		const definition = getBlockDefinition( block.name );
		if ( ! definition ) {
			throw new Error( "Block definition for '" + block.name + "' is not registered." );
		}
		if ( ! definition.valid( block ) ) {
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
 * @param blockInstance  The block whose inner blocks need to be validated.
 * @param requiredBlocks Requirements of the blocks that should occur in the inner blocks.
 *
 * @returns {InvalidBlock[]} The names and reasons of the inner block that are invalid.
 */
function getInvalidInnerBlocks( blockInstance: BlockInstance, requiredBlocks: RequiredBlock[] ): InvalidBlock[]  {
	const requiredBlockKeys = requiredBlocks.map( rblock => rblock.name );
	const invalidBlocks: InvalidBlock[] = [];

	// Find all instances of required block types.
	const existingRequiredBlocks = getInnerblocksByName( blockInstance, requiredBlockKeys );

	// Find all block types that do not occur in existingBlocks.
	invalidBlocks.push( ...findMissingBlocks( existingRequiredBlocks, requiredBlocks ) );

	// Find all block types that allow only one occurrence.
	invalidBlocks.push( ...findRedundantBlocks( existingRequiredBlocks, requiredBlocks ) );

	// Find all blocks that have decided for themselves that they're invalid.
	invalidBlocks.push( ...findSelfInvalidatedBlocks( blockInstance, requiredBlocks ) );

	return invalidBlocks;
}

/**
 * Helper function to create an invalid block.
 *
 * @param name   The block name.
 * @param reason The reason this block is invalid.
 *
 * @returns {InvalidBlock} The invalid block.
 */
function createInvalidBlock( name: string, reason: InvalidBlockReason ): InvalidBlock {
	const block: InvalidBlock = {
		name,
		reason,
	};
	return block;
}

/**
 * Helper function to determine the urgency of an invalidation.
 *
 * @param reason The reason to check.
 *
 * @returns {boolean} True if the invalidation is for an optional block (a warning), false if the invalidation is for a required block (an error).
 */
function isOptional( reason: InvalidBlockReason ): boolean {
	switch ( reason ) {
		case InvalidBlockReason.Optional: return true;
		default: return false;
	}
}

export default getInvalidInnerBlocks;
export { findMissingBlocks, findRedundantBlocks, findSelfInvalidatedBlocks, createInvalidBlock, isOptional };
