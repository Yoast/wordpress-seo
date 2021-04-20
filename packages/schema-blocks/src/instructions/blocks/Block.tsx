import BlockInstruction from "../../core/blocks/BlockInstruction";
import { BlockConfiguration, BlockInstance } from "@wordpress/blocks";
import { BlockPresence, BlockValidationResult } from "../../core/validation";

/**
 * Block instruction.
 */
class Block extends BlockInstruction {
	/**
	 * Passes on the options as configuration.
	 *
	 * @returns The configuration.
	 */
	configuration(): Partial<BlockConfiguration> {
		const schemaAttribute = {
			attributes: {
				"is-yoast-schema-block": {
					type: "object",
					"default": true,
				},
			},
		};

		return Object.assign( this.options, schemaAttribute );
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
		return BlockValidationResult.Valid( blockInstance, this.constructor.name, BlockPresence.Required );
	}
}

BlockInstruction.register( "block", Block );
