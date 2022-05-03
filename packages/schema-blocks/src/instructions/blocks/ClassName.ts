import BlockInstruction from "../../core/blocks/BlockInstruction";
import { RenderEditProps, RenderSaveProps } from "../../core/blocks/BlockDefinition";

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
	 * @param props The saved props.
	 *
	 * @returns The current set classname with the "yoast-inner-container"
	 */
	save( props: RenderSaveProps ): string {
		if ( props.attributes.className ) {
			return props.attributes.className as string;
		}
		return "";
	}
}

BlockInstruction.register( "class-name", ClassName );
