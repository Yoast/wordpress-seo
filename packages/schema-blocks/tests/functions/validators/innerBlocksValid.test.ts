import "../../matchMedia.mock";
import { BlockInstance } from "@wordpress/blocks";
import { BlockValidationResult, BlockValidation, RequiredBlock, RequiredBlockOption } from "../../../src/core/validation";
import BlockDefinition from "../../../src/core/blocks/BlockDefinition";
import * as innerBlocksValid from "../../../src/functions/validators/innerBlocksValid";
import * as blockDefinitionRepository from "../../../src/core/blocks/BlockDefinitionRepository";

const mockBlockRegistry: Record<string, BlockDefinition> = {};
const getBlockDefinitionMock = jest.spyOn( blockDefinitionRepository, "getBlockDefinition" );
getBlockDefinitionMock.mockImplementation( ( name: string ) => {
	if ( ! mockBlockRegistry[ name ] ) {
		mockBlockRegistry[ name ] = FakeBlockDefinition( "-1", name, BlockValidation.Valid );
	}
	return mockBlockRegistry[ name ];
} );

/**
 * Provides a fake definition.
 * @param clientId      ClientId of the mocked Definition.
 * @param name          Name of the mocked Definition.
 * @param expectedValue Returned value for this clientId.
 * @returns {BlockDefinition} The fake definition.
 */
function FakeBlockDefinition( clientId: string, name: string, expectedValue: BlockValidation ): BlockDefinition {
	return {
		name: name,
		validate: () => {
			return new BlockValidationResult( clientId, name, expectedValue );
		},
	} as unknown as BlockDefinition;
}

/**
 * Add a definition for a block to the mocked block definition.
 * @param clientId      The clientId of the block to mock.
 * @param name          The name of the block to mock.
 * @param expectedValue The validation output of the block.
 */
function mockDefinition( clientId: string, name: string, expectedValue: BlockValidation ) {
	mockBlockRegistry[ name ] = FakeBlockDefinition( clientId, name, expectedValue );
}

const createBlockValidationResultTestArrangement = [
	{ name: "missingblock", reason: BlockValidation.MissingBlock },
	{ name: "redundantblock", reason: BlockValidation.TooMany },
	{ name: "missingattributeblock", reason: BlockValidation.MissingAttribute },
	{ name: "validblock", reason: BlockValidation.Valid },
	{ name: "invalidblock", reason: BlockValidation.Invalid },
	{ name: "unknown", reason: BlockValidation.Unknown },
];

describe( "The BlockValidationResult constructor", () => {
	it( "creates a valid BlockValidationResult", () => {
		for ( let i = 0; i < createBlockValidationResultTestArrangement.length; i++ ) {
			const input = createBlockValidationResultTestArrangement[ i ];
			const result = new BlockValidationResult( "clientId", input.name, input.reason );
			expect( result.name ).toEqual( input.name );
			expect( result.result ).toEqual( input.reason );
		}
	} );
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
		expect( result[ 0 ].result ).toEqual( BlockValidation.MissingBlock );
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
				clientId: "existingBlock1",
			} as BlockInstance,
			{
				name: "validBlock",
				clientId: "validBlock1",
			} as BlockInstance,
		];

		// Act.
		const result: BlockValidationResult[] = innerBlocksValid.findMissingBlocks( existingRequiredBlocks, requiredBlocks );

		// Assert.
		expect( result.length ).toEqual( 0 );
	} );
} );

describe( "The findRedundantBlocks function", () => {
	it( "creates an BlockValidationResult with reason 'TooMany' when a singleton block occurs more than once.", () => {
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
				clientId: "duplicateBlock1",
			} as BlockInstance,
			{
				name: "duplicateBlock",
				clientId: "duplicateBlock2",
			} as BlockInstance,
		];

		// Act.
		const result = innerBlocksValid.findRedundantBlocks( existingRequiredBlocks, requiredBlocks );

		// Assert.
		expect( result.length ).toEqual( 2 );

		const dup1 = result.find( x => x.clientId === "duplicateBlock1" );
		const dup2 = result.find( x => x.clientId === "duplicateBlock2" );

		expect( dup1 ).not.toBeUndefined();
		expect( dup1.clientId ).toEqual( "duplicateBlock1" );
		expect( dup1.name ).toEqual( "duplicateBlock" );
		expect( dup1.result ).toEqual( BlockValidation.TooMany );

		expect( dup2 ).not.toBeUndefined();
		expect( dup2.clientId ).toEqual( "duplicateBlock2" );
		expect( dup2.name ).toEqual( "duplicateBlock" );
		expect( dup2.result ).toEqual( BlockValidation.TooMany );
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
				clientId: "duplicateBlock1",
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
	it( "creates a BlockValidationResult instance for each innerblock with each block's validation result.", () => {
		// Arrange.
		const testBlock = {
			name: "testBlock",
			clientId: "testBlock1",
			innerBlocks: [
				{
					name: "validBlock",
					clientId: "validBlock1",
				} as BlockInstance,
				{
					name: "missingattributeblock",
					clientId: "missingattributeblock1",
				} as BlockInstance,
			],
		} as BlockInstance;

		mockDefinition( "validBlock1", "validBlock", BlockValidation.Valid );
		mockDefinition( "missingattributeblock1", "missingattributeblock", BlockValidation.MissingAttribute );

		// Act.
		const result: BlockValidationResult[] = innerBlocksValid.validateInnerblockTree( testBlock );

		// Assert.
		expect( result.length ).toEqual( 2 );

		const validBlockResult = result[ 0 ];
		expect( validBlockResult.name ).toBe( "validBlock" );
		expect( validBlockResult.result ).toBe( BlockValidation.Valid );


		const testblockResult = result.find( ( x: BlockValidationResult ) => x.clientId === "testBlock1" );
		expect( testblockResult.name ).toBe( "testBlock" );
		expect( testblockResult.clientId ).toBe( "testBlock1" );
		expect( testblockResult.result ).toBe( BlockValidation.Invalid );
		expect( testblockResult.issues.length ).toBe( 1 );

		const missingattributeblock = result.filter( x => x.clientId === "missingattributeblock1" );
		expect( missingattributeblock[ 0 ].name ).toEqual( "missingattributeblock" );
		expect( missingattributeblock[ 1 ].name ).toEqual( "missingattributeblock1" );
		expect( missingattributeblock[ 1 ].result ).toEqual( BlockValidation.Invalid );
		expect( missingattributeblock[ 1 ].issues[ 0 ].result ).toEqual( BlockValidation.MissingAttribute );
	} );
} );


