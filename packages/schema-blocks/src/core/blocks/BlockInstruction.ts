import BlockLeaf from "./BlockLeaf";
import { RenderSaveProps, RenderEditProps } from "./BlockDefinition";
import { ReactElement } from "@wordpress/element";
import { BlockConfiguration, BlockInstance } from "@wordpress/blocks";
import { BlockValidationResult, BlockValidation } from "../validation";
import Instruction, { InstructionOptions } from "../Instruction";
import { attributeExists, attributeNotEmpty } from "../../functions/validators";
import validateInnerBlocks from "../../functions/validators/innerBlocksValid";
import validateMany from "../../functions/validators/validateMany";

export type BlockInstructionClass = { new( id: number, options: InstructionOptions ): BlockInstruction };

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
	 * @returns {JSX.Element} The element to render.
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
	 * @returns {JSX.Element} The element to render.
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

	/**
	 * Checks if the instruction block is valid.
	 *
	 * @param blockInstance The attributes from the block.
	 *
	 * @returns {BlockValidationResult} The validation result.
	 */
	validate( blockInstance: BlockInstance ): BlockValidationResult {
		const validation = new BlockValidationResult( blockInstance.clientId, blockInstance.name, BlockValidation.Unknown );
		if ( this.options.required === true ) {
			const valid = attributeExists( blockInstance, this.options.name as string ) &&
						  attributeNotEmpty( blockInstance, this.options.name as string );
			if ( ! valid ) {
				// eslint-disable-next-line no-console
				console.log( "block " + blockInstance.name + " has a required attributes " + this.options.name + " but it is missing or empty" );
				validation.issues.push( new BlockValidationResult( blockInstance.clientId, this.options.name, BlockValidation.MissingAttribute ) );
				validation.result = BlockValidation.Invalid;
			}
		}

		if ( validation.result !== BlockValidation.Unknown && blockInstance.innerBlocks.length === 0 ) {
			return validation;
		}

		// It depends on this block's innerblocks if this block is valid.
		validation.issues.push( ...validateInnerBlocks( blockInstance ) );
		return validateMany( validation );
	}
}
