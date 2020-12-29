import { ReactElement } from "react";
import { BlockInstance, createBlock } from "@wordpress/blocks";
import { createElement } from "@wordpress/element";
import { RequiredBlock } from "../instructions/blocks/dto";

import { getInnerblocksByName, insertBlockToInnerBlock } from "../functions/innerBlocksHelper";
import { getBlockType } from "../functions/BlockHelper";
import { PanelBody } from "@wordpress/components";

/**
 * Renders a list with the required block names and an button to add/remove one.
 *
 * @param {BlockInstance}   block          The block to render the list for.
 * @param {RequiredBlock[]} requiredBlocks The required blocks.
 *
 * @returns {ReactElement} The rendered block.
 */
export default function RequiredBlocks( block: BlockInstance, requiredBlocks: RequiredBlock[] ): ReactElement {
	// Retrieve a list with names.
	const requiredBlockNames = requiredBlocks
		.filter( requiredBlock => {
			const blockType = getBlockType( requiredBlock.name );

			return typeof blockType !== "undefined";
		} )
		.map( requiredBlock => requiredBlock.name );

	// When there are no requirted blocknames, just return.
	if ( requiredBlockNames.length === 0 ) {
		return null;
	}

	const findPresentBlocks = getInnerblocksByName( block, requiredBlockNames );
	const presentBlockNames = findPresentBlocks.map( presentBlock => presentBlock.name );

	return (
		<PanelBody>
			<div className="yoast-block-sidebar-title">Required blocks</div>
			<ul className="yoast-block-suggestions">
				{
					requiredBlockNames.map( ( requiredBlockName: string, index: number ) => {
						const blockType = getBlockType( requiredBlockName );

						if ( presentBlockNames.includes( requiredBlockName ) ) {
							return (
								<li key={ index } className="yoast-block-suggestion yoast-block-suggestion--added">
									{ blockType.title }
									<span className="yoast-block-suggestion-checkmark">x</span>
								</li>
							);
						}

						/**
						 * Onclick handler for the remove block.
						 */
						const addBlockClick = () => {
							const blockToAdd = createBlock( requiredBlockName );
							insertBlockToInnerBlock( blockToAdd, block.clientId );
						};

						return (
							<li key={ index } className="yoast-block-suggestion">
								{ blockType.title }
								<button className="yoast-block-suggestion-button" onClick={ addBlockClick }>Add</button>
							</li>
						);
					} )
				}
			</ul>
		</PanelBody>
	);
}
