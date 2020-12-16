import "../../matchMedia.mock";
import { BlockInstance } from "@wordpress/blocks";
import * as innerBlocksValid from "../../../src/functions/validators/innerBlocksValid";
import { InvalidBlock, RequiredBlock } from "../../../src/instructions/blocks/dto";
import { InvalidBlockReason, RequiredBlockOption } from "../../../src/instructions/blocks/enums";
import BlockDefinition from "../../../src/core/blocks/BlockDefinition";
import * as blockDefinitionRepository from "../../../src/core/blocks/BlockDefinitionRepository";

const mockBlockRegistry: Record<string, BlockDefinition> = {};
const getBlockDefinitionMock = jest.spyOn( blockDefinitionRepository, "getBlockDefinition" );
getBlockDefinitionMock.mockImplementation( ( name: string ) => {
	return mockBlockRegistry[ name ];
} );

mockDefinition( "validBlock", true );
mockDefinition( "existingBlock", true );
mockDefinition( "invalidBlock", false );
mockDefinition( "invalidOptionalBlock", false );
mockDefinition( "innerBlock", true );
mockDefinition( "requiredBlock", true );
mockDefinition( "redundantBlock", true );


const createInvalidBlockTestArrangement = [
	{ name: "missingblock", reason: InvalidBlockReason.Missing },
	{ name: "redundantblock", reason: InvalidBlockReason.TooMany },
	{ name: "invalidblock", reason: InvalidBlockReason.Internal },
	{ name: "Optionalblock", reason: InvalidBlockReason.Optional },
];

const createOptionalInvalidBlockReasonTestArrangement = [
	{ reason: InvalidBlockReason.Missing, expected: false },
	{ reason: InvalidBlockReason.TooMany, expected: false },
	{ reason: InvalidBlockReason.Internal, expected: false },
	{ reason: InvalidBlockReason.Optional, expected: true },
];

describe( "The createInvalidBlock function", () => {
	for ( let i = 0; i < createInvalidBlockTestArrangement.length; i++ ) {
		const input = createInvalidBlockTestArrangement[ i ];
		it( "creates an InvalidBlock instance with name " + input.name + " and reason " + input.reason + ".", () => {
			const result = innerBlocksValid.createInvalidBlock( input.name, input.reason );
			expect( result.name ).toEqual( input.name );
			expect( result.reason ).toEqual( input.reason );
		} );
	}
} );

describe( "The isOptional function", () => {
	for ( let i = 0; i < createOptionalInvalidBlockReasonTestArrangement.length; i++ ) {
		const input = createOptionalInvalidBlockReasonTestArrangement[ i ];
		it( "verifies that reason " + input.reason + " is " + ( input.expected ? "" : "not " ) + "optional.", () => {
			const result = innerBlocksValid.isOptional( input.reason );
			expect( result ).toBe( input.expected );
		} );
	}
} );

describe( "The findMissingBlocks function", () => {
	it( "creates an InvalidBlock with and reason 'missing' when a required block is missing.", () => {
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
		const result: InvalidBlock[] = innerBlocksValid.findMissingBlocks( existingRequiredBlocks, requiredBlocks );

		// Assert.
		expect( result.length ).toEqual( 1 );
		expect( result[ 0 ].name ).toEqual( "missingblock" );
		expect( result[ 0 ].reason ).toEqual( InvalidBlockReason.Missing );
	} );
	it( "creates no InvalidBlocks when all required blocks are present.", () => {
		// Arrange.
		const requiredBlocks: RequiredBlock[] = [
			{
				name: "existingBlock",
				option: RequiredBlockOption.Multiple,
			} as RequiredBlock,
		];
		const existingRequiredBlocks: BlockInstance[] = [
			{
				name: "existingBlock",
			} as BlockInstance,
		];

		// Act.
		const result: InvalidBlock[] = innerBlocksValid.findMissingBlocks( existingRequiredBlocks, requiredBlocks );

		// Assert.
		expect( result.length ).toEqual( 0 );
	} );
} );

