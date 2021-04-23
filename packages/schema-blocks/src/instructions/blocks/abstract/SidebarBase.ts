import BlockInstruction from "../../../core/blocks/BlockInstruction";
import { RenderSaveProps, RenderEditProps } from "../../../core/blocks/BlockDefinition";

export type SidebarBaseOptions = {
	name: string;
	default?: string;
	type?: string;
	label?: string;
	help?: string;
	className: string;
	required?: boolean;
	visible?: boolean;
	helpLink?: string;
}

/**
 * SidebarBase instruction.
 */
export default abstract class SidebarBase extends BlockInstruction {
	public options: SidebarBaseOptions;

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
	 * Returns whether or not this instruction should be included in the tree.
	 *
	 * @returns Whether or not to render this instruction.
	 */
	renderable(): boolean {
		return this.options.visible !== false;
	}

	protected abstract value( props: RenderSaveProps | RenderEditProps ): JSX.Element | string;
}
