import "../../../matchMedia.mock";
import { BlockInstance, createBlock } from "@wordpress/blocks";
import { dispatch } from "@wordpress/data";
import warningWatcher from "../../../../src/functions/gutenberg/watchers/warningWatcher";
import InnerBlocks from "../../../../src/instructions/blocks/InnerBlocks";
import { getBlockDefinition } from "../../../../src/core/blocks/BlockDefinitionRepository";
import { RequiredBlock, RequiredBlockOption } from "../../../../src/core/validation";

jest.mock( "@wordpress/i18n", () => ( {
	__: jest.fn( text => text ),
	sprintf: jest.fn( ( text, value, value2, value3 ) => {
		text = text.replace( "%1$s", value );
		text = text.replace( "%2$s", value2 );
		text = text.replace( "%3$s", value3 );

		return text;
	} ),
} ) );

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
	withSelect: jest.fn( () => jest.fn() ),
} ) );

jest.mock( "@wordpress/components", () => {
	return {
		PanelBody: jest.fn(),
	};
} );

jest.mock( "@yoast/components", () => {
	return {
		SvgIcon: jest.fn(),
	};
} );

( window as any ).yoastSchemaBlocks = {
	requiredLink: "https://yoa.st/required-fields",
	recommendedLink: "https://yoa.st/recommended-fields",
};

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

		// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
		// @ts-ignore -- This is mocked function, the original function does not have this method so TS complains.
		getBlockDefinition.mockReturnValueOnce( {
			instructions: {
				32: new InnerBlocks( 32, {
					name: "anyBlock",
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
				warningText: "You've just removed the ‘Ingredients’ block, but this is a " +
					"<a href=\"https://yoa.st/required-fields\" target=\"_blank\">required block for Schema output</a>. " +
					"Without this block no Schema will be generated. Are you sure you want to do this?",
			},
		);
		expect( dispatch ).toBeCalled();
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

		// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
		// @ts-ignore 2339 -- This is a mocked function, the original class does not have this method, so TS complains.
		getBlockDefinition.mockReturnValue( {
			instructions: {
				32: new InnerBlocks( 32, {
					name: "anyBlock",
					recommendedBlocks: [
						{
							name: "yoast/ingredients",
						},
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
				// eslint-disable-next-line max-len
				warningText: "You've just removed the ‘Ingredients’ block, but this is a " +
					"<a href=\"https://yoa.st/recommended-fields\" target=\"_blank\">recommended block for Schema output</a>. " +
					"Are you sure you want to do this?",
			},
		);
		expect( dispatch ).toBeCalled();
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

		// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
		// @ts-ignore -- This is mocked function, the original function does not have this method so TS complains.
		getBlockDefinition.mockReturnValue( null );

		warningWatcher( blocks, previousBlocks );
	} );
} );
