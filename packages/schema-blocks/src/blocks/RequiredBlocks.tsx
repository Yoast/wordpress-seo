import { ReactElement } from "react";
import { BlockInstance, createBlock } from "@wordpress/blocks";
import { createElement } from "@wordpress/element";
import { RequiredBlock } from "../instructions/blocks/dto";

import { getInnerblocksByName, insertBlock } from "../functions/innerBlocksHelper";
import { getBlockType } from "../functions/BlockHelper";
import { PanelBody } from "@wordpress/components";

type AddedBSuggestionDefinition = {
	blockTitle: string;
}

type SuggestionDefinition = {
	blockTitle: string;
	blockName: string;
	blockClientId: string;
}

/**
 * Renders a block suggestion with the possibility to add one.
 *
 * @param {string}   blockTitle    The title to show.
 * @param {string}   blockName     The name of the block to add.
 * @param {string}   blockClientId The clientId of the target to add the block to.
 *
 * @returns {ReactElement} The rendered block suggestion.
 */
function BlockSuggestion( { blockTitle, blockName, blockClientId }: SuggestionDefinition ): ReactElement {
	/**
	 * Onclick handler for the remove block.
	 */
	const addBlockClick = () => {
		const blockToAdd = createBlock( blockName );
		insertBlock( blockToAdd, blockClientId );
	};

	return (
		<li className="yoast-block-suggestion">
			{ blockTitle }
			<button className="yoast-block-suggestion-button" onClick={ addBlockClick }>Add</button>
		</li>
	);
}

/**
 * Renders a block suggestion that is already added
 *
 * @param {string} blockTitle The block title.
 *
 * @returns {ReactElement} The rendered element.
 */
function BlockSuggestionAdded( { blockTitle }: AddedBSuggestionDefinition ): ReactElement {
	return (
		<li className="yoast-block-suggestion yoast-block-suggestion--added">
			{ blockTitle }
			<span className="yoast-block-suggestion-checkmark">x</span>
		</li>
	);
}

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
		.filter( requiredBlock => typeof getBlockType( requiredBlock.name ) !== "undefined" )
		.map( requiredBlock => requiredBlock.name );

	// When there are no required blocknames, just return.
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
							return <BlockSuggestionAdded key={ index } blockTitle={ blockType.title } />;
						}

						return <BlockSuggestion
							key={ index }
							blockTitle={ blockType.title }
							blockName={ requiredBlockName }
							blockClientId={ block.clientId }
						/>;
					} )
				}
			</ul>
		</PanelBody>
	);
}
