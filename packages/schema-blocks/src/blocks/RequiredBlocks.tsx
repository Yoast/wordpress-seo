import { ReactElement } from "react";
import { BlockInstance, createBlock } from "@wordpress/blocks";
import { createElement } from "@wordpress/element";
import { RequiredBlock } from "../instructions/blocks/dto";

import { getInnerblocksByName, insertBlockToInnerBlock } from "../functions/innerBlocksHelper";
import { getBlockType } from "../functions/blocks";
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
	const requiredBlockNames = requiredBlocks.map( ( requiredBlock ) => {
		return requiredBlock.name;
	} );

	const findPresentBlocks = getInnerblocksByName( block, requiredBlockNames );
	const presentBlockNames = findPresentBlocks.map( ( presentBlock ) => {
		return presentBlock.name;
	} );

	const requiredBlockItems: ReactElement[] = [];

	requiredBlockNames.forEach( ( requiredBlockName: string ) => {
		const blockType = getBlockType( requiredBlockName );

		if ( typeof blockType === "undefined" ) {
			return;
		}

		if ( presentBlockNames.includes( requiredBlockName ) ) {
			requiredBlockItems.push(
				(
					<li className="yoast-block-suggestion yoast-block-suggestion--added">
						{ blockType.title }
						<span className="yoast-block-suggestion-checkmark">x</span>
					</li>
				),
			);

			return;
		}

		/**
		 * Onclick handler for the remove block.
		 */
		const addBlockClick = () => {
			const blockToAdd = createBlock( requiredBlockName );
			insertBlockToInnerBlock( blockToAdd, block.clientId );
		};

		requiredBlockItems.push(
			(
				<li className="yoast-block-suggestion">
					{ blockType.title }
					<button className="yoast-block-suggestion-button" onClick={ addBlockClick }>Add</button>
				</li>
			),
		);
	} );

	if ( requiredBlockItems.length === 0 ) {
		return null;
	}

	return (
		<PanelBody>
			<div className="yoast-block-sidebar-title">Required blocks</div>
			<ul className="yoast-block-suggestions">
				{ requiredBlockItems }
			</ul>
		</PanelBody>
	);
}
