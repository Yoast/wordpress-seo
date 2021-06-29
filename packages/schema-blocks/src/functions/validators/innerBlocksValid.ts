import { BlockInstance } from "@wordpress/blocks";
import { getBlockDefinition } from "../../core/blocks/BlockDefinitionRepository";
import {
	BlockValidation,
	BlockValidationResult,
	RecommendedBlock,
	RequiredBlock,
} from "../../core/validation";
import recurseOverBlocks from "../blocks/recurseOverBlocks";
import { getInnerblocksByName } from "../innerBlocksHelper";
import logger from "../logger";
import { BlockPresence } from "../../core/validation/BlockValidationResult";
import { getHumanReadableBlockName } from "../BlockHelper";

/**
 * Finds all blocks that should/could be in the inner blocks, but aren't.
 *
 * @param existingBlocks The actual array of all inner blocks.
 * @param wantedBlocks   All of the blocks that should occur (required), or could occur (recommended) in the inner blocks.
 * @param blockPresence  The block presence.
 *
 * @returns {BlockValidationResult[]} The names of blocks that should/could occur but don't, with reason 'MissingBlock'.
 */
function findMissingBlocks(
	existingBlocks: BlockInstance[],
	wantedBlocks: RequiredBlock[] | RecommendedBlock[],
	blockPresence: BlockPresence ): BlockValidationResult[] {
	const missingBlocks = wantedBlocks.filter( block => {
		// If, in the existing blocks, there are not any blocks with the name of block, that block is missing.
		return ! existingBlocks.some( existingBlock => existingBlock.name === block.name );
	} );

	// These blocks should've existed, but they don't.
	return missingBlocks.map( missingBlock =>
		BlockValidationResult.MissingBlock( getHumanReadableBlockName( missingBlock.name ), blockPresence ),
	);
}

/**
 * Finds all blocks that have found themselves invalid.
 *
 * @param blockInstance  The block whose InnerBlocks are validated.
 * @param requiredBlocks Requirements of the blocks that should occur in the inner blocks.
 *
 * @returns {BlockValidationResult[]} The array of blocks that have invalidated themselves.
 */
function validateInnerblockTree( blockInstance: BlockInstance ): BlockValidationResult[] {
	const validations: BlockValidationResult[] = [];

	// An innerblock is only valid if all its innerblocks are valid.
	recurseOverBlocks( blockInstance.innerBlocks, ( block: BlockInstance ) => {
		const definition = getBlockDefinition( block.name );
		if ( definition ) {
			validations.push( definition.validate( block ) );
		} else {
			logger.warning( "Block definition for '" + block.name + "' is not registered." );
			validations.push( new BlockValidationResult( block.clientId, block.name, BlockValidation.Unknown, BlockPresence.Unknown ) );
		}
	} );
	return validations;
}

/**
 * Validates all inner blocks recursively and returns all invalid blocks.
 *
 * @param blockInstance     The block whose inner blocks need to be validated.
 * @param requiredBlocks    The inner blocks that are required.
 * @param recommendedBlocks The inner blocks that are recommended.
 *
 * @returns {BlockValidationResult[]} The names and reasons of the inner blocks that are invalid.
 */
function validateInnerBlocks( blockInstance: BlockInstance, requiredBlocks: RequiredBlock[] = [],
							  recommendedBlocks: RecommendedBlock[] = [] ): BlockValidationResult[] {
	const requiredBlockKeys = requiredBlocks.map( rblock => rblock.name );
	const recommendedBlockKeys = recommendedBlocks.map( rblock => rblock.name );

	const validationResults: BlockValidationResult[] = [];

	// Find all instances of required block types.
	const existingRequiredBlocks = getInnerblocksByName( blockInstance, requiredBlockKeys );

	// Find all required block types that do not occur in existingRequiredBlocks.
	validationResults.push( ...findMissingBlocks( existingRequiredBlocks, requiredBlocks, BlockPresence.Required ) );

	// Find all instances of recommended block types.
	const existingRecommendedBlocks = getInnerblocksByName( blockInstance, recommendedBlockKeys );

	// Find all recommended block types that do not occur in existingRecommendedBlocks.
	validationResults.push( ...findMissingBlocks( existingRecommendedBlocks, recommendedBlocks, BlockPresence.Recommended ) );

	// Let all innerblocks validate themselves.
	// We differentiate between blocks that are internally valid but are not valid in the context of the innerblock.
	const innerValidations = validateInnerblockTree( blockInstance );
	validationResults.push( ...innerValidations );

	return validationResults;
}

export default validateInnerBlocks;
export { findMissingBlocks, validateInnerblockTree };
