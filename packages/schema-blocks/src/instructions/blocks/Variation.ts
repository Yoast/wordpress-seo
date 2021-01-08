import BlockInstruction from "../../core/blocks/BlockInstruction";
import { ExtendedBlockConfiguration } from "../../core/types/ExtendedBlockConfiguration";

/**
 * Variation instruction.
 */
class Variation extends BlockInstruction {
	/**
	 * Passes on the options as configuration.
	 *
	 * @returns The configuration.
	 */
	configuration(): Partial<ExtendedBlockConfiguration> {
		console.log( "The variation options: " + this.options );
		console.log( "Henk" );
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
}

console.log( "Registering the variation instruction" );
BlockInstruction.register( "variation", Variation );
