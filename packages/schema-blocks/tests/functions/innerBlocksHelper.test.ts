import { getInnerblocksOfType } from "../../src/functions/innerBlocksHelper";
import { InnerBlocks } from "../../src/instructions/blocks/InnerBlocks";
import { BlockInstance } from "@wordpress/blocks";

const blocks = [
    {
        clientId : "block1",
        name: "InnerBlocks",
        innerBlocks : [
            { 
                clientId : "innerblock1", 
                name : "innerblock_nested" 
            } as BlockInstance,
            { 
                clientId : "innerblock2", 
                name : "unwanted_nested_innerblock" 
            } as BlockInstance,
        ],
    } as BlockInstance,
    { 
        clientId : "block2",
        name : "innerblock_immediate",
        innerBlocks : null
    } as BlockInstance,

    { 
        clientId : "block3",
        name : "innerblock_immediate_unwanted",
        innerBlocks : null
    } as BlockInstance,
];

const needles = [ "innerblock_nested", "innerblock_immediate" ];
const unwanted_needles = [ "unwanted_nested_innerblock", "innerblock_immediate_unwanted" ];

describe( "The getInnerBlocks function", () => {    
    const result = getInnerblocksOfType( needles, blocks );

	it( "returns all of the wanted innerblocks.", () => {
        expect( needles.every( needle => result.some( block => block.name === needle ) ) );
        expect( result.length ).toEqual( needles.length );
	} );

	it( "returns none of the unwanted innerblocks.", () => {
		expect( result.every( block => unwanted_needles.every( needle => block.name !== needle ) ) ).toBe( true );
	} );
} );
