import { ReactElement } from "react";
import { BlockInstance, createBlock } from "@wordpress/blocks";
import { PanelBody } from "@wordpress/components";
import { createElement } from "@wordpress/element";

import { getBlockType } from "../BlockHelper";
import { getInnerblocksByName, insertBlock } from "../innerBlocksHelper";

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
		<li className="yoast-block-suggestion" key={ blockTitle }>
			{ blockTitle }
			<button className="yoast-block-suggestion-button" onClick={ addBlockClick }> Add </button>
		</li>
	);
}

/**
 * Renders a block suggestion that has already been added.
 *
 * @param {string} blockTitle The block title.
 *
 * @returns {ReactElement} The rendered element.
 */
function BlockSuggestionAdded( { blockTitle }: BlockSuggestionAddedDto ): ReactElement {
	const heroIconCheck: JSX.Element =
		<svg
			xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="-2 3 18 16" stroke="currentColor"
			height="12" width="22"
		>
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2.5 } d="M5 13l4 4L19 7" />
		</svg>;

	return (
		<li className="yoast-block-suggestion yoast-block-suggestion--added" key={ "BlockSuggestionAdded" + blockTitle }>
			{ blockTitle }
			<span className="yoast-block-suggestion-checkmark">{ heroIconCheck }</span>
		</li>
	);
}

/**
 * Renders a list of suggested blocks.
 *
 * @param props The props.
 *
 * @returns The block suggestions element.
 */
export default function BlockSuggestionsPresenter( { title, block, suggestions }: BlockSuggestionsProps ) {
	const suggestedBlockNames = suggestions
		.filter( suggestedBlock => typeof getBlockType( suggestedBlock ) !== "undefined" );

	// When there are no suggestions, just return.
	if ( suggestedBlockNames.length === 0 ) {
		return null;
	}

	const findPresentBlocks = getInnerblocksByName( block, suggestedBlockNames );
	const presentBlockNames = findPresentBlocks.map( presentBlock => presentBlock.name );

	return (
		<PanelBody key={ title + block.clientId }>
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