describe( "The findRedundantBlocks function", () => {
	it( "creates an InvalidBlock with reason 'toomany' when a block occurs more than once when it may not.", () => {
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
		const result: InvalidBlock[] = innerBlocksValid.findRedundantBlocks( existingRequiredBlocks, requiredBlocks );

		// Assert.
		expect( result.length ).toEqual( 1 );
		expect( result[ 0 ].name ).toEqual( "duplicateBlock" );
		expect( result[ 0 ].reason ).toEqual( InvalidBlockReason.TooMany );
	} );
	it( "creates no InvalidBlocks when no redundant blocks are present.", () => {
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
		const result: InvalidBlock[] = innerBlocksValid.findRedundantBlocks( existingBlocks, requiredBlocks );

		// Assert.
		expect( result.length ).toEqual( 0 );
	} );
} );

/**
 * Add a definition for a block to the mocked block definition.
 * @param name          The name of the block to mock.
 * @param expectedValue The validation output of the block.
 */
function mockDefinition( name: string, expectedValue: boolean ) {
	mockBlockRegistry[ name ] = {
		valid: () => expectedValue,
	} as unknown as BlockDefinition;
}

describe( "The findSelfInvalidatedBlocks function", () => {
	it( "creates an InvalidBlock instance with reason 'internal' when a block invalidates itself.", () => {
		// Arrange.
		const requiredBlocks: RequiredBlock[] = [
			{
				name: "validBlock",
				option: RequiredBlockOption.One,
			},
			{
				name: "invalidBlock",
				option: RequiredBlockOption.One,
			},
		];

		const existingBlocks: BlockInstance[] = [
			{
				name: "validBlock",
			} as BlockInstance,
			{
				name: "invalidBlock",
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
		const result: InvalidBlock[] = innerBlocksValid.findSelfInvalidatedBlocks( testBlock, requiredBlocks );

		// Assert.
		expect( result.length ).toEqual( 2 );

		const invalidBlock = result.find( x => x.name === "invalidBlock" && x.reason === InvalidBlockReason.Internal );
		expect( invalidBlock.name ).toEqual( "invalidBlock" );
		expect( invalidBlock.reason ).toEqual( InvalidBlockReason.Internal );

		const invalidOptionalBlock = result.find( x => x.name === "invalidOptionalBlock" && x.reason === InvalidBlockReason.Optional );
		expect( invalidOptionalBlock.name ).toEqual( "invalidOptionalBlock" );
		expect( invalidOptionalBlock.reason ).toEqual( InvalidBlockReason.Optional );
	} );
} );


describe( "the getInvalidInnerBlocks function", () => {
	it( "returns no InvalidBlocks when all required blocks are present immediately in the InnerBlock.", () => {
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
		const result: InvalidBlock[] = innerBlocksValid.default( testBlock, requiredBlocks );

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
		const result: InvalidBlock[] = innerBlocksValid.default( testBlock, requiredBlocks );

		// Assert.
		expect( result.length ).toEqual( 0 );
	} );

	it( "returns InvalidBlocks when some required blocks are invalid.", () => {
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
		const result: InvalidBlock[] = innerBlocksValid.default( testBlock, requiredBlocks );

		// Assert.
		expect( result.length ).toEqual( 2 );

		const missingBlock = result.filter( invalidBlock => invalidBlock.reason === InvalidBlockReason.Missing );
		expect( missingBlock.length ).toEqual( 1 );
		expect( missingBlock[ 0 ].name ).toEqual( "missingBlock" );

		const redundantBlocks = result.filter( invalidBlock => invalidBlock.reason === InvalidBlockReason.TooMany );
		expect( redundantBlocks.length ).toEqual( 1 );
		expect( redundantBlocks[ 0 ].name ).toEqual( "redundantBlock" );
	} );
} );
