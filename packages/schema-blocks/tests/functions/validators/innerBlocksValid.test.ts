import "../../matchMedia.mock";
import { BlockInstance } from "@wordpress/blocks";
import { BlockValidationResult, BlockValidation, RequiredBlock, RequiredBlockOption } from "../../../src/core/validation";
import BlockDefinition from "../../../src/core/blocks/BlockDefinition";
import * as innerBlocksValid from "../../../src/functions/validators/innerBlocksValid";
import * as blockDefinitionRepository from "../../../src/core/blocks/BlockDefinitionRepository";

const mockBlockRegistry: Record<string, BlockDefinition> = {};
const getBlockDefinitionMock = jest.spyOn( blockDefinitionRepository, "getBlockDefinition" );
getBlockDefinitionMock.mockImplementation( ( name: string ) => {
	return mockBlockRegistry[ name ];
} );

/**
 * Add a definition for a block to the mocked block definition.
 * @param name          The name of the block to mock.
 * @param expectedValue The validation output of the block.
 */
function mockDefinition( name: string, expectedValue: BlockValidationResult ) {
	mockBlockRegistry[ name ] = {
		validate: () => [ expectedValue ],
	} as unknown as BlockDefinition;
}

mockDefinition( "validBlock", new BlockValidationResult( "validBlock", BlockValidation.Valid ) );
mockDefinition( "existingBlock", new BlockValidationResult( "existingBlock", BlockValidation.Valid ) );
mockDefinition( "invalidOptionalBlock", new BlockValidationResult( "invalidOptionalBlock", BlockValidation.Optional ) );
mockDefinition( "innerBlock", new BlockValidationResult( "validBlock", BlockValidation.Valid ) );
mockDefinition( "requiredBlock", new BlockValidationResult( "requiredBlock", BlockValidation.Valid ) );
mockDefinition( "redundantBlock", new BlockValidationResult( "redundantBlock", BlockValidation.Valid ) );


const createBlockValidationResultTestArrangement = [
	{ name: "missingblock", reason: BlockValidation.Missing },
	{ name: "redundantblock", reason: BlockValidation.TooMany },
	{ name: "optionalblock", reason: BlockValidation.Optional },
	{ name: "selfinvalidatedblock", reason: BlockValidation.Internal },
];

const createOptionalBlockValidationTestArrangement = [
	{ reason: BlockValidation.Missing,  expected: false },
	{ reason: BlockValidation.TooMany,  expected: false },
	{ reason: BlockValidation.Internal, expected: false },
	{ reason: BlockValidation.Optional, expected: true },
];

describe( "The BlockValidationResult constructor", () => {
	for ( let i = 0; i < createBlockValidationResultTestArrangement.length; i++ ) {
		const input = createBlockValidationResultTestArrangement[ i ];
		it( "creates a BlockValidationResult instance with name " + input.name + " and reason " + input.reason + ".", () => {
			const result = new BlockValidationResult( input.name, input.reason );
			expect( result.name ).toEqual( input.name );
			expect( result.result ).toEqual( input.reason );
		} );
	}
} );

describe( "The isOptional function", () => {
	for ( let i = 0; i < createOptionalBlockValidationTestArrangement.length; i++ ) {
		const input = createOptionalBlockValidationTestArrangement[ i ];
		it( "verifies that reason " + input.reason + " is " + ( input.expected ? "" : "not " ) + "optional.", () => {
			const result = innerBlocksValid.isOptional( input.reason );
			expect( result ).toBe( input.expected );
		} );
	}
} );

describe( "The findMissingBlocks function", () => {
	it( "creates an BlockValidationResult with and reason 'missing' when a required block is missing.", () => {
		// Arrange.
		const requiredBlocks: RequiredBlock[] = [
			{
				name: "existingBlock",
				option: RequiredBlockOption.Multiple,
			} as RequiredBlock,
			{
				name: "missingblock",
				option: RequiredBlockOption.Multiple,
			} as RequiredBlock,
		];
		const existingRequiredBlocks: BlockInstance[] = [
			{
				name: "existingBlock",
			} as BlockInstance,
		];

		// Act.
		const result: BlockValidationResult[] = innerBlocksValid.findMissingBlocks( existingRequiredBlocks, requiredBlocks );

		// Assert.
		expect( result.length ).toEqual( 1 );
		expect( result[ 0 ].name ).toEqual( "missingblock" );
		expect( result[ 0 ].result ).toEqual( BlockValidation.Missing );
	} );

	it( "creates no missing blocks for blocks that are present.", () => {
		// Arrange.
		const requiredBlocks: RequiredBlock[] = [
			{
				name: "existingBlock",
				option: RequiredBlockOption.Multiple,
			} as RequiredBlock,
			{
				name: "validBlock",
				option: RequiredBlockOption.One,
			} as RequiredBlock,
		];
		const existingRequiredBlocks: BlockInstance[] = [
			{
				name: "existingBlock",
			} as BlockInstance,
			{
				name: "validBlock",
			} as BlockInstance,
		];

		// Act.
		const result: BlockValidationResult[] = innerBlocksValid.findMissingBlocks( existingRequiredBlocks, requiredBlocks );

		// Assert.
		expect( result.length ).toEqual( 0 );
	} );
} );

