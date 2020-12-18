import { BlockInstance } from "@wordpress/blocks";
import { countBy } from "lodash";
import { getBlockDefinition } from "../../core/blocks/BlockDefinitionRepository";
import { RequiredBlockOption, BlockValidation, RequiredBlock, BlockValidationResult } from "../../core/validation";
import { getInnerblocksByName } from "../innerBlocksHelper";

/**
 * Finds all blocks that should be in the inner blocks, but aren't.
 *
 * @param existingRequiredBlocks The actual array of all inner blocks.
 * @param requiredBlocks         All of the blocks that should occur in the inner blocks.
 *
 * @returns {BlockValidationResult[]} The names of blocks that should occur but don't, with reason 'missing'.
 */
function findMissingBlocks( existingRequiredBlocks: BlockInstance[], requiredBlocks: RequiredBlock[] ): BlockValidationResult[] {
	const missingRequiredBlocks = requiredBlocks.filter( requiredBlock => {
		// If there are some (at least one) blocks with the name of a required block, that required block is NOT missing.
		return ! existingRequiredBlocks.some( block => block.name === requiredBlock.name );
	} );

	const BlockValidationResults: BlockValidationResult[] = [];
	missingRequiredBlocks.forEach( missingBlock => {
		// These blocks should've existed, but they don't.
		BlockValidationResults.push( new BlockValidationResult( missingBlock.name, BlockValidation.Missing ) );
	} );

	return BlockValidationResults;
}

/**
 * Finds all blocks that occur more than once in the inner blocks.
 *
 * @param existingRequiredBlocks The actual array of all inner blocks.
 * @param requiredBlocks         Requirements of the blocks that should occur only once in the inner blocks.
 *
 * @returns {BlockValidationResult[]} The names of blocks that occur more than once in the inner blocks with reason 'TooMany'.
 */
function findRedundantBlocks( existingRequiredBlocks: BlockInstance[], requiredBlocks: RequiredBlock[] ): BlockValidationResult[] {
	const BlockValidationResults: BlockValidationResult[] = [];

	const onlyOneAllowed = requiredBlocks.filter( block => block.option === RequiredBlockOption.One );

	if ( onlyOneAllowed.length > 0 ) {
		// Count the occurrences of each block so we can find all keys that have too many occurrences.
		const countPerBlockType = countBy( existingRequiredBlocks, ( block: BlockInstance ) => block.name );
		for ( const blockName in countPerBlockType ) {
			if ( countPerBlockType[ blockName ] > 1 ) {
				BlockValidationResults.push( new BlockValidationResult( blockName, BlockValidation.TooMany ) );
			}
		}
	}
	return BlockValidationResults;
}

/**
 * Finds all blocks that have found themselves invalid.
 *
 * @param blockInstance  The block whose InnerBlocks are validated.
 * @param requiredBlocks Requirements of the blocks that should occur in the inner blocks.
 *
 * @returns {BlockValidationResult[]} The array of blocks that have invalidated themselves.
 */
function findSelfInvalidatedBlocks( blockInstance: BlockInstance ): BlockValidationResult[] {
	const validations: BlockValidationResult[] = [];

	blockInstance.innerBlocks.forEach( block => {
		// E.g. JobTitleDefinition
		const definition = getBlockDefinition( block.name );
		if ( definition ) {
			validations.push( ...definition.validate( block ) );
		} else {
			// This needs to be removed before releasing, P2.
			console.log( "Block definition for '" + block.name + "' is not registered." );
			if ( block.innerBlocks ) {
				block.innerBlocks.forEach( innerBlock => validations.push( ...findSelfInvalidatedBlocks( innerBlock ) ) );
			}
		}
	} );
	return validations;
}

/**
 * Validates all inner blocks recursively and returns all invalid blocks.
 *
 * @param blockInstance  The block whose inner blocks need to be validated.
 * @param requiredBlocks Requirements of the blocks that should occur in the inner blocks.
 *
 * @returns {BlockValidationResult[]} The names and reasons of the inner blocks that are invalid.
 */
function getInvalidInnerBlocks( blockInstance: BlockInstance, requiredBlocks: RequiredBlock[] ): BlockValidationResult[]  {
	const requiredBlockKeys = requiredBlocks.map( rblock => rblock.name );
	const validationResults: BlockValidationResult[] = [];

	// Find all instances of required block types.
	const existingRequiredBlocks = getInnerblocksByName( blockInstance, requiredBlockKeys );

	// Find all block types that do not occur in existingBlocks.
	validationResults.push( ...findMissingBlocks( existingRequiredBlocks, requiredBlocks ) );

	// Find all block types that allow only one occurrence.
	validationResults.push( ...findRedundantBlocks( existingRequiredBlocks, requiredBlocks ) );

	// Find all blocks that have decided for themselves that they're invalid.
	validationResults.push( ...findSelfInvalidatedBlocks( blockInstance ) );

	return validationResults;
}

/**
 * Helper function to determine the urgency of an invalidation.
 *
 * @param reason The reason to check.
 *
 * @returns {boolean} True if the invalidation is for an optional block (a warning), false if the invalidation is for a required block (an error).
 */
function isOptional( reason: BlockValidation ): boolean {
	switch ( reason ) {
		case BlockValidation.Optional: return true;
		default: return false;
	}
}

export default getInvalidInnerBlocks;
export { findMissingBlocks, findRedundantBlocks, findSelfInvalidatedBlocks, isOptional };
