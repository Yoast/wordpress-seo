import BlockInstruction from "../../../core/blocks/BlockInstruction";
import { RenderSaveProps, RenderEditProps } from "../../../core/blocks/BlockDefinition";

/**
 * Sidebar input instruction
 */
export default abstract class SidebarBase extends BlockInstruction {
	public options: {
		output?: boolean;
		required?: boolean;
	}

	/**
	 * Renders the value of a sidebar input.
	 *
	 * @param props The render props.
	 *
	 * @returns The value of the sidebar input.
	 */
	save( props: RenderSaveProps ): JSX.Element | string {
		return this.value( props );
	}

	/**
	 * Renders the value of a sidebar input.
	 *
	 * @param props The render props.
	 *
	 * @returns The value of the sidebar input.
	 */
	edit( props: RenderEditProps ): JSX.Element | string {
		return this.value( props );
	}

	/**
	 * Returns whether or not this instruction should be included in the tree.
	 *
	 * @returns Whether or not to render this instruction.
	 */
	renderable(): boolean {
		return this.options.output !== false;
	}

	protected abstract value( props: RenderSaveProps | RenderEditProps ): JSX.Element | string;
}
