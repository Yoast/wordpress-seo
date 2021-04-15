import { BlockInstance, createBlock } from "@wordpress/blocks";
import * as renderer from "react-test-renderer";
import { mount } from "enzyme";
import BlockSuggestionsPresenter from "../../../src/functions/presenters/BlockSuggestionsPresenter";
import { BlockValidationResult } from "../../../src/core/validation";
import { insertBlock } from "../../../src/functions/innerBlocksHelper";
import { BlockPresence } from "../../../src/core/validation/BlockValidationResult";

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
		getAllDescendantIssues: jest.fn( () => {
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

describe( "The required blocks in the sidebar", () => {
	it( "doesn't have the required block being registered as a block", () => {
		const parentBlock = { innerBlocks: [] } as BlockInstance;
		const requiredBlocks = [ "yoast/nonexisting" ];

		const actual = BlockSuggestionsPresenter( { heading: "Required blocks", parentBlock, suggestedBlockNames: requiredBlocks } );

		expect( actual ).toBe( null );
	} );

	it( "renders the required block as an added one", () => {
		const parentBlock = { innerBlocks: [] } as BlockInstance;
		const requiredBlocks = [ "yoast/added-to-content"  ];

		const tree = renderer
			.create( BlockSuggestionsPresenter( { heading: "Required blocks", parentBlock, suggestedBlockNames: requiredBlocks } ) )
			.toJSON();

		expect( tree ).toMatchSnapshot();
	} );

	it( "renders the required block as a non-added one", () => {
		const parentBlock = { innerBlocks: [] } as BlockInstance;
		const requiredBlocks = [ "yoast/non-added-to-content" ];

		const tree = renderer
			.create( BlockSuggestionsPresenter( { heading: "Required blocks", parentBlock, suggestedBlockNames: requiredBlocks } ) )
			.toJSON();

		expect( tree ).toMatchSnapshot();
	} );

	it( "should call the function to add the block when the button is clicked.", () => {
		const parentBlock = { innerBlocks: [], clientId: "1" } as BlockInstance;
		const requiredBlocks = [ "yoast/non-added-to-content" ];

		const tree = mount( BlockSuggestionsPresenter( { heading: "Required blocks", parentBlock, suggestedBlockNames: requiredBlocks } )  );

		const addButton = tree.find( "button" ).first();

		addButton.simulate( "click" );

		expect( createBlock ).toHaveBeenCalled();
		expect( insertBlock ).toHaveBeenCalled();
	} );
} );
