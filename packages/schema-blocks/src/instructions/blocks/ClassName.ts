import BlockInstruction from "../../core/blocks/BlockInstruction";
import { RenderEditProps } from "../../core/blocks/BlockDefinition";

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
	save(): "yoast-inner-container" {
		return "yoast-inner-container";
	}
}

BlockInstruction.register( "class-name", ClassName );
