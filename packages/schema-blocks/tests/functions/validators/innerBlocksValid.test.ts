import "../../matchMedia.mock";
import { BlockInstance } from "@wordpress/blocks";
import {
	BlockValidation,
	BlockValidationResult,
	RequiredBlock,
	RecommendedBlock,
} from "../../../src/core/validation";
import BlockDefinition from "../../../src/core/blocks/BlockDefinition";
import * as innerBlocksValid from "../../../src/functions/validators/innerBlocksValid";
import * as blockDefinitionRepository from "../../../src/core/blocks/BlockDefinitionRepository";
import { BlockPresence } from "../../../src/core/validation/BlockValidationResult";

const mockBlockRegistry: Record<string, BlockDefinition> = {};
const getBlockDefinitionMock = jest.spyOn( blockDefinitionRepository, "getBlockDefinition" );
getBlockDefinitionMock.mockImplementation( ( name: string ) => {
	if ( ! mockBlockRegistry[ name ] ) {
		mockBlockRegistry[ name ] = FakeBlockDefinition( "-1", name, BlockValidation.Valid );
	}
	return mockBlockRegistry[ name ];
} );

jest.mock( "../../../src/functions/BlockHelper", () => {
	return {
		getHumanReadableBlockName: jest.fn( name => name ),
	};
} );

/**
 * Provides a fake definition.
 *
 * @param clientId      ClientId of the mocked Definition.
 * @param name          Name of the mocked Definition.
 * @param expectedValue Returned value for this clientId.
 *
 * @returns {BlockDefinition} The fake definition.
 */
function FakeBlockDefinition( clientId: string, name: string, expectedValue: BlockValidation ): BlockDefinition {
	return {
		name: name,
		validate: () => {
			const output = new BlockValidationResult( clientId, name, expectedValue, BlockPresence.Required );
			if ( expectedValue === BlockValidation.Valid || expectedValue === BlockValidation.Unknown ) {
				return output;
			}
			output.result = BlockValidation.Invalid;
			output.issues.push( new BlockValidationResult( "child_or_attribute_id_" + name, "child_or_attribute_name_" +
				name, expectedValue, BlockPresence.Required ) );
			return output;
		},
	} as unknown as BlockDefinition;
}

/**
 * Adds a definition for a block to the mocked block definition.
 *
 * @param clientId      The clientId of the block to mock.
 * @param name          The name of the block to mock.
 * @param expectedValue The validation output of the block.
 */
function mockDefinition( clientId: string, name: string, expectedValue: BlockValidation ) {
	mockBlockRegistry[ name ] = FakeBlockDefinition( clientId, name, expectedValue );
}

const createBlockValidationResultTestArrangement = [
	{ name: "missingrequiredblock", reason: BlockValidation.MissingRequiredBlock },
	{ name: "missingrecommendedblock", reason: BlockValidation.MissingRecommendedBlock },
	{ name: "missingattributeblock", reason: BlockValidation.MissingRequiredAttribute },
	{ name: "validblock", reason: BlockValidation.Valid },
	{ name: "invalidblock", reason: BlockValidation.Invalid },
	{ name: "unknown", reason: BlockValidation.Unknown },
];

describe( "The BlockValidationResult constructor", () => {
	it( "creates a valid BlockValidationResult", () => {
		for ( let i = 0; i < createBlockValidationResultTestArrangement.length; i++ ) {
			const input = createBlockValidationResultTestArrangement[ i ];
			const result = new BlockValidationResult( "clientId", input.name, input.reason, BlockPresence.Required );
			expect( result.name ).toEqual( input.name );
			expect( result.result ).toEqual( input.reason );
		}
	} );
} );

