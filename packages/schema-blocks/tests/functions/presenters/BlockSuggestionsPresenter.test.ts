import "../../matchMedia.mock";
import { mount } from "enzyme";
import * as renderer from "react-test-renderer";
import { createBlock } from "@wordpress/blocks";
import { BlockValidation, BlockValidationResult, BlockPresence } from "../../../src/core/validation";
import { PureBlockSuggestionsPresenter, SuggestionDetails, SuggestionsProps } from "../../../src/functions/presenters/BlockSuggestionsPresenter";
import { insertBlock } from "../../../src/functions/innerBlocksHelper";

jest.mock( "@wordpress/blocks", () => {
	return {
		createBlock: jest.fn(),
	};
} );

jest.mock( "../../../src/functions/validators", () => {
	return {
		getValidationResults: jest.fn( () => {
			return new BlockValidationResult( "1", "yoast/valid-block", -1, BlockPresence.Required, "Is not that present" );
		} ),
		getValidationResultForClientId: jest.fn( () => {
			return [
				new BlockValidationResult( "123", "yoast/added-to-content-valid", 1, BlockPresence.Required, "Is present" ),
			];
		} ),
	};
} );

jest.mock( "../../../src/functions/BlockHelper", () => {
	return {
		getBlockType: jest.fn( ( blockName: string )  => {
			if ( blockName === "yoast/nonexisting" ) {
				// eslint-disable-next-line no-undefined
				return undefined;
			}

			return {
				heading: "The required block",
			};
		} ),
		getHumanReadableBlockName: jest.fn( ( name: string ) => name ),
	};
} );

jest.mock( "../../../src/functions/innerBlocksHelper", () => {
	return {
		insertBlock: jest.fn(),
		getInnerblocksByName: jest.fn( ()  => {
			return [
				{
					name: "yoast/added-to-content",
					clientId: "existingBlockClientId",
				},
			];
		} ),
	};
} );

/**
 * Creates a mockery of a SuggestionDetails object
 * @param title      The Validated Block's title.
 * @param validation The validation result.
 * @returns Most of a SuggestionDetails object.
 */
function createSuggestion( title: string, validation: BlockValidationResult ): SuggestionDetails {
	const suggestion = ( validation as unknown as SuggestionDetails );
	suggestion.title = title;
	return suggestion;
}

describe( "The BlockSuggestionsPresenter class ", () => {
	it( "displays an [ Add ] link for missing required blocks", () => {
		// Arrange.
		const suggestion: SuggestionsProps = {
			heading: "Heading for Required Blocks",
			suggestions: [
				createSuggestion(
					"This is a missing block",
					new BlockValidationResult( null, "yoast/requiredBlock", BlockValidation.MissingRequiredBlock, BlockPresence.Required, null ),
				),
			],
			blockNames: [ "yoast/requiredBlock" ],
		};

		// Act.
		const tree = renderer
			.create( PureBlockSuggestionsPresenter( suggestion ) )
			.toJSON();

		// Assert.
		expect( tree ).toMatchSnapshot();
	} );

	it( "displays only the block title for blocks that aren't completed", () => {
		// Arrange.
		const suggestion: SuggestionsProps = {
			heading: "Heading for Required Blocks",
			suggestions: [
				createSuggestion(
					"This is an invalid required block without checkmark or add link",
					new BlockValidationResult( null, "yoast/requiredBlock", BlockValidation.MissingRequiredAttribute, BlockPresence.Required, null ),
				),
			],
			blockNames: [ "yoast/requiredBlock" ],
		};

		// Act.
		const tree = renderer
			.create( PureBlockSuggestionsPresenter( suggestion ) )
			.toJSON();

		// Assert.
		expect( tree ).toMatchSnapshot();
	} );

	it( "displays a checkmark for valid blocks", () => {
		// Arrange.
		const suggestion: SuggestionsProps = {
			heading: "Heading for Required Blocks",
			suggestions: [
				createSuggestion(
					"This is a valid required block with checkmark without add link",
					new BlockValidationResult( null, "yoast/requiredBlock", BlockValidation.Valid, BlockPresence.Required, null ),
				),
			],
			blockNames: [ "yoast/requiredBlock" ],
		};

		// Act.
		const tree = renderer
			.create( PureBlockSuggestionsPresenter( suggestion ) )
			.toJSON();

		// Assert.
		expect( tree ).toMatchSnapshot();
	} );

	it( "displays no suggestions if no suggestions are provided", () => {
		// Arrange.
		// eslint-disable-next-line max-len
		const suggestions: SuggestionsProps = {
			heading: "Recommended blocks",
			suggestions: [],
			blockNames: [ "yoast/recommendedBlock" ],
		};

		// Act.
		const tree = renderer
			.create( PureBlockSuggestionsPresenter( suggestions ) )
			.toJSON();

		// Assert.
		expect( tree ).toBeNull();
	} );

	it( "displays no suggestions if no blockNames are provided", () => {
		// Arrange.
		// eslint-disable-next-line max-len
		const validation = new BlockValidationResult( null, "yoast/recommendedBlock", BlockValidation.MissingRecommendedBlock, BlockPresence.Required, null );
		const suggestions: SuggestionDetails[] =
		[
			createSuggestion(
				"yoast/recommendedBlock",
				validation,
			),
		];

		// Act.
		const tree = renderer
			.create( PureBlockSuggestionsPresenter( { heading: "Recommended blocks", suggestions } as SuggestionsProps ) )
			.toJSON();

		// Assert.
		expect( tree ).toBeNull();
	} );

	it( "should add the block when the [ Add ] button is clicked.", () => {
		const suggestionsProps =  {
			heading: "Required blocks",
			suggestions: [
				createSuggestion( "yoast/not-added-to-content",
					BlockValidationResult.MissingBlock( "yoast/not-added-to-content", BlockPresence.Required ) ),
			],
			blockNames: [ "yoast/not-added-to-content" ],
		} as SuggestionsProps;

		const tree = mount( PureBlockSuggestionsPresenter( suggestionsProps ) );

		const addButton = tree.find( "button" ).first();

		addButton.simulate( "click" );

		expect( createBlock ).toHaveBeenCalled();
		expect( insertBlock ).toHaveBeenCalled();
	} );
} );
