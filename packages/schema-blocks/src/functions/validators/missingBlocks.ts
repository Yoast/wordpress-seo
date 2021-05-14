import { BlockInstance } from "@wordpress/blocks";
import { select } from "@wordpress/data";
import { BlockPresence, BlockValidationResult } from "../../core/validation";
import { mapBlocksRecursively } from "../innerBlocksHelper";
import { YOAST_SCHEMA_BLOCKS_STORE_NAME } from "../redux";

/**
 * Finds all the missing required blocks and creates a validation result for each missing block.
 *
 * @param blockNames The list of current blocks in the post.
 *
 * @returns An array of validation results, one for each missing required block.
 */
function missingRequiredBlocks( blockNames: string[] ) {
	const requiredBlockNames: string[] = select( YOAST_SCHEMA_BLOCKS_STORE_NAME ).getRequiredBlockNames();

	return requiredBlockNames
		.filter( name => ! blockNames.includes( name ) )
		.map( name => BlockValidationResult.MissingBlock(
			name,
			BlockPresence.Required,
		) );
}

/**
 * Finds all the missing recommended blocks and creates a validation result for each missing block.
 *
 * @param blockNames The list of current blocks in the post.
 *
 * @returns An array of validation results, one for each missing recommended block.
 */
function missingRecommendedBlocks( blockNames: string[] ): BlockValidationResult[] {
	const recommendedBlockNames: string[] = select( YOAST_SCHEMA_BLOCKS_STORE_NAME ).getRecommendedBlockNames();

	return recommendedBlockNames
		.filter( name => ! blockNames.includes( name ) )
		.map( name => BlockValidationResult.MissingBlock(
			name,
			BlockPresence.Recommended,
		) );
}

/**
 * Finds all the missing required and recommended blocks and
 * creates a validation result for each missing block.
 *
 * @param currentBlocks The current blocks in the post.
 *
 * @returns An array of validation results, one for each missing required or recommended block.
 */
export function missingBlocks( currentBlocks: BlockInstance[] ): BlockValidationResult[] {
	const blockNames = mapBlocksRecursively( currentBlocks, block => block.name );

	return [
		...missingRequiredBlocks( blockNames ),
		...missingRecommendedBlocks( blockNames ),
	];
}
