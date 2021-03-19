import { BlockInstance } from "@wordpress/blocks";
import { countBy } from "lodash";
import { getBlockDefinition } from "../../core/blocks/BlockDefinitionRepository";
import {
	RequiredBlockOption,
	BlockValidation,
	RequiredBlock,
	BlockValidationResult,
	RecommendedBlock,
} from "../../core/validation";
import recurseOverBlocks from "../blocks/recurseOverBlocks";
import { getInnerblocksByName } from "../innerBlocksHelper";
import logger from "../logger";
import isValidResult from "./isValidResult";

/**
 * Finds all blocks that should be in the inner blocks, but aren't.
 *
 * @param existingRequiredBlocks The actual array of all inner blocks.
 * @param requiredBlocks         All of the blocks that should occur in the inner blocks.
 *
 * @returns {BlockValidationResult[]} The names of blocks that should occur but don't, with reason 'MissingBlock'.
 */
function findMissingBlocks( existingRequiredBlocks: BlockInstance[], requiredBlocks: RequiredBlock[] ): BlockValidationResult[] {
	const missingRequiredBlocks = requiredBlocks.filter( requiredBlock => {
		// If there are not any blocks with the name of a required block, that required block is missing.
		return ! existingRequiredBlocks.some( block => block.name === requiredBlock.name );
	} );

	// These blocks should've existed, but they don't.
	return missingRequiredBlocks.map( missingBlock =>
		new BlockValidationResult( null, missingBlock.name, BlockValidation.MissingBlock ) );
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
	const validationResults: BlockValidationResult[] = [];
	const singletons = requiredBlocks.filter( block => block.option === RequiredBlockOption.One );

	if ( singletons.length > 0 ) {
		// Count the occurrences of each block so we can find all keys that have too many occurrences.
		const existingSingletons = existingRequiredBlocks.filter( block => singletons.some( s => s.name === block.name ) );
		const countPerBlockType = countBy( existingSingletons, ( block: BlockInstance ) => block.name );

		for ( const blockName in countPerBlockType ) {
			if ( countPerBlockType[ blockName ] < 2 ) {
				continue;
			}

			existingSingletons.forEach( ( block: BlockInstance ) => {
				if ( block.name === blockName ) {
					validationResults.push( new BlockValidationResult( block.clientId, blockName, BlockValidation.TooMany ) );
				}
			} );
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
function validateInnerblockTree( blockInstance: BlockInstance ): BlockValidationResult[] {
	const validations: BlockValidationResult[] = [];

	// An innerblock is only valid if all its innerblocks are valid.
	recurseOverBlocks( blockInstance.innerBlocks, ( block: BlockInstance ) => {
		const definition = getBlockDefinition( block.name );
		if ( definition ) {
			validations.push( definition.validate( block ) );
		} else {
			logger.warning( "Block definition for '" + block.name + "' is not registered." );
			validations.push( new BlockValidationResult( block.clientId, block.name, BlockValidation.Unknown ) );
		}
	} );
	return validations;
}

/**
 * Validates all inner blocks recursively and returns all invalid blocks.
 *
 * @param blockInstance  The block whose inner blocks need to be validated.
 * @param requiredBlocks Requirements of the blocks that should occur in the inner blocks.
 * @param recommendedBlocks
 *
 * @returns {BlockValidationResult[]} The names and reasons of the inner blocks that are invalid.
 */
function validateInnerBlocks( blockInstance: BlockInstance, requiredBlocks: RequiredBlock[] = [], recommendedBlocks: RecommendedBlock[] = [] ): BlockValidationResult[]  {
	const requiredBlockKeys = requiredBlocks.map( rblock => rblock.name );
	const recommendedBlockKeys = recommendedBlocks.map( rblock => rblock.name );

	let validationResults: BlockValidationResult[] = [];

	// Find all instances of required block types.
	const existingRequiredBlocks = getInnerblocksByName( blockInstance, requiredBlockKeys );

	// Find all required block types that do not occur in existingBlocks.
	validationResults.push( ...findMissingBlocks( existingRequiredBlocks, requiredBlocks ) );

	// Find all required block types that allow only one occurrence.
	validationResults.push( ...findRedundantBlocks( existingRequiredBlocks, requiredBlocks ) );

	// Find all instances of recommended block types.
	const existingRecommendedBlocks = getInnerblocksByName( blockInstance, recommendedBlockKeys );

	// Find all required block types that do not occur in existingBlocks.
	validationResults.push( ...findMissingBlocks( existingRecommendedBlocks, recommendedBlocks ) );

	// Let all innerblocks validate themselves.
	// We differentiate between blocks that are internally valid but are not valid in the context of the innerblock.
	const innerValidations = validateInnerblockTree( blockInstance );
	validationResults.push( ...innerValidations );

	validationResults = validationResults.filter( result =>
		! ( isValidResult( result.result ) &&
		validationResults.some( also => also.clientId === result.clientId && ! isValidResult( also.result ) ) ) );

	return validationResults;
}

export default validateInnerBlocks;
export { findMissingBlocks, findRedundantBlocks, validateInnerblockTree };