describe( "the getInvalidInnerBlocks function", () => {
	it( "returns a Valid result when all required blocks are present immediately in the InnerBlock.", () => {
		// Arrange.
		const requiredBlocks: RequiredBlock[] = [
			{
				name: "existingBlock",
				option: RequiredBlockOption.Multiple,
			} as RequiredBlock,
		];
		const existingBlocks: BlockInstance[] = [
			{
				clientId: "existingBlock1",
				name: "existingBlock",
			} as BlockInstance,
		];

		const testBlock = {
			innerBlocks: existingBlocks,
		} as BlockInstance;

		mockDefinition( "existingBlock1", "existingBlock", BlockValidation.Valid );

		// Act.
		const result: BlockValidationResult[] = innerBlocksValid.default( testBlock, requiredBlocks );

		// Assert.
		expect( result.length ).toEqual( 1 );
		expect( result[ 0 ].clientId ).toEqual( "existingBlock1" );
		expect( result[ 0 ].name ).toEqual( "existingBlock" );
		expect( result[ 0 ].result ).toEqual( BlockValidation.Valid );
	} );

	it( "returns a Valid result when all required blocks (and some extra's) are present in a nested InnerBlock.", () => {
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
				clientId: "innerBlock1",
				name: "innerBlock",
				innerBlocks: [
					{
						// Required and Valid.
						clientId: "requiredBlock1",
						name: "requiredBlock",
						innerBlocks: [] as BlockInstance[],
					} as BlockInstance,
				],
			} as BlockInstance,
		];

		const testBlock = {
			innerBlocks: existingBlocks,
		} as BlockInstance;
		mockDefinition( "requiredBlock1", "requiredBlock", BlockValidation.Valid );

		// Act.
		const result: BlockValidationResult[] = innerBlocksValid.default( testBlock, requiredBlocks );

		// Assert.
		expect( result.length ).toEqual( 2 );

		const requiredBlock = result.find( x => x.clientId === "requiredBlock1" );
		expect( requiredBlock.name ).toEqual( "requiredBlock" );
		expect( requiredBlock.result ).toEqual( BlockValidation.Valid );
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
				clientId: "existingBlock1",
				name: "existingBlock",
			} as BlockInstance,
			{
				// Required once, valid, but too often.
				clientId: "redundantBlock1",
				name: "redundantBlock",
				innerBlocks: [
					{
						// Required once, valid, but too often.
						clientId: "redundantBlock2",
						name: "redundantBlock",
					} as BlockInstance,
				],
			} as BlockInstance,
		];
		const testBlock = {
			clientId: "TestBlock",
			innerBlocks: existingBlocks,
		} as BlockInstance;

		mockDefinition( "existingBlock1", "existingBlock", BlockValidation.Valid );
		mockDefinition( "innerBlock1", "innerBlock", BlockValidation.Valid );
		mockDefinition( "redundantBlock1", "redundantBlock", BlockValidation.Valid );
		mockDefinition( "redundantBlock2", "redundantBlock", BlockValidation.Valid );

		// Act.
		const result: BlockValidationResult[] = innerBlocksValid.default( testBlock, requiredBlocks );

		// Assert.
		expect( result.length ).toEqual( 6 );

		const missingBlock = result.filter( b => b.name === "missingBlock" && b.result === BlockValidation.MissingBlock );
		expect( missingBlock.length ).toEqual( 1 );
		expect( missingBlock[ 0 ].name ).toEqual( "missingBlock" );
		expect( missingBlock[ 0 ].result ).toEqual( BlockValidation.MissingBlock );

		const redundantBlocks = result.filter( b => b.name === "redundantBlock" && b.result === BlockValidation.TooMany );
		expect( redundantBlocks.length ).toEqual( 1 );
		expect( redundantBlocks[ 0 ].name ).toEqual( "redundantBlock" );
		expect( redundantBlocks[ 0 ].result ).toEqual( BlockValidation.TooMany );

		const validRedundantBlocks = result.filter( b => b.name === "redundantBlock" && b.result === BlockValidation.Valid );
		expect( validRedundantBlocks.length ).toEqual( 2 );

		const existingBlock = result.filter( b => b.name === "existingBlock" && b.result === BlockValidation.Valid );
		expect( existingBlock.length ).toEqual( 1 );
		expect( existingBlock[ 0 ].name ).toEqual( "existingBlock" );
		expect( existingBlock[ 0 ].result ).toEqual( BlockValidation.Valid );
	} );
} );