describe( "The findMissingBlocks function", () => {
	it( "creates a BlockValidationResult with reason 'MissingRequiredBlock' when a required block is missing.", () => {
		// Arrange.
		const requiredBlocks: RequiredBlock[] = [
			{
				name: "existingRequiredBlock",
			} as RequiredBlock,
			{
				name: "missingblock",
			} as RequiredBlock,
		];
		const existingRequiredBlocks: BlockInstance[] = [
			{
				name: "existingRequiredBlock",
			} as BlockInstance,
		];

		// Act.
		const result: BlockValidationResult[] = innerBlocksValid.findMissingBlocks( existingRequiredBlocks, requiredBlocks, BlockPresence.Required );

		// Assert.
		expect( result.length ).toEqual( 1 );
		expect( result[ 0 ].name ).toEqual( "missingblock" );
		expect( result[ 0 ].result ).toEqual( BlockValidation.MissingRequiredBlock );
	} );

	it( "creates a BlockValidationResult with reason 'MissingRecommendedBlock' when a recommended block is missing.", () => {
		// Arrange.
		const recommendedBlocks: RecommendedBlock[] = [
			{
				name: "existingRecommendedBlock",
			} as RecommendedBlock,
			{
				name: "missingblock",
			} as RecommendedBlock,
		];
		const existingRecommendedBlocks: BlockInstance[] = [
			{
				name: "existingRecommendedBlock",
			} as BlockInstance,
		];

		// Act.
		const result: BlockValidationResult[] = innerBlocksValid.findMissingBlocks( existingRecommendedBlocks, recommendedBlocks,
			BlockPresence.Recommended );

		// Assert.
		expect( result.length ).toEqual( 1 );
		expect( result[ 0 ].name ).toEqual( "missingblock" );
		expect( result[ 0 ].result ).toEqual( BlockValidation.MissingRecommendedBlock );
	} );

	it( "creates no missing blocks for required blocks that are present.", () => {
		// Arrange.
		const requiredBlocks: RequiredBlock[] = [
			{
				name: "existingRequiredBlock",
			} as RequiredBlock,
			{
				name: "validBlock",
			} as RequiredBlock,
		];
		const existingRequiredBlocks: BlockInstance[] = [
			{
				name: "existingRequiredBlock",
				clientId: "existingBlock1",
			} as BlockInstance,
			{
				name: "validBlock",
				clientId: "validBlock1",
			} as BlockInstance,
		];

		// Act.
		const result: BlockValidationResult[] = innerBlocksValid.findMissingBlocks( existingRequiredBlocks, requiredBlocks, BlockPresence.Required );

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
		mockDefinition( "missingattributeblock1", "missingattributeblock", BlockValidation.MissingRequiredAttribute );

		// Act.
		const result: BlockValidationResult[] = innerBlocksValid.validateInnerblockTree( testBlock );

		// Assert.
		expect( result.length ).toEqual( 2 );

		const validBlockResult = result.find( x => x.clientId === "validBlock1" );
		expect( validBlockResult.name ).toBe( "validBlock" );
		expect( validBlockResult.result ).toBe( BlockValidation.Valid );

		const missingattributeblock = result.find( x => x.clientId === "missingattributeblock1" );
		expect( missingattributeblock.name ).toEqual( "missingattributeblock" );
		expect( missingattributeblock.result ).toEqual( BlockValidation.Invalid );
		expect( missingattributeblock.issues[ 0 ].result ).toEqual( BlockValidation.MissingRequiredAttribute );
	} );
} );


describe( "the getInvalidInnerBlocks function", () => {
	it( "returns a Valid result when all required blocks are present immediately in the InnerBlock.", () => {
		// Arrange.
		const requiredBlocks: RequiredBlock[] = [
			{
				name: "existingBlock",
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
			} as RequiredBlock,
			{
				name: "redundantBlock",
			} as RequiredBlock,
			{
				name: "missingBlock",
			} as RequiredBlock,
		];

		const existingBlocks: BlockInstance[] = [
			{
				// Required once, valid, but too often.
				clientId: "redundantBlock1",
				name: "redundantBlock",
				innerBlocks: [
					{
						// Required once, valid, but too often.
						clientId: "redundantBlock2",
						name: "redundantBlock",
						innerBlocks: [
							{
								// Required and valid.
								clientId: "existingBlock1",
								name: "existingBlock",
							} as BlockInstance,
						],
					} as BlockInstance,
				],
			} as BlockInstance,
		];
		const testBlock = {
			clientId: "TestBlock",
			innerBlocks: existingBlocks,
		} as BlockInstance;

		mockDefinition( "existingBlock1", "existingBlock", BlockValidation.Valid );
		mockDefinition( "redundantBlock1", "redundantBlock", BlockValidation.Valid );
		mockDefinition( "redundantBlock2", "redundantBlock", BlockValidation.Valid );

		// Act.
		const result: BlockValidationResult[] = innerBlocksValid.default( testBlock, requiredBlocks );

		// Assert.
		expect( result.length ).toEqual( 4 );

		// Be able to find missing blocks.
		const missingBlock = result.filter( b => b.name === "missingBlock" && b.result === BlockValidation.MissingRequiredBlock );
		expect( missingBlock.length ).toEqual( 1 );
		expect( missingBlock[ 0 ].name ).toEqual( "missingBlock" );
		expect( missingBlock[ 0 ].result ).toEqual( BlockValidation.MissingRequiredBlock );

		// Validation must be able to find blocks that follow their own rules, but not the rules imposed by the innerblock.
		const validRedundantBlocks = result.filter( b => b.name === "redundantBlock" && b.result === BlockValidation.Valid );
		expect( validRedundantBlocks.length ).toEqual( 2 );

		// Validation must be able to find a valid nested block inside an invalid block, but still determine that the nested block is valid.
		const existingBlock = result.filter( b => b.name === "existingBlock" && b.result === BlockValidation.Valid );
		expect( existingBlock.length ).toEqual( 1 );
		expect( existingBlock[ 0 ].name ).toEqual( "existingBlock" );
		expect( existingBlock[ 0 ].result ).toEqual( BlockValidation.Valid );
	} );
} );
