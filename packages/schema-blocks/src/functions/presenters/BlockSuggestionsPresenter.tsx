import { get } from "lodash";
import { YOAST_SCHEMA_BLOCKS_STORE_NAME } from "../redux";
import { ReactElement } from "react";
import { createBlock } from "@wordpress/blocks";
import { PanelBody } from "@wordpress/components";
import { withSelect } from "@wordpress/data";
import { createElement } from "@wordpress/element";
import { insertBlock } from "../innerBlocksHelper";
import { isMissingResult, isValidResult } from "../validators/validateResults";
import { BlockValidationResult } from "../../core/validation";

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
	parentClientId: string;
	blockNames: string[];
}

export type SuggestionDetails = BlockValidationResult & {
	title: string;
}

type SuggestionDto = {
	heading: string;
	parentClientId: string;
	suggestions: SuggestionDetails[];
};

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
 * Renders a list of block suggestions.
 * @param props The BlockValidationResults and the Blocks' titles.
 * @returns The appropriate Block Suggestion elements.
 */
export function PureBlockSuggestionsPresenter( { heading, parentClientId, suggestions }: SuggestionDto ): ReactElement {
	return (
		<PanelBody key={ heading + parentClientId }>
			<div className="yoast-block-sidebar-title">{ heading }</div>
			<ul className="yoast-block-suggestions">
				{
					suggestions.map( ( suggestion, index: number ) => {
						// If the validation was found, and it is completely OK, we will add a check mark.
						const isValid = suggestion && isValidResult( suggestion.result );
						const isMissing = suggestion && isMissingResult( suggestion.result );

						if ( isMissing ) {
							// Show the suggestion to add an instance of this block.
							return <BlockSuggestion
								key={ index }
								suggestedBlockTitle={ suggestion.title }
								suggestedBlockName={ suggestion.name }
								parentBlockClientId={ parentClientId }
							/>;
						}

						// Show the validation result.
						return <BlockSuggestionAdded
							key={ index }
							isValid={ isValid }
							suggestedBlockTitle={ suggestion.title }
						/>;
					} )
				}
			</ul>
		</PanelBody>
	);
}

/**
 * Renders a list of suggested blocks.
 *
 * @param props The props.
 *
 * @returns The block suggestions element.
 */
export default withSelect<Partial<SuggestionDto>, BlockSuggestionsProps, SuggestionDto>( ( select, props: BlockSuggestionsProps ) => {
	const validations: BlockValidationResult[] =
		select( YOAST_SCHEMA_BLOCKS_STORE_NAME ).getInnerblockValidations( props.parentClientId, props.blockNames );

	const suggestionDetails = validations.map( validation =>  {
		const type = select( "core/blocks" ).getBlockType( validation.name );
		return {
			title: get( type, "title", "" ),
			...validation,
		};
	} );

	return {
		suggestions: suggestionDetails,
	};
} )( PureBlockSuggestionsPresenter );
