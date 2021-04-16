import { ReactElement } from "react";
import { BlockInstance, createBlock } from "@wordpress/blocks";
import { PanelBody } from "@wordpress/components";
import { getValidationResults, getValidationResultForClientId } from "../validators";
import { createElement } from "@wordpress/element";
import { getBlockType } from "../BlockHelper";
import { getInnerblocksByName, insertBlock } from "../innerBlocksHelper";
import { isValidResult } from "../validators/validateResults";

type BlockSuggestionAddedDto = {
	suggestedBlockTitle: string;
	isValid: boolean;
}

type BlockSuggestionDto = {
	suggestedBlockTitle: string;
	suggestedBlockName: string;
	parentBlockClientId: string;
}

interface BlockSuggestionsProps {
	heading: string;
	parentBlock: BlockInstance;
	suggestedBlockNames: string[];
}

/**
 * Renders a block suggestion with the possibility to add one.
 *
 * @param blockTitle          The title to show.
 * @param suggestedBlockName  The name of the block to add.
 * @param parentBlockClientId The clientId of the target to add the block to.
 *
 * @returns The rendered block suggestion.
 */
function BlockSuggestion( { suggestedBlockTitle, suggestedBlockName, parentBlockClientId }: BlockSuggestionDto ): ReactElement {
	/**
	 * Onclick handler for the remove block.
	 */
	const addBlockClick = () => {
		const blockToAdd = createBlock( suggestedBlockName );
		insertBlock( blockToAdd, parentBlockClientId );
	};
	return (
		<li className="yoast-block-suggestion" key={ suggestedBlockTitle }>
			{ suggestedBlockTitle }
			<button className="yoast-block-suggestion-button" onClick={ addBlockClick }> Add </button>
		</li>
	);
}
/**
 * Renders a block suggestion that has already been added.
 *
 * @param suggestedBlockTitle The block title.
 * @param isValid             Is the added block valid.
 *
 * @returns The rendered element.
 */
function BlockSuggestionAdded( { suggestedBlockTitle, isValid }: BlockSuggestionAddedDto ): ReactElement {
	const heroIconCheck = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="-2 3 18 16" stroke="currentColor" height="12" width="22">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2.5 } d="M5 13l4 4L19 7" />
	</svg>;
	return (
		<li className="yoast-block-suggestion yoast-block-suggestion--added" key={ "BlockSuggestionAdded" + suggestedBlockTitle }>
			{ suggestedBlockTitle }
			{ isValid &&
			<span className="yoast-block-suggestion-checkmark">{ heroIconCheck }</span>
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
export default function BlockSuggestionsPresenter( { heading, parentBlock, suggestedBlockNames }: BlockSuggestionsProps ) {
	// Filters all suggested blocks that doesn't have a blockType registered.
	const filteredSuggestedBlockNames = suggestedBlockNames
		.filter( suggestedBlock => typeof getBlockType( suggestedBlock ) !== "undefined" );

	// When there are no suggestions, just return.
	if ( filteredSuggestedBlockNames.length === 0 ) {
		return null;
	}

	const presentBlocks = getInnerblocksByName( parentBlock, filteredSuggestedBlockNames );
	const validationResults = getValidationResults();

	return (
		<PanelBody key={ heading + parentBlock.clientId }>
			<div className="yoast-block-sidebar-title">{ heading }</div>
			<ul className="yoast-block-suggestions">
				{
					filteredSuggestedBlockNames.map( ( suggestedBlockName: string, index: number ) => {
						const suggestedBlockType = getBlockType( suggestedBlockName );

						const existingBlock = presentBlocks.find( block => block.name === suggestedBlockName );
						if ( existingBlock ) {
							// Find the validation result for this block.
							const validation = getValidationResultForClientId( existingBlock.clientId, validationResults );
							// If the validation was found, and it is completely OK, we will add a check mark.
							const isTheBlockValid = validation && isValidResult( validation.result );

							// Show the validation result.
							return <BlockSuggestionAdded
								key={ index }
								isValid={ isTheBlockValid }
								suggestedBlockTitle={ suggestedBlockType.title }
							/>;
						}

						// Show the suggestion to add an instance of this block.
						return <BlockSuggestion
							key={ index }
							suggestedBlockTitle={ suggestedBlockType.title }
							suggestedBlockName={ suggestedBlockName }
							parentBlockClientId={ parentBlock.clientId }
						/>;
					} )
				}
			</ul>
		</PanelBody>
	);
}
