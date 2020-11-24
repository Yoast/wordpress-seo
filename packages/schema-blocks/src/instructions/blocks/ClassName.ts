import BlockInstruction from "../../core/blocks/BlockInstruction";
import { RenderEditProps } from "../../core/blocks/BlockDefinition";

/**
 * ClassName instruction.
 */
class ClassName extends BlockInstruction {
	/**
	 * Renders the class name
	 *
	 * @param props The render props.
	 *
	 * @returns The class name.
	 */
	edit( props: RenderEditProps ): string {
		return props.className;
	}
}

BlockInstruction.register( "class-name", ClassName );
