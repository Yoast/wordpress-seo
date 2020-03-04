import BlockLeaf from "../../core/blocks/BlockLeaf";
import BlockInstruction from "../../core/blocks/BlockInstruction";
import { RenderEditProps, RenderSaveProps } from "../../core/blocks/BlockDefinition";

/**
 * BlockBlockInstructionLeaf class.
 */
export default class BlockBlockInstructionLeaf extends BlockLeaf {
	public instruction: BlockInstruction;

	/**
     * Creates an instruction leaf.
     *
     * @param instruction The instruction.
     * @param options     The options.
     */
	constructor(
		instruction: BlockInstruction,
	) {
		super();
		this.instruction = instruction;
	}

	/**
	 * Renders editing a leaf.
	 *
	 * @param props The render props.
	 * @param i     The number child this leaf is.
	 *
	 * @returns The rendered element.
	 */
	save( props: RenderSaveProps, i: number ): JSX.Element | string {
		return this.instruction.save( props, this, i );
	}

	/**
	 * Renders saving a leaf.
	 *
	 * @param props The render props.
	 * @param i     The number child this leaf is.
	 *
	 * @returns The rendered element.
	 */
	edit( props: RenderEditProps, i: number ): JSX.Element | string {
		return this.instruction.edit( props, this, i );
	}
}
