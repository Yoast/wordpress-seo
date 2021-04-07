import { BlockInstance, createBlock } from "@wordpress/blocks";
import * as renderer from "react-test-renderer";
import { mount } from "enzyme";
import { BlockValidationResult, RequiredBlock } from "../../src/core/validation";
import BlockSuggestions from "../../src/blocks/BlockSuggestions";
import { insertBlock } from "../../src/functions/innerBlocksHelper";
import { BlockPresence } from "../../src/core/validation/BlockValidationResult";

jest.mock( "@wordpress/blocks", () => {
	return {
		createBlock: jest.fn(),
	};
} );

jest.mock( "../../src/functions/validators", () => {
	return {
		getValidationResult: jest.fn( () => {
			return new BlockValidationResult( "1", "yoast/valid-block", -1, BlockPresence.Required, "Is not that present" );
		} ),
		getAllDescendantIssues: jest.fn( () => {
			return [
				new BlockValidationResult( "123", "yoast/added-to-content-valid", 1, BlockPresence.Required, "Is present" ),
			];
		} ),
	};
} );

jest.mock( "../../src/functions/BlockHelper", () => {
	return {
		getBlockType: jest.fn( ( blockName: string )  => {
			if ( blockName === "yoast/nonexisting" ) {
				// eslint-disable-next-line no-undefined
				return undefined;
			}

			return {
				title: "The required block",
			};
		} ),
	};
} );

jest.mock( "../../src/functions/innerBlocksHelper", () => {
	return {
		insertBlock: jest.fn(),
		getInnerblocksByName: jest.fn( ()  => {
			return [
				{
					name: "yoast/added-to-content",
				},
			];
		} ),
	};
} );

describe( "The required blocks in the sidebar", () => {
	it( "doesn't have the required block being registered as a block", () => {
		const block = { innerBlocks: [] } as BlockInstance;
		const requiredBlocks = [
			{
				name: "yoast/nonexisting",
				option: "One",
			} as RequiredBlock,
		];

		const actual = BlockSuggestions( "Required blocks", block, requiredBlocks );

		expect( actual ).toBe( null );
	} );

	it( "renders the required block as an added one", () => {
		const block = { clientId: "1", innerBlocks: [] } as BlockInstance;
		const requiredBlocks = [
			{
				name: "yoast/added-to-content",
				option: "One",
			} as RequiredBlock,
			{
				name: "yoast/added-to-content-valid",
				option: "One",
			} as RequiredBlock,
		];

		const tree = renderer
			.create( BlockSuggestions( "Required blocks", block, requiredBlocks ) )
			.toJSON();

		expect( tree ).toMatchSnapshot();
	} );

	it( "renders the required block as a non-added one", () => {
		const block = { innerBlocks: [] } as BlockInstance;
		const requiredBlocks = [
			{
				name: "yoast/non-added-to-content",
				option: "One",
			} as RequiredBlock,
		];

		const tree = renderer
			.create( BlockSuggestions( "Required blocks", block, requiredBlocks ) )
			.toJSON();

		expect( tree ).toMatchSnapshot();
	} );

	it( "should call the function to add the block when the button is clicked.", () => {
		const block = { innerBlocks: [], clientId: "1" } as BlockInstance;
		const requiredBlocks = [
			{
				name: "yoast/non-added-to-content",
				option: "One",
			} as RequiredBlock,
		];

		const tree = mount( BlockSuggestions( "Required blocks", block, requiredBlocks ) );

		const addButton = tree.find( "button" ).first();

		addButton.simulate( "click" );

		expect( createBlock ).toHaveBeenCalled();
		expect( insertBlock ).toHaveBeenCalled();
	} );
} );
