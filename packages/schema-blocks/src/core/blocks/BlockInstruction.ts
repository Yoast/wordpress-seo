import BlockLeaf from "./BlockLeaf";
import { RenderSaveProps, RenderEditProps } from "./BlockDefinition";
import { ReactElement } from "@wordpress/element";
import { BlockConfiguration } from "@wordpress/blocks";
import Instruction, { InstructionOptions } from "../Instruction";

export type BlockInstructionClass = { new( id: number, options: InstructionOptions ): BlockInstruction };

/**
 * BlockInstruction class.
 */
export default abstract class BlockInstruction extends Instruction {
	/* eslint-disable @typescript-eslint/no-unused-vars */
	/**
	 * Renders editing the element.
	 *
	 * @param props props The props.
	 * @param leaf  The leaf being rendered.
	 * @param i     The number the rendered element is of it's parent.
	 *
	 * @returns {JSX.Element} The element to render.
	 */
	save( props: RenderSaveProps, leaf: BlockLeaf, i: number ): ReactElement | string {
		return null;
	}

	/**
	 * Renders saving the element.
	 *
	 * @param props props The props.
	 * @param leaf  The leaf being rendered.
	 * @param i     The number the rendered element is of it's parent.
	 *
	 * @returns {JSX.Element} The element to render.
	 */
	edit( props: RenderEditProps, leaf: BlockLeaf, i: number ): ReactElement | string {
		return null;
	}

	/**
	 * Renders the sidebar.
	 *
	 * @param props The props.
	 * @param i     The number the rendered element is of it's parent.
	 *
	 * @returns The sidebar element to render.
	 */
	sidebar( props: RenderEditProps, i: number ): ReactElement | string {
		return null;
	}
	/* eslint-enable @typescript-eslint/no-unused-vars */

	/**
	 * Returns the configuration of this instruction.
	 *
	 * @returns The configuration.
	 */
	configuration(): Partial<BlockConfiguration> {
		return {};
	}
}
