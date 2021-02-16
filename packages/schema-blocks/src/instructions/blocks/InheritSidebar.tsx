import { createElement, Fragment, ReactElement } from "@wordpress/element";
import BlockInstruction from "../../core/blocks/BlockInstruction";
import { BlockInstructionClass } from "../../core/blocks/BlockInstructionClass";
import { RenderSaveProps, RenderEditProps } from "../../core/blocks/BlockDefinition";
import { BlockEditProps, BlockConfiguration } from "@wordpress/blocks";
import SidebarBase, { SidebarBaseOptions } from "./abstract/SidebarBase";
import { getParentId, getParentIdOfType } from "../../functions/gutenberg/block";
import { getBlockByClientId } from "../../functions/BlockHelper";
import { InnerBlocksInstructionOptions } from "./InnerBlocksInstructionOptions";
import Instruction from "../../core/Instruction";
import { innerBlocksSidebar } from "../../functions/presenters/InnerBlocksSidebarPresenter";

/**
 * Sidebar input instruction.
 */
class InheritSidebar extends SidebarBase {
	public options: SidebarBaseOptions & {
		fromParents: string[];
	};


	/* eslint-disable @typescript-eslint/no-unused-vars */
	/**
	 * Renders the sidebar for any parent blocks defined in the fromParents attribute, or the immediate parent's sidebar if no parents are specified.
	 *
	 * @param props The render props.
	 * @param i     The number sidebar element this is.
	 *
	 * @returns The sidebar element.
	 */
	sidebar( props: BlockEditProps<Record<string, unknown>>, i: number ): ReactElement {
		let parentIds: string[] = [];
		if ( this.options.fromParents ) {
			parentIds = getParentIdOfType( props.clientId, this.options.fromParents );
		} else {
			const parentId = getParentId( props.clientId );
			if ( parentId ) {
				parentIds = [ parentId ];
			}
		}

		const elements: ReactElement[] = [];
		if ( parentIds.length > 0 ) {
			parentIds.forEach( parentId => {
				const parentBlock = getBlockByClientId( parentId );
				const parentBlockInstruction: BlockInstructionClass = Instruction.registeredInstructions[ parentBlock.name ] as BlockInstructionClass;
				if ( parentBlockInstruction ) {
					elements.push( ...innerBlocksSidebar( parentBlock, parentBlockInstruction.options as InnerBlocksInstructionOptions ) );
				}
			} );
		}

		return (
			<Fragment>
				{ ...elements }
			</Fragment>
		);
	}
	/* eslint-enable @typescript-eslint/no-unused-vars */

	/**
	 * Adds the sidebar input to the block configuration.
	 *
	 * @returns The block configuration.
	 */
	configuration(): Partial<BlockConfiguration> {
		return {
			attributes: {
				[ this.options.name ]: {
					type: this.options.type === "number" ? "number" : "string",
					required: this.options.required === true,
				},
			},
		};
	}

	/**
	 * Renders the value of a sidebar input.
	 *
	 * @param props The render props.
	 *
	 * @returns The value of the sidebar input.
	 */
	protected value( props: RenderSaveProps | RenderEditProps ): string {
		return props.attributes[ this.options.name ] as string || this.options.default || "";
	}
}

BlockInstruction.register( "inherit-sidebar", InheritSidebar );
