import { createElement, Fragment, ReactElement } from "@wordpress/element";
import BlockInstruction, { BlockInstructionClass } from "../../core/blocks/BlockInstruction";
import { RenderSaveProps, RenderEditProps } from "../../core/blocks/BlockDefinition";
import { BlockEditProps, BlockConfiguration } from "@wordpress/blocks";
import SidebarBase, { SidebarBaseOptions } from "./abstract/SidebarBase";
import { getParentId, getParentIdOfType } from "../../functions/gutenberg/block";
import { getBlockByClientId } from "../../functions/BlockHelper";
import { InnerBlocksInstructionOptions } from "./InnerBlocksInstructionOptions";
import Instruction from "../../core/Instruction";
import { innerBlocksSidebar } from "../../functions/presenters/InnerBlocksSidebarPresenter";
import logger from "../../functions/logger";
import { getBlockDefinition } from "../../core/blocks/BlockDefinitionRepository";

/**
 * Sidebar input instruction.
 */
export default class InheritSidebar extends SidebarBase {
	public options: SidebarBaseOptions & {
		parents: string[];
	};

	/* eslint-disable @typescript-eslint/no-unused-vars */
	/**
	 * Renders the sidebar for any parent blocks defined in the parents attribute, or the immediate parent's sidebar if no parents are specified.
	 *
	 * @param props The render props.
	 * @param i     The number sidebar element this is.
	 *
	 * @returns The sidebar element.
	 */
	sidebar( props: BlockEditProps<Record<string, unknown>>, i: number ): ReactElement {
		let parentIds: string[] = [];
		if ( this.options.parents ) {
			parentIds = getParentIdOfType( props.clientId, this.options.parents );
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
				const parentBlockDefinition = getBlockDefinition( parentBlock.name );
				if ( parentBlockDefinition ) {
					logger.debug( "inherting sidebar from " + parentBlock.name );
					logger.debug( parentBlock.name + " has sidebar? ", parentBlockDefinition.sidebar );

					elements.push( parentBlockDefinition.sidebar( props, i ) );
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
					parents: this.options.parents,
				},
			},
		};
	}


	/* eslint-disable @typescript-eslint/no-unused-vars */
	/**
	 * Renders the value of a sidebar input.
	 *
	 * @param props The render props.
	 *
	 * @returns The value of the sidebar input.
	 */
	protected value( props: RenderSaveProps | RenderEditProps ): string {
		return null;
	}
	/* eslint-enable @typescript-eslint/no-unused-vars */
}

BlockInstruction.register( "inherit-sidebar", InheritSidebar );
