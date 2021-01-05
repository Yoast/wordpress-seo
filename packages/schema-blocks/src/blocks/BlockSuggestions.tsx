import { ReactElement } from "react";
import { BlockInstance, createBlock } from "@wordpress/blocks";
import { createElement } from "@wordpress/element";
import { getInnerblocksByName, insertBlock } from "../functions/innerBlocksHelper";
import { getBlockType } from "../functions/BlockHelper";
import { PanelBody } from "@wordpress/components";

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
 * Renders a list with the required block names and an button to add/remove one.
 *
 * @param {string} sidebarTitle The title of the sidebar section.
 * @param {BlockInstance} block The block to render the list for.
 * @param {string[]} blockNames The required blocks.
 *
 * @returns {ReactElement} The rendered block.
 */
export default function BlockSuggestions( sidebarTitle: string, block: BlockInstance, blockNames: string[] ): ReactElement {
	const knownBlockNames = blockNames
		.filter( name => typeof getBlockType( name ) !== "undefined" );

	// When there are no known blocks, just return.
	if ( knownBlockNames.length === 0 ) {
		return null;
	}

	const presentBlocks = getInnerblocksByName( block, knownBlockNames ).map( presentBlock => presentBlock.name );

	return (
		<PanelBody>
			<div className="yoast-block-sidebar-title">{ sidebarTitle }</div>
			<ul className="yoast-block-suggestions">
				{
					knownBlockNames.map( ( blockName: string, index: number ) => {
						const blockType = getBlockType( blockName );

						if ( presentBlocks.includes( blockName ) ) {
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
