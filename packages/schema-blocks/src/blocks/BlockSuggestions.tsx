import { ReactElement } from "react";
import { BlockInstance, createBlock } from "@wordpress/blocks";
import { createElement } from "@wordpress/element";
import { getInnerblocksByName, insertBlock } from "../functions/innerBlocksHelper";
import { getBlockType } from "../functions/BlockHelper";
import { PanelBody } from "@wordpress/components";
import { SuggestedBlockProperties, BlockValidationResult } from "../core/validation";
import { getAllDescendantIssues, getValidationResult } from "../functions/validators";
import { isResultValidForSchema } from "../functions/validators/validateResults";

type BlockSuggestionAddedDto = {
	blockTitle: string;
	isValid: boolean;
}

type BlockSuggestionDto = {
	blockTitle: string;
	blockName: string;
	blockClientId: string;
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
 * Renders a sidebar panel with the required/recommended block names and a button to add a missing block.
 *
 * @param sidebarTitle    The title of the sidebar section.
 * @param block           The block to render the suggestions for.
 * @param suggestedBlocks The required/recommended blocks.
 *
 * @returns The rendered sidebar section with block suggestions.
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
	const validationResult = getValidationResult( block.clientId );

	let validationIssues: BlockValidationResult[] = [];
	if ( validationResult ) {
		validationIssues = getAllDescendantIssues( validationResult );
	}

	return (
		<PanelBody key={ sidebarTitle + block.clientId }>
			<div className="yoast-block-sidebar-title">{ sidebarTitle }</div>
			<ul className="yoast-block-suggestions">
				{
					suggestedBlockNames.map( ( blockName: string, index: number ) => {
						const blockType = getBlockType( blockName );
						const isBlockValid = validationIssues.some( issue => issue.name === blockName && isResultValidForSchema( issue.result ) );

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
