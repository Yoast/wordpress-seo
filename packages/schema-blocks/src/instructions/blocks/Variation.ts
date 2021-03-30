import { BlockInstance } from "@wordpress/blocks";
import BlockInstruction from "../../core/blocks/BlockInstruction";
import { BlockValidation, BlockValidationResult } from "../../core/validation";
import { BlockPresence } from "../../core/validation/BlockValidationResult";
import validateInnerBlocks from "../../functions/validators/innerBlocksValid";
import validateMany from "../../functions/validators/validateMany";
import { ExtendedBlockConfiguration } from "../../type-adapters/ExtendedBlockConfiguration";

export interface VariationInterface {
	name: string;
	title: string;
	isDefault?: boolean;
	scope?: string[];
	icon?: string;
}

/**
 * Variation instruction.
 */
export default class Variation extends BlockInstruction implements VariationInterface {
	name: string;
	title: string;
	isDefault?: boolean;
	scope?: string[];
	icon?: string;

	/**
	 * Passes on the options as configuration.
	 *
	 * @returns The configuration.
	 */
	configuration(): Partial<ExtendedBlockConfiguration> {
		return {
			variations: [
				this.options,
			],
		};
	}

	/**
	 * Returns whether or not this instruction should be included in the tree.
	 *
	 * @returns Whether or not to render this instruction.
	 */
	renderable(): boolean {
		return false;
	}

	/**
	 * Checks if the instruction block is valid.
	 *
	 * @param blockInstance The attributes from the block.
	 *
	 * @returns {BlockValidationResult} The validation result.
	 */
	validate( blockInstance: BlockInstance ): BlockValidationResult {
		const validation = new BlockValidationResult( blockInstance.clientId, blockInstance.name, BlockValidation.Unknown, BlockPresence.Unknown );
		// The following line is borrowed from innerblocks.tsx; idea here is to gather the underlying variation, if any, and determine if it is valid / not empty.
		validation.issues = validateInnerBlocks( blockInstance, this.options.requiredBlocks, this.options.recommendedBlocks );

		return validateMany( validation );
	}
}

BlockInstruction.register( "variation", Variation );
