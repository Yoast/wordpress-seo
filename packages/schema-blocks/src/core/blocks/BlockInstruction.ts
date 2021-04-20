import BlockLeaf from "./BlockLeaf";
import { RenderEditProps, RenderSaveProps } from "./BlockDefinition";
import { ReactElement } from "@wordpress/element";
import { BlockConfiguration, BlockInstance } from "@wordpress/blocks";
import { BlockValidation, BlockValidationResult, BlockPresence } from "../validation";
import Instruction, { InstructionOptions } from "../Instruction";
import { attributeExists, attributeNotEmpty } from "../../functions/validators";
import { maxBy } from "lodash";
import logger from "../../functions/logger";

export type BlockInstructionClass = {
	new( id: number, options: InstructionOptions ): BlockInstruction;
	options: InstructionOptions;
};

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
		const issues: BlockValidationResult[] = [];

		let presence = BlockPresence.Unknown;
		if ( this.options ) {
			presence = this.getPresence( this.options );
			const attributeValid = attributeExists( blockInstance, this.options.name as string ) &&
								attributeNotEmpty( blockInstance, this.options.name as string );
			if ( ! attributeValid ) {
				issues.push( BlockValidationResult.MissingAttribute( blockInstance, this.constructor.name, presence ) );
			}
		}

		// Core blocks have their own validation
		if ( blockInstance.name.startsWith( "core/" ) && ! blockInstance.isValid ) {
			issues.push( new BlockValidationResult( blockInstance.clientId, this.constructor.name, BlockValidation.Invalid, presence ) );
		}

		// No issues found? That means the block is valid.
		if ( issues.length < 1 ) {
			return BlockValidationResult.Valid( blockInstance, this.constructor.name, presence );
		}

		// Make sure to report the worst case scenario as the final validation result.
		const worstCase: BlockValidationResult = maxBy( issues, issue => issue.result );

		const validation = new BlockValidationResult( blockInstance.clientId, this.constructor.name, worstCase.result, worstCase.blockPresence );
		validation.issues = issues;

		return validation;
	}

	/**
	 * Converts the presence requirements of a particular element to a BlockPresence variable.
	 * @param options The block's options.
	 * @returns The requirements converted to BlockPresence.
	 */
	getPresence( options: InstructionOptions ) {
		if ( ! options || options.required === "undefined" ) {
			return BlockPresence.Unknown;
		}

		if ( options.required === true ) {
			return BlockPresence.Required;
		}

		if ( options.required === false ) {
			return BlockPresence.Recommended;
		}
	}
}
