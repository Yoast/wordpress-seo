import { BlockInstance } from "@wordpress/blocks";
import { countBy } from "lodash";
import { getBlockDefinition } from "../../core/blocks/BlockDefinitionRepository";
import { RequiredBlockOption, BlockValidation, RequiredBlock, BlockValidationResult } from "../../core/validation";
import recurseOverBlocks from "../blocks/recurseOverBlocks";
import { getInnerblocksByName } from "../innerBlocksHelper";

/**
 * Finds all blocks that should be in the inner blocks, but aren't.
 *
 * @param parentId               The innerblocks' parent clientId.
 * @param existingRequiredBlocks The actual array of all inner blocks.
 * @param requiredBlocks         All of the blocks that should occur in the inner blocks.
 *
 * @returns {BlockValidationResult[]} The names of blocks that should occur but don't, with reason 'missing'.
 */
function findMissingBlocks( parentId: string, existingRequiredBlocks: BlockInstance[], requiredBlocks: RequiredBlock[] ): BlockValidationResult[] {
	const missingRequiredBlocks = requiredBlocks.filter( requiredBlock => {
		// If there are not any blocks with the name of a required block, that required block is missing.
		return ! existingRequiredBlocks.some( block => block.name === requiredBlock.name );
	} );

	// These blocks should've existed, but they don't.
	const validationResults: BlockValidationResult[] = missingRequiredBlocks.map( missingBlock =>
		new BlockValidationResult( parentId, missingBlock.name, BlockValidation.Missing ) );

	return validationResults;
}

/**
 * Finds all blocks that occur more than once in the inner blocks.
 *
 * @param parentId               The innerblocks' parent clientId.
 * @param existingRequiredBlocks The actual array of all inner blocks.
 * @param requiredBlocks         Requirements of the blocks that should occur only once in the inner blocks.
 *
 * @returns {BlockValidationResult[]} The names of blocks that occur more than once in the inner blocks with reason 'TooMany'.
 */
function findRedundantBlocks( parentId: string, existingRequiredBlocks: BlockInstance[], requiredBlocks: RequiredBlock[] ): BlockValidationResult[] {
	const validationResults: BlockValidationResult[] = [];
	const onlyOneAllowed = requiredBlocks.filter( block => block.option === RequiredBlockOption.One );

	if ( onlyOneAllowed.length > 0 ) {
		// Count the occurrences of each block so we can find all keys that have too many occurrences.
		const relevantBlockNames = existingRequiredBlocks.filter( block => onlyOneAllowed.some( ooa => ooa.name === block.name ) );
		const countPerBlockType = countBy( relevantBlockNames, ( block: BlockInstance ) => block.name );

		for ( const blockName in countPerBlockType ) {
			if ( countPerBlockType[ blockName ] > 1 ) {
				validationResults.push( new BlockValidationResult( parentId, blockName, BlockValidation.TooMany ) );
			}
		}
	}
	return validationResults;
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

	// An innerblock is only valid if all its innerblocks are valid.
	recurseOverBlocks( blockInstance.innerBlocks, ( block: BlockInstance ) => {
		const definition = getBlockDefinition( block.name );
		if ( definition ) {
			validations.push( ...definition.validate( block ) );
		} else {
			// eslint-disable-next-line no-console
			console.log( "Block definition for '" + block.name + "' is not registered." );
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
function validateInnerBlocks( blockInstance: BlockInstance, requiredBlocks: RequiredBlock[] = [] ): BlockValidationResult[]  {
	const requiredBlockKeys = requiredBlocks.map( rblock => rblock.name );
	const validationResults: BlockValidationResult[] = [];

	// Find all instances of required block types.
	const existingRequiredBlocks = getInnerblocksByName( blockInstance, requiredBlockKeys );

	// Find all block types that do not occur in existingBlocks.
	validationResults.push( ...findMissingBlocks( blockInstance.clientId, existingRequiredBlocks, requiredBlocks ) );

	// Find all block types that allow only one occurrence.
	validationResults.push( ...findRedundantBlocks( blockInstance.clientId, existingRequiredBlocks, requiredBlocks ) );

	// Find all blocks that have decided for themselves that they're invalid.
	validationResults.push( ...findSelfInvalidatedBlocks( blockInstance ) );

	return validationResults;
}

export default validateInnerBlocks;
export { findMissingBlocks, findRedundantBlocks, findSelfInvalidatedBlocks };
