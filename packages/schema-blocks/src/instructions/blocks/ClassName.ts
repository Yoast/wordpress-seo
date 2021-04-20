import BlockInstruction from "../../core/blocks/BlockInstruction";
import { RenderEditProps } from "../../core/blocks/BlockDefinition";
import { BlockInstance } from "@wordpress/blocks";
import { BlockValidationResult } from "../../core/validation";

/**
 * ClassName instruction.
 */
export default class ClassName extends BlockInstruction {
	/**
	 * Renders the class name.
	 *
	 * @param props The render props.
	 *
	 * @returns The class name.
	 */
	edit( props: RenderEditProps ): string {
		return props.className;
	}

	/**
	 * Always add the "yoast-inner-container" class
	 * on the frontend, so the Twenty Twenty One
	 * theme works correctly.
	 *
	 * @returns "yoast-inner-container"
	 */
	save(): string {
		return "yoast-inner-container";
	}

	/**
	 * Checks if the instruction block is valid.
	 *
	 * @param blockInstance The attributes from the block.
	 *
	 * @returns {BlockValidationResult} The validation result.
	 */
	validate( blockInstance: BlockInstance ): BlockValidationResult {
		return BlockValidationResult.Valid( blockInstance, this.constructor.name );
	}
}

BlockInstruction.register( "class-name", ClassName );
