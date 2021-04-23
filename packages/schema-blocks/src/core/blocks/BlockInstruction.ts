import BlockLeaf from "./BlockLeaf";
import { ReactElement } from "@wordpress/element";
import { RenderEditProps, RenderSaveProps } from "./BlockDefinition";
import { BlockConfiguration, BlockInstance } from "@wordpress/blocks";
import { BlockValidation, BlockValidationResult, BlockPresence } from "../validation";
import Instruction from "../Instruction";

/**
 * BlockInstruction class.
 */
export default abstract class BlockInstruction extends Instruction {
	/* eslint-disable @typescript-eslint/no-unused-vars */
	/**
	 * Renders saving the element.
	 *
	 * @param props The props.
	 * @param leaf  The leaf being rendered.
	 * @param i     The number the rendered element is of its parent.
	 *
	 * @returns {ReactElement | string} The element to render.
	 */
	save( props: RenderSaveProps, leaf: BlockLeaf, i: number ): ReactElement | string {
		return null;
	}
	/* eslint-enable @typescript-eslint/no-unused-vars */

	/* eslint-disable @typescript-eslint/no-unused-vars */
	/**
	 * Renders editing the element.
	 *
	 * @param props The props.
	 * @param leaf  The leaf being rendered.
	 * @param i     The number the rendered element is of its parent.
	 *
	 * @returns {ReactElement | string} The element to render.
	 */
	edit( props: RenderEditProps, leaf: BlockLeaf, i: number ): ReactElement | string {
		return null;
	}
	/* eslint-enable @typescript-eslint/no-unused-vars */

	/* eslint-disable @typescript-eslint/no-unused-vars */
	/**
	 * Renders the sidebar.
	 *
	 * @param props The props.
	 * @param i     The number the rendered element is of its parent.
	 *
	 * @returns {ReactElement | string} The sidebar element to render.
	 */
	sidebar( props: RenderEditProps, i: number ): ReactElement {
		return null;
	}
	/* eslint-enable @typescript-eslint/no-unused-vars */

	/**
	 * Returns the configuration of this instruction.
	 *
	 * @returns {Partial<BlockConfiguration>} The configuration.
	 */
	configuration(): Partial<BlockConfiguration> {
		return {};
	}

	/**
	 * Checks if the instruction block is valid.
	 *
	 * @param blockInstance The attributes from the block.
	 *
	 * @returns {BlockValidationResult} The validation result.
	 */
	validate( blockInstance: BlockInstance ): BlockValidationResult {
		return new BlockValidationResult( blockInstance.clientId, this.constructor.name, BlockValidation.Unknown, BlockPresence.Unknown );
	}
}
