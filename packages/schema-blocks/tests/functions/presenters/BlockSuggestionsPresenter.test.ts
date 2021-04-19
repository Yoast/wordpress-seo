import { mount } from "enzyme";
import * as renderer from "react-test-renderer";
import { createBlock } from "@wordpress/blocks";
import { BlockValidation, BlockValidationResult, BlockPresence } from "../../../src/core/validation";
import { PureBlockSuggestionsPresenter } from "../../../src/functions/presenters/BlockSuggestionsPresenter";
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

export type SuggestionDetails = BlockValidationResult & {
	title: string;
}

type SuggestionDto = {
	heading: string;
	parentClientId: string;
	suggestions: SuggestionDetails[];
};


describe( "The BlockSuggestionsPresenter class ", () => {
	it( "displays a suggestion for missing required blocks", () => {
		// Arrange.
		// eslint-disable-next-line max-len
		const validation = new BlockValidationResult( null, "yoast/requiredBlock", BlockValidation.MissingRequiredBlock, BlockPresence.Required, null );
		const suggestions: SuggestionDetails[] =
		[
			createSuggestion(
				"yoast/requiredBlock",
				validation,
			),
		];
		const parentClientId = "parentClientId";

		// Act.
		const tree = renderer
			.create( PureBlockSuggestionsPresenter( { heading: "Required blocks", parentClientId, suggestions } as SuggestionDto ) )
			.toJSON();

		// Assert.
		expect( tree ).toMatchSnapshot();
	} );
} );

describe( "The BlockSuggestionsPresenter class ", () => {
	it( "displays a suggestion for missing recommended blocks", () => {
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
		const parentClientId = "parentClientId";

		// Act.
		const tree = renderer
			.create( PureBlockSuggestionsPresenter( { heading: "Recommended blocks", parentClientId, suggestions } as SuggestionDto ) )
			.toJSON();

		// Assert.
		expect( tree ).toMatchSnapshot();
	} );
} );

describe( "The required blocks section in the sidebar ", () => {
	it( "shows no validation for an unknown block type.", () => {
		const validation = new BlockValidationResult( null, "yoast/nonexisting", BlockValidation.Unknown, BlockPresence.Unknown, null );
		const suggestions: SuggestionDetails[] =
		[
			createSuggestion(
				"yoast/nonexisting",
				validation,
			),
		];
		const parentClientId = "parentClientId";

		const actual = PureBlockSuggestionsPresenter( { heading: "Required blocks", parentClientId, suggestions } as SuggestionDto );

		expect( actual ).toBe( null );
	} );

	it( "renders the required block as an added one", () => {
		const parentClientId = "parentClientId";
		const suggestions = [
			createSuggestion( "yoast/added-to-content", BlockValidationResult.MissingBlock( "yoast/added-to-content", BlockPresence.Required ) ),
		];

		const tree = renderer
			.create( PureBlockSuggestionsPresenter( { heading: "Required blocks", parentClientId, suggestions } as SuggestionDto ) )
			.toJSON();

		expect( tree ).toMatchSnapshot();
	} );

	it( "renders the required block as a non-added one", () => {
		const parentClientId = "parentClientId";
		const suggestions = [
			createSuggestion( "yoast/non-added-to-content",
				BlockValidationResult.MissingBlock( "yoast/non-added-to-content", BlockPresence.Required ) ),
		];

		const tree = renderer
			.create( PureBlockSuggestionsPresenter( { heading: "Required blocks", parentClientId, suggestions } ) )
			.toJSON();

		expect( tree ).toMatchSnapshot();
	} );

	it( "should call the function to add the block when the button is clicked.", () => {
		const parentClientId = "parentClientId";
		const suggestions = [
			createSuggestion( "yoast/non-added-to-content",
				BlockValidationResult.MissingBlock( "yoast/non-added-to-content", BlockPresence.Required ) ),
		];

		const tree = mount( PureBlockSuggestionsPresenter( { heading: "Required blocks", parentClientId, suggestions } )  );

		const addButton = tree.find( "button" ).first();

		addButton.simulate( "click" );

		expect( createBlock ).toHaveBeenCalled();
		expect( insertBlock ).toHaveBeenCalled();
	} );
} );
