import BlockInstruction from "../../core/blocks/BlockInstruction";
import { BlockConfiguration } from "@wordpress/blocks";

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
}

BlockInstruction.register( "block", Block );
