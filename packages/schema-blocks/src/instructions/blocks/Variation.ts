import BlockInstruction from "../../core/blocks/BlockInstruction";
import { ExtendedBlockConfiguration } from "../../type-adapters/ExtendedBlockConfiguration";

export interface VariationInterface {
	name: string;
	title: string;
	isDefault?: boolean;
	icon?: string;
}

/**
 * Variation instruction.
 */
class Variation extends BlockInstruction implements VariationInterface {
	name: string;
	title: string;
	isDefault?: boolean;
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
}

BlockInstruction.register( "variation", Variation );
