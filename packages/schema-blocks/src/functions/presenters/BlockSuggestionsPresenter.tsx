import { ReactElement } from "react";
import { BlockInstance, createBlock } from "@wordpress/blocks";
import { PanelBody } from "@wordpress/components";
import { BlockPresence, BlockValidation, BlockValidationResult } from "../../core/validation";
import { getValidationResult } from "../validators";
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
 * Finds a blockInstance's validation result in a tree of validation results based on the block's clientId.
 * @param clientId The ClientId of the block you want validation results for.
 * @param validationResults The ValidationResult tree to investigate.
 * @returns The BlockValidationResult matching the clientId or null if none were found.
 */
function GetValidationForClientId( clientId: string, validationResults: BlockValidationResult[] ): BlockValidationResult {
	for ( const validationResult of validationResults ) {
		// When the validation result matches the client id. Just return it.
		if ( validationResult.clientId === clientId ) {
			return validationResult;
		}

		// Just keep it calling until we have found a result.
		if ( validationResult.issues.length > 0 ) {
			const validation = GetValidationForClientId( clientId, validationResult.issues );
			if ( validation ) {
				return validation;
			}
		}
	}

	return null;
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
	const validationResult = getValidationResult( parentBlock.clientId );
	let validationIssues: BlockValidationResult[] = [];
	if ( validationResult ) {
		validationIssues = validationResult.issues;
	}

	return (
		<PanelBody key={ heading + parentBlock.clientId }>
			<div className="yoast-block-sidebar-title">{ heading }</div>
			<ul className="yoast-block-suggestions">
				{
					filteredSuggestedBlockNames.map( ( suggestedBlockName: string, index: number ) => {
						const suggestedBlockType = getBlockType( suggestedBlockName );
						const existingBlock = presentBlocks.find( block => block.name === suggestedBlockName );
						if ( existingBlock ) {
							const validation = GetValidationForClientId( existingBlock.clientId, validationIssues ) ||
								new BlockValidationResult(
									existingBlock.clientId,
									existingBlock.name,
									BlockValidation.Unknown,
									BlockPresence.Unknown );

							const isTheBlockValid = isValidResult( validation.result );
							return <BlockSuggestionAdded
								key={ index }
								isValid={ isTheBlockValid }
								suggestedBlockTitle={ suggestedBlockType.title }
							/>;
						}

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
