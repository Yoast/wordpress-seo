import { mount } from "enzyme";
import * as renderer from "react-test-renderer";
import { BlockInstance, createBlock } from "@wordpress/blocks";
import { BlockPresence } from "../../../src/core/validation/BlockValidationResult";
import { BlockValidation, BlockValidationResult } from "../../../src/core/validation";
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
function createSuggestion( title: string, validation: BlockValidation ): SuggestionDetails {
	return {
		result: validation,
		title,
		// Lots of ignored props from BlockValidationResult
	} as unknown as SuggestionDetails;
}


export type SuggestionDetails = BlockValidationResult & {
	title: string;
}

type SuggestionDto = {
	heading: string;
	parentClientId: string;
	suggestions: SuggestionDetails[];
};


describe( "The required blocks in the sidebar", () => {
	it( "doesn't have the required block being registered as a block", () => {
		const suggestions: SuggestionDetails[] =
		[
			createSuggestion( "yoast/nonexisting", BlockValidation.MissingRequiredBlock ),
		];
		const parentClientId = "parentClientId";

		const actual = PureBlockSuggestionsPresenter( { heading: "Required blocks", parentClientId, suggestions } );

		expect( actual ).toBe( null );
	} );

	it( "renders the required block as an added one", () => {
		const parentClientId = "parentClientId";
		const requiredBlocks = [ "yoast/added-to-content"  ];

		const tree = renderer
			.create( PureBlockSuggestionsPresenter( { heading: "Required blocks", parentClientId, blockNames: requiredBlocks } ) )
			.toJSON();

		expect( tree ).toMatchSnapshot();
	} );

	it( "renders the required block as a non-added one", () => {
		const parentClientId = "parentClientId";
		const requiredBlocks = [ "yoast/non-added-to-content" ];

		const tree = renderer
			.create( PureBlockSuggestionsPresenter( { heading: "Required blocks", parentClientId, blockNames: requiredBlocks } ) )
			.toJSON();

		expect( tree ).toMatchSnapshot();
	} );

	it( "should call the function to add the block when the button is clicked.", () => {
		const parentClientId = "parentClientId";
		const requiredBlocks = [ "yoast/non-added-to-content" ];

		const tree = mount( PureBlockSuggestionsPresenter( { heading: "Required blocks", parentClientId, blockNames: requiredBlocks } )  );

		const addButton = tree.find( "button" ).first();

		addButton.simulate( "click" );

		expect( createBlock ).toHaveBeenCalled();
		expect( insertBlock ).toHaveBeenCalled();
	} );
} );
