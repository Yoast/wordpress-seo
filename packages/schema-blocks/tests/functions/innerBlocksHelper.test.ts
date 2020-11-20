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
        expect( result.length ).toEqual( 2 );
        // Do not loop over needles so the test error message shows which test fails
		expect( result.some( block => block.name === needles[0] ) === true).toBe( true );
		expect( result.some( block => block.name === needles[1] ) === true).toBe( true );
	} );

	it( "returns none of the unwanted innerblocks.", () => {
		expect( result.every( block => block.name !== unwanted_needles[0] )).toBe( true );
	} );
} );
