import "../../../matchMedia.mock";

import { BlockInstance, createBlock } from "@wordpress/blocks";
import { dispatch } from "@wordpress/data";

import warningWatcher from "../../../../src/functions/gutenberg/watchers/warningWatcher";
import InnerBlocks from "../../../../src/instructions/blocks/InnerBlocks";
import { RequiredBlock } from "../../../../src/instructions/blocks/dto";
import { RequiredBlockOption } from "../../../../src/instructions/blocks/enums";
import { getBlockDefinition } from "../../../../src/core/blocks/BlockDefinitionRepository";

jest.mock( "@wordpress/block-editor", () => ( {
	InnerBlocks: {},
} ) );

jest.mock( "../../../../src/core/blocks/BlockDefinitionRepository", () => ( {
	getBlockDefinition: jest.fn(),
} ) );

jest.mock( "@wordpress/blocks", () => ( {
	createBlock: jest.fn( ( name, attributes ) => {
		return {
			name,
			clientId: "abcde-12345",
			attributes,
			innerBlocks: [],
		};
	} ),
} ) );

jest.mock( "../../../../src/functions/BlockHelper", () => ( {
	getBlockType: jest.fn( () => ( { title: "Ingredients" } ) ),
} ) );

jest.mock( "@wordpress/data", () => ( {
	dispatch: jest.fn( () => ( {
		insertBlock: jest.fn(),
	} ) ),
} ) );

jest.mock( "@wordpress/components", () => {
	return {
		PanelBody: jest.fn(),
	};
} );

describe( "The warning watcher", () => {
	it( "adds warnings when required blocks are removed", () => {
		const previousBlocks = [
			{
				name: "yoast/recipe",
				clientId: "1234-abcd",
				innerBlocks: [
					{
						name: "yoast/ingredients",
						clientId: "5678-efgh",
						innerBlocks: [],
					} as BlockInstance,
				],
			} as BlockInstance,
		];

		const blocks = [
			{
				name: "yoast/recipe",
				clientId: "1234-abcd",
				innerBlocks: [],
			} as BlockInstance,
		];

		// @ts-ignore -- This is mocked function, the original function does not have this method so TS complains.
		getBlockDefinition.mockReturnValue( {
			instructions: {
				32: new InnerBlocks( 32, {
					requiredBlocks: [
						{ name: "yoast/ingredients", option: RequiredBlockOption.One } as RequiredBlock,
					],
					warnings: {
						"yoast/ingredients": "a warning",
					},
				} ),
			},
		} );

		warningWatcher( blocks, previousBlocks );

		// We expect that one warning is created for the removed ingredients block.
		expect( createBlock ).toBeCalledWith(
			"yoast/warning-block",
			{
				isRequired: true,
				removedBlock: {
					clientId: "5678-efgh",
					innerBlocks: [],
					name: "yoast/ingredients",
				},
				warningText: "You've just removed the ‘Ingredients’ block, but this is a required block for Schema output.\n" +
					"Without this block no Schema will be generated. Do you want this?",
			},
		);
		expect( dispatch ).toBeCalledTimes( 1 );
	} );

	it( "adds warnings when recommended blocks are removed", () => {
		const previousBlocks = [
			{
				name: "yoast/recipe",
				clientId: "1234-abcd",
				innerBlocks: [
					{
						name: "yoast/ingredients",
						clientId: "5678-efgh",
						innerBlocks: [],
					} as BlockInstance,
				],
			} as BlockInstance,
		];

		const blocks = [
			{
				name: "yoast/recipe",
				clientId: "1234-abcd",
				innerBlocks: [],
			} as BlockInstance,
		];

		// @ts-ignore -- This is mocked function, the original function does not have this method so TS complains.
		getBlockDefinition.mockReturnValue( {
			instructions: {
				32: new InnerBlocks( 32, {
					recommendedBlocks: [
						"yoast/ingredients",
					],
				} ),
			},
		} );

		warningWatcher( blocks, previousBlocks );

		// We expect that one warning is created for the removed ingredients block.
		expect( createBlock ).toBeCalledWith(
			"yoast/warning-block",
			{
				isRequired: false,
				removedBlock: {
					clientId: "5678-efgh",
					innerBlocks: [],
					name: "yoast/ingredients",
				},
				warningText: "You've just removed the ‘Ingredients’ block, but this is a recommended block for Schema output. Do you want this?",
			},
		);
		expect( dispatch ).toBeCalledTimes( 2 );
	} );

	it( "does not add any warnings when no blocks have been removed", () => {
		const previousBlocks = [
			{
				name: "yoast/recipe",
				clientId: "1234-abcd",
				innerBlocks: [
					{
						name: "yoast/ingredients",
						clientId: "5678-efgh",
						innerBlocks: [],
					} as BlockInstance,
				],
			} as BlockInstance,
		];

		// Just copy the array.
		const blocks = Array.from( previousBlocks );

		warningWatcher( blocks, previousBlocks );
	} );

	it( "does not add any warnings when no block definition is found", () => {
		const previousBlocks = [
			{
				name: "yoast/recipe",
				clientId: "1234-abcd",
				innerBlocks: [
					{
						name: "yoast/ingredients",
						clientId: "5678-efgh",
						innerBlocks: [],
					} as BlockInstance,
				],
			} as BlockInstance,
		];

		const blocks = [
			{
				name: "yoast/recipe",
				clientId: "1234-abcd",
				innerBlocks: [],
			} as BlockInstance,
		];

		// @ts-ignore -- This is mocked function, the original function does not have this method so TS complains.
		getBlockDefinition.mockReturnValue( null );

		warningWatcher( blocks, previousBlocks );
	} );
} );
