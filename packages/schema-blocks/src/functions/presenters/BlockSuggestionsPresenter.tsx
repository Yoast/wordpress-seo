import { get } from "lodash";
import { YOAST_SCHEMA_BLOCKS_STORE_NAME } from "../redux";
import { ReactElement } from "react";
import { createBlock } from "@wordpress/blocks";
import { withSelect } from "@wordpress/data";
import { createElement } from "@wordpress/element";
import { insertBlock } from "../innerBlocksHelper";
import { isEmptyResult, isMissingResult, isValidResult } from "../validators/validateResults";
import { BlockValidationResult } from "../../core/validation";
import logger from "../logger";

type BlockSuggestionAddedProps = {
	blockTitle: string;
	isValid: boolean;
}

type BlockSuggestionProps = {
	suggestedBlockTitle: string;
	suggestedBlockName: string;
}

export type SuggestionDetails = BlockValidationResult & {
	title: string;
}

export interface BlockSuggestionsProps {
	heading: string;
	blockNames: string[];
}

export interface SuggestionsProps extends BlockSuggestionsProps {
	suggestions: SuggestionDetails[];
}

/**
 * Renders a block suggestion with the possibility to add one.
 *
 * @param blockTitle          The title to show.
 * @param suggestedBlockName  The name of the block to add.
 *
 * @returns The rendered block suggestion.
 */
function BlockSuggestion( { suggestedBlockTitle, suggestedBlockName }: BlockSuggestionProps ): ReactElement {
	/**
	 * Onclick handler for the remove block.
	 */
	const addBlockClick = () => {
		const blockToAdd = createBlock( suggestedBlockName );
		insertBlock( blockToAdd );
	};
	return (
		<li className="yoast-block-suggestion" key={ suggestedBlockTitle }>
			{ suggestedBlockTitle }
			{ /* eslint-disable-next-line react/jsx-no-bind */ }
			<button className="yoast-block-suggestion-button" onClick={ addBlockClick }> Add </button>
		</li>
	);
}

/**
 * Renders a block suggestion that has already been added.
 *
 * @param blockTitle The block title.
 * @param isValid    Is the added block valid.
 *
 * @returns The rendered element.
 */
function BlockSuggestionAdded( { blockTitle, isValid }: BlockSuggestionAddedProps ): ReactElement {
	const heroIconCheck = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="-2 3 18 16" stroke="currentColor" height="12" width="22">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2.5 } d="M5 13l4 4L19 7" />
	</svg>;

	const checkmark = <span className="yoast-block-suggestion-checkmark">{ heroIconCheck }</span>;

	return (
		<li className="yoast-block-suggestion yoast-block-suggestion--added" key={ "BlockSuggestionAdded" + blockTitle }>
			{ blockTitle }
			{ isValid ? checkmark : null }
		</li>
	);
}

/**
 * Renders a list of block suggestions.
 * @param props The BlockValidationResults and the Blocks' titles.
 * @returns The appropriate Block Suggestion elements.
 */
export function PureBlockSuggestionsPresenter( { heading, suggestions, blockNames }: SuggestionsProps ): ReactElement {
	if ( ! suggestions || suggestions.length < 1 || ! blockNames || blockNames.length < 1 ) {
		return null;
	}

	return (
		<div>
			<div className="yoast-block-sidebar-title">{ heading }</div>
			<ul className="yoast-block-suggestions">
				{
					blockNames.map( ( blockName, index: number ) => {
						const suggestion = suggestions.find( sug => sug.name === blockName );

						const isValid = suggestion && isValidResult( suggestion.result );
						const isMissing = suggestion && isMissingResult( suggestion.result );
						const isEmpty = suggestion && isEmptyResult( suggestion.result );

						if ( isValid || isEmpty ) {
							// Show the validation result.
							return <BlockSuggestionAdded
								key={ index }
								isValid={ isValid }
								blockTitle={ suggestion.title }
							/>;
						}

						if ( isMissing ) {
							// Show the suggestion to add an instance of this block.
							return <BlockSuggestion
								key={ index }
								suggestedBlockTitle={ suggestion.title }
								suggestedBlockName={ suggestion.name }
							/>;
						}

						logger.debug( "No use case for block ", blockName );
					}, this )
				}
			</ul>
		</div>
	);
}

/**
 * Appends metadata to validation results retrieved from the store.
 *
 * @param props The props containing the blockNames we're interested in.
 *
 * @returns The props extended with suggestion data.
 */
export default withSelect<Partial<SuggestionsProps>, BlockSuggestionsProps, SuggestionsProps>( ( select, props: BlockSuggestionsProps ) => {
	const validations: BlockValidationResult[] =
		select( YOAST_SCHEMA_BLOCKS_STORE_NAME ).getValidationsForBlockNames( props.blockNames );

	const suggestionDetails = validations.map( validation => {
		const type = select( "core/blocks" ).getBlockType( validation.name );
		return {
			title: get( type, "title", "" ),
			...validation,
		};
	} );

	// The return object also includes properties from props.
	return {
		suggestions: suggestionDetails,
	};
} )( PureBlockSuggestionsPresenter );
