import BlockLeaf from "../../core/blocks/BlockLeaf";
import BlockInstruction from "../../core/blocks/BlockInstruction";
import { RenderEditProps, RenderSaveProps } from "../../core/blocks/BlockDefinition";

/**
 * BlockInstructionLeaf class.
 */
export default class BlockInstructionLeaf extends BlockLeaf {
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
		// eslint-disable-next-line no-undefined
		if ( instruction === undefined ) {
			console.error( "could not instantiate BlockInstructionLeaf with a null instruction" );
		}
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
		// We sometimes have a race condition here
		return this.instruction.edit( props, this, i );
	}
}
