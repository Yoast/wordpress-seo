import { ReactElement } from "react";
import { BlockInstance, createBlock } from "@wordpress/blocks";
import { createElement } from "@wordpress/element";
import { getInnerblocksByName, insertBlock } from "../functions/innerBlocksHelper";
import { getBlockType } from "../functions/BlockHelper";
import { PanelBody } from "@wordpress/components";
import { SuggestedBlockProperties } from "../core/validation/SuggestedBlockProperties";

type BlockSuggestionAddedDto = {
	blockTitle: string;
}

type BlockSuggestionDto = {
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
function BlockSuggestion( { blockTitle, blockName, blockClientId }: BlockSuggestionDto ): ReactElement {
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
			<button className="yoast-block-suggestion-button" onClick={ addBlockClick }> Add </button>
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
function BlockSuggestionAdded( { blockTitle }: BlockSuggestionAddedDto ): ReactElement {
	return (
		<li className="yoast-block-suggestion yoast-block-suggestion--added">
			{ blockTitle }
			<span className="yoast-block-suggestion-checkmark"> OK </span>
		</li>
	);
}

/**
 * Renders a sidebar panel with the required/recommended block names and a button to add a missing block.
 *
 * @param {string} sidebarTitle                        The title of the sidebar section.
 * @param {BlockInstance} block                        The block to render the suggestions for.
 * @param {SuggestedBlockProperties[]} suggestedBlocks The required/recommended blocks.
 *
 * @returns {ReactElement} The rendered sidebar section with block suggestions.
 */
export default function RequiredBlocks( sidebarTitle: string, block: BlockInstance, suggestedBlocks: SuggestedBlockProperties[] ): ReactElement {
	const suggestedBlockNames = suggestedBlocks
		.filter( suggestedBlock => typeof getBlockType( suggestedBlock.name ) !== "undefined" )
		.map( suggestedBlock => suggestedBlock.name );

	// When there are no suggestions, just return.
	if ( suggestedBlockNames.length === 0 ) {
		return null;
	}

	const findPresentBlocks = getInnerblocksByName( block, suggestedBlockNames );
	const presentBlockNames = findPresentBlocks.map( presentBlock => presentBlock.name );

	return (
		<PanelBody key={ block.clientId }>
			<div className="yoast-block-sidebar-title">{ sidebarTitle }</div>
			<ul className="yoast-block-suggestions">
				{
					suggestedBlockNames.map( ( blockName: string, index: number ) => {
						const blockType = getBlockType( blockName );

						if ( presentBlockNames.includes( blockName ) ) {
							return <BlockSuggestionAdded key={ index } blockTitle={ blockType.title } />;
						}

						return <BlockSuggestion
							key={ index }
							blockTitle={ blockType.title }
							blockName={ blockName }
							blockClientId={ block.clientId }
						/>;
					} )
				}
			</ul>
		</PanelBody>
	);
}
