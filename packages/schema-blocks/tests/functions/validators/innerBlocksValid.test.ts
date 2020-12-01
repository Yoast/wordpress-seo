import { BlockInstance } from "@wordpress/blocks";
import * as innerBlocksValid from "../../../src/functions/validators/innerBlocksValid";
import { InvalidBlock, RequiredBlock } from "../../../src/instructions/blocks/dto";
import { InvalidBlockReason, RequiredBlockOption } from "../../../src/instructions/blocks/enums";

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

describe.each( createInvalidBlockTestArrangement )( "The createInvalidBlock function", input => {
	it( `creates an InvalidBlock instance with name '${input.name}' and reason '${input.reason}'.`, () => {
		const result = innerBlocksValid.createInvalidBlock( input.name, input.reason );
		expect( result.name ).toEqual( input.name );
		expect( result.reason ).toEqual( input.reason );
	} );
} );

describe.each( createOptionalInvalidBlockReasonTestArrangement )( "The isOptional function", input => {
	it( `verifies that reason '${input.reason}' is ${input.expected ? "" : "not "} optional.`, () => {
		const result = innerBlocksValid.isOptional( input.reason );
		expect( result ).toBe( input.expected );
	} );
} );

describe( "The findMissingBlocks function", () => {
	it( "creates an InvalidBlock instance with and reason 'missing' when a required block is missing.", () => {
		// Arrange.
		const requiredBlocks: RequiredBlock[] = [
			{
				name: "existingblock",
				option: RequiredBlockOption.Multiple,
			} as RequiredBlock,
			{
				name: "missingblock",
				option: RequiredBlockOption.Multiple,
			} as RequiredBlock,
		];
		const existingRequiredBlocks: BlockInstance[] = [
			{
				name: "existingblock",
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
				name: "existingblock",
				option: RequiredBlockOption.Multiple,
			} as RequiredBlock,
		];
		const existingRequiredBlocks: BlockInstance[] = [
			{
				name: "existingblock",
			} as BlockInstance,
		];

		// Act.
		const result: InvalidBlock[] = innerBlocksValid.findMissingBlocks( existingRequiredBlocks, requiredBlocks );

		// Assert.
		expect( result.length ).toEqual( 0 );
	} );
} );

describe( "The findRedundantBlocks function", () => {
	it( "creates an InvalidBlock instance with reason 'toomany' when a block occurs more than once.", () => {
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
				isValid: true,
			} as BlockInstance,
			{
				name: "invalidBlock",
				isValid: false,
			} as BlockInstance,
			{
				name: "invalidOptionalBlock",
				isValid: false,
			} as BlockInstance,
		];
		const testBlock = {
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
				name: "existingblock",
				option: RequiredBlockOption.Multiple,
			} as RequiredBlock,
		];
		const existingBlocks: BlockInstance[] = [
			{
				name: "existingblock",
				isValid: true,
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
} );

describe( "the getInvalidInnerBlocks function", () => {
	it( "returns no InvalidBlocks when all required blocks (and some extra's) are present in a nested InnerBlock.", () => {
		// Arrange.
		const requiredBlocks: RequiredBlock[] = [
			{
				name: "requiredblock",
				option: RequiredBlockOption.Multiple,
			} as RequiredBlock,
		];
		const existingBlocks: BlockInstance[] = [
			{
				// Not required, should be ignored.
				name: "innerblock",
				isValid: true,
				innerBlocks: [
					{
						// Required and Valid.
						name: "requiredblock",
						isValid: true,
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
} );

describe( "the getInvalidInnerBlocks function", () => {
	it( "returns InvalidBlocks when some required blocks are invalid.", () => {
		// Arrange.
		const requiredBlocks: RequiredBlock[] = [
			{
				name: "existingblock",
				option: RequiredBlockOption.Multiple,
			} as RequiredBlock,
			{
				name: "redundantblock",
				option: RequiredBlockOption.One,
			} as RequiredBlock,
			{
				name: "missingblock",
				option: RequiredBlockOption.Multiple,
			} as RequiredBlock,
			{
				name: "invalidblock",
				option: RequiredBlockOption.One,
			} as RequiredBlock,
		];
		const existingBlocks: BlockInstance[] = [
			{
				// Required and valid.
				name: "existingblock",
				isValid: true,
			} as BlockInstance,
			{
				// Required once, valid, but too often.
				name: "redundantblock",
				isValid: true,
				innerBlocks: [
					{
						// Required once, valid, but too often.
						name: "redundantblock",
						isValid: true,
					} as BlockInstance,
				],
			} as BlockInstance,
			{
				// Required but invalid.
				name: "invalidBlock",
				isValid: false,
				innerBlocks: [
					{
						 // Invalid, but optional and can be ignored
						name: "optionalblock",
						isValid: false,
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
		expect( result.length ).toEqual( 5 );

		const missingBlock = result.find( invalidBlock => invalidBlock.reason === InvalidBlockReason.Missing );
		expect( missingBlock.name ).toEqual( "missingblock" );

		const redundantBlocks = result.filter( invalidBlock => invalidBlock.reason === InvalidBlockReason.TooMany );
		expect( redundantBlocks.length ).toEqual( 2 );
		expect( redundantBlocks.every( block => block.name === "redundantblock" ) ).toEqual( true );

		const invalidOptionalBlock = result.find( invalidBlock => invalidBlock.reason === InvalidBlockReason.Optional );
		expect( invalidOptionalBlock.name ).toEqual( "optionalblock" );
	} );
} );
