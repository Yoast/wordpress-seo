import BlockInstruction from "../../core/blocks/BlockInstruction";
import { BlockConfiguration } from "@wordpress/blocks";
import { ReactElement } from "@wordpress/element";
import { RenderEditProps } from "../../core/blocks/BlockDefinition";

/**
 * Block instruction.
 */
class Block extends BlockInstruction {
	/**
	 * Passes on the options as configuration.
	 *
	 * @returns The configuration.
	 */
	configuration(): Partial<BlockConfiguration> {
		return this.options;
	}

	/**
	 * Returns whether or not this instruction should be included in the tree.
	 *
	 * @returns Whether or not to render this instruction.
	 */
	renderable(): boolean {
		return false;
	}

	/* eslint-disable @typescript-eslint/no-unused-vars */
	/**
	 * Renders the sidebar.
	 *
	 * @param props The props.
	 *
	 * @returns The sidebar element to render.
	 */
	sidebar( props: RenderEditProps ): ReactElement {
		return null;
	}
	/* eslint-enable @typescript-eslint/no-unused-vars */
}

BlockInstruction.register( "block", Block );
