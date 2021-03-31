import { BlockInstance, createBlock } from "@wordpress/blocks";
import { getBlockType } from "../BlockHelper";
import { getInnerblocksByName, insertBlock } from "../innerBlocksHelper";
import { PanelBody } from "@wordpress/components";
import { createElement } from "@wordpress/element";
import { ReactElement } from "react";

type BlockSuggestionAddedDto = {
	blockTitle: string;
}

type BlockSuggestionDto = {
	blockTitle: string;
	blockName: string;
	blockClientId: string;
}

interface BlockSuggestionsProps {
	title: string;
	block: BlockInstance;
	suggestions: string[];
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

export default function BlockSuggestions( { title, block, suggestions }: BlockSuggestionsProps ) {
	const suggestedBlockNames = suggestions
		.filter( suggestedBlock => typeof getBlockType( suggestedBlock ) !== "undefined" )
		.map( suggestedBlock => suggestedBlock );

	// When there are no suggestions, just return.
	if ( suggestedBlockNames.length === 0 ) {
		return null;
	}

	const findPresentBlocks = getInnerblocksByName( block, suggestedBlockNames );
	const presentBlockNames = findPresentBlocks.map( presentBlock => presentBlock.name );

	return (
		<PanelBody key={ block.clientId }>
			<div className="yoast-block-sidebar-title">{ title }</div>
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
