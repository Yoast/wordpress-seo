import { ReactElement } from "react";
import { BlockInstance, createBlock } from "@wordpress/blocks";
import { PanelBody } from "@wordpress/components";
import { BlockValidationResult } from "../../core/validation";
import { getAllDescendantIssues, getValidationResult } from "../validators";
import { isValidResult } from "../validators/validateResults";
import { createElement } from "@wordpress/element";

import { getBlockType } from "../BlockHelper";
import { getInnerblocksByName, insertBlock } from "../innerBlocksHelper";

type BlockSuggestionAddedDto = {
	blockTitle: string;
	isValid: boolean;
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
 * @param blockTitle    The title to show.
 * @param blockName     The name of the block to add.
 * @param blockClientId The clientId of the target to add the block to.
 *
 * @returns The rendered block suggestion.
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
 * Renders a block suggestion that is already added
 *
 * @param blockTitle The block title.
 * @param isValid    Is the added block valid.
 *
 * @returns The rendered element.
 */
function BlockSuggestionAdded( { blockTitle, isValid }: BlockSuggestionAddedDto ): ReactElement {
	return (
		<li className="yoast-block-suggestion yoast-block-suggestion--added" key={ "BlockSuggestionAdded" + blockTitle }>
			{ blockTitle }
			{ isValid &&
				<span className="yoast-block-suggestion-checkmark"> OK </span>
			}
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
	const validationResult = getValidationResult( block.clientId );

	let validationIssues: BlockValidationResult[] = [];
	if ( validationResult ) {
		validationIssues = getAllDescendantIssues( validationResult );
	}

	return (
		<PanelBody key={ title + block.clientId }>
			<div className="yoast-block-sidebar-title">{ title }</div>
			<ul className="yoast-block-suggestions">
				{
					suggestedBlockNames.map( ( blockName: string, index: number ) => {
						const blockType = getBlockType( blockName );
						const isBlockValid = validationIssues.some( issue => issue.name === blockName && isValidResult( issue.result ) );

						if ( presentBlockNames.includes( blockName ) ) {
							return <BlockSuggestionAdded
								key={ index }
								isValid={ isBlockValid }
								blockTitle={ blockType.title }
							/>;
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
