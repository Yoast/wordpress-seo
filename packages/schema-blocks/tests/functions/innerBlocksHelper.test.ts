import { getInnerblocksByName } from "../../src/functions/innerBlocksHelper";
import { BlockInstance } from "@wordpress/blocks";

const innerBlocks = [
	{
		name: "InnerBlocks",
		innerBlocks: [
			{
				name: "innerblock_nested",
		        innerBlocks: [],
			} as BlockInstance,
			{
				name: "unwanted_nested_innerblock",
		        innerBlocks: [],
			} as BlockInstance,
		],
	} as BlockInstance,
	{
		name: "innerblock_immediate",
		innerBlocks: [],
	} as BlockInstance,
	{
		name: "innerblock_immediate_unwanted",
		innerBlocks: [],
	} as BlockInstance,
];
const testBlock = {
	name: "testBlock",
	innerBlocks: innerBlocks,
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
