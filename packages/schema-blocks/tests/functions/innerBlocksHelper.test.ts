import { getInnerblocksByName, mapBlocksRecursively } from "../../src/functions/innerBlocksHelper";
import { BlockInstance } from "@wordpress/blocks";

const testBlock = {
	name: "testBlock",
	innerBlocks: [
		{
			name: "InnerBlocks",
			innerBlocks: [
				{
					name: "innerblock_nested",
				} as BlockInstance,
				{
					name: "unwanted_nested_innerblock",
				} as BlockInstance,
			],
		} as BlockInstance,

		{
			name: "innerblock_immediate",
		} as BlockInstance,

		{
			name: "innerblock_immediate_unwanted",
		} as BlockInstance,
	],
} as BlockInstance;

const needles = [ "innerblock_nested", "innerblock_immediate" ];
const unwantedNeedles = [ "unwanted_nested_innerblock", "innerblock_immediate_unwanted" ];

describe( "The getInnerBlocks function", () => {
	const result: BlockInstance[] = getInnerblocksByName( testBlock, needles );

	it( "returns all of the wanted inner blocks.", () => {
		expect( needles.every( needle => result.some( block => block.name === needle ) ) );
		expect( result.length ).toEqual( needles.length );
	} );

	it( "returns none of the unwanted inner blocks.", () => {
		expect( result.every( block => unwantedNeedles.every( needle => block.name !== needle ) ) ).toBe( true );
	} );
} );

describe( "The mapBlocksRecursively function", () => {
	it( "returns a flat array with the mapped results", () => {
		const blockNames = mapBlocksRecursively( testBlock.innerBlocks, block => block.name );
		expect( blockNames ).toEqual( [
			"InnerBlocks",
			"innerblock_nested",
			"unwanted_nested_innerblock",
			"innerblock_immediate",
			"innerblock_immediate_unwanted",
		] );
	} );

	it( "returns an empty array when no innerBlocks are present", () => {
		const blockNames = mapBlocksRecursively( [], block => block.name );
		expect( blockNames ).toHaveLength( 0 );
	} );
} );
