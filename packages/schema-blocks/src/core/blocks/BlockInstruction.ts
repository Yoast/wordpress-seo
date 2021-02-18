import BlockLeaf from "./BlockLeaf";
import { RenderSaveProps, RenderEditProps } from "./BlockDefinition";
import { ReactElement } from "@wordpress/element";
import { BlockConfiguration, BlockInstance } from "@wordpress/blocks";
import { BlockValidationResult, BlockValidation } from "../validation";
import Instruction, { InstructionOptions } from "../Instruction";
import { attributeExists, attributeNotEmpty } from "../../functions/validators";
import validateMany from "../../functions/validators/validateMany";
import logger from "../../functions/logger";

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
		const validation = new BlockValidationResult( blockInstance.clientId, blockInstance.name, BlockValidation.Skipped );

		if ( this.options && this.options.required === true ) {
			const attributeValid = attributeExists( blockInstance, this.options.name as string ) &&
						           attributeNotEmpty( blockInstance, this.options.name as string );
			if ( attributeValid ) {
				validation.issues.push( new BlockValidationResult( blockInstance.clientId, this.options.name, BlockValidation.Valid ) );
			} else {
				logger.warning( "block " + blockInstance.name + " has a required attributes " + this.options.name + " but it is missing or empty" );
				validation.issues.push( new BlockValidationResult( blockInstance.clientId, this.options.name, BlockValidation.MissingAttribute ) );
				validation.result = BlockValidation.Invalid;
			}
		} else {
			if ( blockInstance.name.startsWith( "core/" ) ) {
				validation.result = blockInstance.isValid ? BlockValidation.Valid : BlockValidation.Invalid;
				return validation;
			}
		}

		// Blocks with any invalid innerblock should be considerd invalid themselves.
		if ( validation.issues.length > 0 ) {
			return validateMany( validation );
		}

		return validation;
	}
}
