import BlockInstruction from "../../core/blocks/BlockInstruction";
import { BlockConfiguration } from "@wordpress/blocks";
import { createElement, Fragment, ReactElement } from "@wordpress/element";
import { RenderEditProps } from "../../core/blocks/BlockDefinition";
import { getBlockByClientId } from "../../functions/BlockHelper";
import { innerBlocksSidebar } from "../../functions/presenters/InnerBlocksSidebarPresenter";
import { InnerBlocksInstructionOptions } from "./InnerBlocksInstructionOptions";
import { select } from "@wordpress/data";

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
		const schemaAttribute = {
			attributes: {
				"is-yoast-schema-block": {
					type: "object",
					"default": true,
				},
			},
		};

		return Object.assign( this.options, schemaAttribute );
	}

	/**
	 * Returns whether or not this instruction should be included in the tree.
	 *
	 * @returns Whether or not to render this instruction.
	 */
	renderable(): boolean {
		return false;
	}

	/**
	 * Renders the sidebar.
	 *
	 * @param props The props.
	 *
	 * @returns The sidebar element to render.
	 */
	sidebar( props: RenderEditProps ): ReactElement {
		const rootId = this.getParentBlockOfType( props.clientId, [ "yoast/recipe", "yoast/job-posting" ] );
		if ( rootId ) {
			const rootBlock = getBlockByClientId( rootId );
			/* BUG: this.options contains the options of the inner block, but we need to
			   pass the options of the root block which has required blocks / recommended blocks. */
			const elements: ReactElement[] = innerBlocksSidebar( rootBlock, this.options as InnerBlocksInstructionOptions );
			return (
				<Fragment key="innerblocks-sidebar">
					{ ...elements }
				</Fragment>
			);
		}

		return null;
	}

	/**
	 * Determines if the current block is nested inside a job posting.
	 * @param clientId The id of the block to find parents for.
	 * @param parentNames The parent block names to look for.
	 * @returns {string} the clientId of the parent of the requested type, or null if no such parent was found.
	 */
	getParentBlockOfType( clientId: string, parentNames: string[] ): string | null {
		// The method getBlockParentsByBlockName is included since WP5.4 but not available in the typings.
		const parents = ( select( "core/block-editor" ) as unknown as selectorWithgetBlockParentsByBlockName )
			.getBlockParentsByBlockName( clientId, parentNames );
		return parents.length > 0 ? parents[ 0 ] : null;
	}
}

type selectorWithgetBlockParentsByBlockName = {
	getBlockParentsByBlockName( clientId: string, parentNames: string[] ): string[];
}

BlockInstruction.register( "block", Block );
