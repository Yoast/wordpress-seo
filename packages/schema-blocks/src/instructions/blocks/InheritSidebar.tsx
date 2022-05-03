import { ReactElement } from "react";
import { createElement, Fragment } from "@wordpress/element";
import BlockInstruction from "../../core/blocks/BlockInstruction";
import { BlockEditProps, BlockConfiguration } from "@wordpress/blocks";
import { createBlockEditProps, getParentIdOfType } from "../../functions/gutenberg/block";
import { getBlockByClientId } from "../../functions/BlockHelper";
import logger from "../../functions/logger";
import { getBlockDefinition } from "../../core/blocks/BlockDefinitionRepository";
import { InstructionOptions } from "../../core/Instruction";

/**
 * InheritSidebar instruction.
 */
export default class InheritSidebar extends BlockInstruction {
	public options: InstructionOptions & {
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
		}
		const thisBlock = getBlockByClientId( props.clientId );

		const elements: ReactElement[] = [];
		if ( parentIds.length > 0 ) {
			parentIds.forEach( parentId => {
				const parentBlock = getBlockByClientId( parentId );
				const parentBlockDefinition = getBlockDefinition( parentBlock.name );
				if ( parentBlockDefinition ) {
					logger.debug( thisBlock.name + " inherited sidebar from " + parentBlock.name + " definition" );
					const parentProps = createBlockEditProps( parentBlock );
					elements.push( ...parentBlockDefinition.sidebarElements( parentProps ) );
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
}

BlockInstruction.register( "inherit-sidebar", InheritSidebar );