describe( "The findRedundantBlocks function", () => {
	it( "creates an BlockValidationResult with reason 'toomany' when a block occurs more than once when it may not.", () => {
		// Arrange.
		const requiredBlocks: RequiredBlock[] = [
			{
				name: "duplicateBlock",
				option: RequiredBlockOption.One,
			} as RequiredBlock,
		];
		const existingRequiredBlocks: BlockInstance[] = [
			{
				name: "duplicateBlock",
			} as BlockInstance,
			{
				name: "duplicateBlock",
			} as BlockInstance,
		];

		// Act.
		const result: BlockValidationResult[] = innerBlocksValid.findRedundantBlocks( existingRequiredBlocks, requiredBlocks );

		// Assert.
		expect( result.length ).toEqual( 1 );
		expect( result[ 0 ].name ).toEqual( "duplicateBlock" );
		expect( result[ 0 ].result ).toEqual( BlockValidation.TooMany );
	} );
	it( "creates no BlockValidationResults when no redundant blocks are present.", () => {
		// Arrange.
		const requiredBlocks: RequiredBlock[] = [
			{
				name: "duplicateBlock",
				option: RequiredBlockOption.One,
			} as RequiredBlock,
		];
		const existingBlocks: BlockInstance[] = [
			{
				name: "duplicateBlock",
			} as BlockInstance,
		];

		// Act.
		const result: BlockValidationResult[] = innerBlocksValid.findRedundantBlocks( existingBlocks, requiredBlocks );

		// Assert.
		expect( result.length ).toEqual( 0 );
	} );
} );

describe( "The findSelfInvalidatedBlocks function", () => {
	it( "creates an BlockValidationResult instance with reason 'internal' when a block invalidates itself.", () => {
		// Arrange.
		const existingBlocks: BlockInstance[] = [
			{
				name: "validBlock",
			} as BlockInstance,
			{
				name: "invalidOptionalBlock",
			} as BlockInstance,
		];

		const testBlock = {
			name: "test",
			innerBlocks: existingBlocks,
		} as BlockInstance;

		// Act.
		const result: BlockValidationResult[] = innerBlocksValid.findSelfInvalidatedBlocks( testBlock );

		// Assert.
		expect( result.length ).toEqual( 2 );

		const validationResult = result.find( x => x.name === "validBlock" && x.result === BlockValidation.Internal );
		expect( validationResult.name ).toEqual( "validBlock" );
		expect( validationResult.result ).toEqual( BlockValidation.Valid );

		const invalidOptionalBlock = result.find( x => x.name === "invalidOptionalBlock" && x.result === BlockValidation.Optional );
		expect( invalidOptionalBlock.name ).toEqual( "invalidOptionalBlock" );
		expect( invalidOptionalBlock.result ).toEqual( BlockValidation.Optional );
	} );
} );


describe( "the getInvalidInnerBlocks function", () => {
	it( "returns no BlockValidationResults when all required blocks are present immediately in the InnerBlock.", () => {
		// Arrange.
		const requiredBlocks: RequiredBlock[] = [
			{
				name: "existingBlock",
				option: RequiredBlockOption.Multiple,
			} as RequiredBlock,
		];
		const existingBlocks: BlockInstance[] = [
			{
				name: "existingBlock",
			} as BlockInstance,
		];

		const testBlock = {
			innerBlocks: existingBlocks,
		} as BlockInstance;

		// Act.
		const result: BlockValidationResult[] = innerBlocksValid.default( testBlock, requiredBlocks );

		// Assert.
		expect( result.length ).toEqual( 0 );
	} );

	it( "returns an empty array when all required blocks (and some extra's) are present in a nested InnerBlock.", () => {
		// Arrange.
		const requiredBlocks: RequiredBlock[] = [
			{
				name: "requiredBlock",
				option: RequiredBlockOption.Multiple,
			} as RequiredBlock,
		];
		const existingBlocks: BlockInstance[] = [
			{
				// Not required, should be ignored.
				name: "innerBlock",
				innerBlocks: [
					{
						// Required and Valid.
						name: "requiredBlock",
					} as BlockInstance,
				],
			} as BlockInstance,
		];

		const testBlock = {
			innerBlocks: existingBlocks,
		} as BlockInstance;

		// Act.
		const result: BlockValidationResult[] = innerBlocksValid.default( testBlock, requiredBlocks );

		// Assert.
		expect( result.length ).toEqual( 0 );
	} );

	it( "returns BlockValidationResults when some required blocks are invalid.", () => {
		// Arrange.

		const requiredBlocks: RequiredBlock[] = [
			{
				name: "existingBlock",
				option: RequiredBlockOption.Multiple,
			} as RequiredBlock,
			{
				name: "redundantBlock",
				option: RequiredBlockOption.One,
			} as RequiredBlock,
			{
				name: "missingBlock",
				option: RequiredBlockOption.Multiple,
			} as RequiredBlock,
		];

		const existingBlocks: BlockInstance[] = [
			{
				// Required and valid.
				name: "existingBlock",
			} as BlockInstance,
			{
				// Required once, valid, but too often.
				name: "redundantBlock",
				innerBlocks: [
					{
						// Required once, valid, but too often.
						name: "redundantBlock",
					} as BlockInstance,
				],
			} as BlockInstance,
		];
		const testBlock = {
			name: "TestBlock",
			innerBlocks: existingBlocks,
		} as BlockInstance;

		// Act.
		const result: BlockValidationResult[] = innerBlocksValid.default( testBlock, requiredBlocks );

		// Assert.
		expect( result.length ).toEqual( 4 );

		const missingBlock = result.filter( validation => validation.result === BlockValidation.Missing );
		expect( missingBlock.length ).toEqual( 1 );
		expect( missingBlock[ 0 ].name ).toEqual( "missingBlock" );
		expect( missingBlock[ 0 ].result ).toEqual( BlockValidation.Missing );

		const redundantBlocks = result.filter( validation => validation.result === BlockValidation.TooMany );
		expect( redundantBlocks.length ).toEqual( 1 );
		expect( redundantBlocks[ 0 ].name ).toEqual( "redundantBlock" );
		expect( redundantBlocks[ 0 ].result ).toEqual( BlockValidation.TooMany );
	} );
} );
