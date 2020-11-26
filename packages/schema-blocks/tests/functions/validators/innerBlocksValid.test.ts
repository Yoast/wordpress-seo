import { BlockInstance } from "@wordpress/blocks";
import * as innerBlocksValid from "../../../src/functions/validators/innerBlocksValid";
import { InvalidBlock, RequiredBlock } from "../../../src/instructions/blocks/dto";
import { InvalidBlockReason, RequiredBlockOption } from "../../../src/instructions/blocks/enums";

const createInvalidBlockTestArrangement = [
    { name: "missingblock", reason: InvalidBlockReason.Missing } ,
    { name: "redundantblock", reason: InvalidBlockReason.TooMany },
    { name: "invalidblock", reason: InvalidBlockReason.Internal },
    { name: "Optionalblock", reason: InvalidBlockReason.Optional },
];

describe.each( createInvalidBlockTestArrangement )( "The createInvalidBlock function", input => {    
    it ( `creates an InvalidBlock instance with name '${input.name}' and reason '${input.reason}'.`, () => {
        var result = innerBlocksValid.createInvalidBlock( input.name, input.reason );
        expect( result.name ).toBe ( input.name );
        expect( result.reason ).toBe ( input.reason );
    });
});

describe( "The findMissingBlocks function", () => {
    it ( "creates an InvalidBlock instance with and reason 'missing' when a required block is missing.", () => {
        // Arrange.
        const requiredBlocks : RequiredBlock[] = [ 
            { 
                name: "existingblock",
                option : RequiredBlockOption.Multiple, 
            } as RequiredBlock, 
            {
                name: "missingblock",
                option : RequiredBlockOption.Multiple,
            } as RequiredBlock,
        ];
        const existingRequiredBlocks : BlockInstance[] = [ 
            {
                name: "existingblock",
            } as BlockInstance,
        ]; 

        // Act.
        const result: InvalidBlock[] = innerBlocksValid.findMissingBlocks( requiredBlocks, existingRequiredBlocks );

        // Assert.
        expect( result.length ).toBe( 1 );
        expect( result[0].name ).toBe( "missingblock" );
        expect( result[0].reason ).toBe( InvalidBlockReason.Missing );
    });
    it ( "creates no InvalidBlocks when all required blocks are present.", () => {
        // Arrange.
        const requiredBlocks : RequiredBlock[] = [ 
            { 
                name: "existingblock",
                option : RequiredBlockOption.Multiple, 
            } as RequiredBlock,
        ];
        const existingRequiredBlocks : BlockInstance[] = [ 
            {
                name: "existingblock",
            } as BlockInstance,
        ]; 

        // Act.
        const result: InvalidBlock[] = innerBlocksValid.findMissingBlocks( requiredBlocks, existingRequiredBlocks );

        // Assert.
        expect( result.length ).toBe( 0 );
    });
});

describe( "The findRedundantBlocks function", () => {    
    it ( "creates an InvalidBlock instance with reason 'toomany' when a block occurs more than once.", () => {
        // Arrange.
        const requiredBlocks : RequiredBlock[] = [ 
            { 
                name: "duplicateBlock",
                option : RequiredBlockOption.One, 
            } as RequiredBlock,
        ];
        const existingRequiredBlocks : BlockInstance[] = [ 
            {
                name: "duplicateBlock",
            } as BlockInstance,
            {
                name: "duplicateBlock",
            } as BlockInstance,
        ]; 

        // Act.
        const result: InvalidBlock[] = innerBlocksValid.findRedundantBlocks( requiredBlocks, existingRequiredBlocks );

        // Assert.
        expect( result.length ).toBe( 1 );
        expect( result[0].name ).toBe( "duplicateBlock" );
        expect( result[0].reason ).toBe( InvalidBlockReason.TooMany );
    });
    it ( "creates no InvalidBlocks when no redundant blocks are present.", () => {
        // Arrange.
        const requiredBlocks : RequiredBlock[] = [ 
            { 
                name: "duplicateBlock",
                option : RequiredBlockOption.One, 
            } as RequiredBlock,
        ];
        const existingRequiredBlocks : BlockInstance[] = [ 
            {
                name: "duplicateBlock",
            } as BlockInstance,
        ]; 

        // Act.
        const result: InvalidBlock[] = innerBlocksValid.findRedundantBlocks( requiredBlocks, existingRequiredBlocks );

        // Assert.
        expect( result.length ).toBe( 0 );
    });
});

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
        ]
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

        // Act.
        const result: InvalidBlock[] = innerBlocksValid.findSelfInvalidatedBlocks ( requiredBlocks, existingBlocks );

        // Assert.
        expect( result.length ).toBe( 2 );

        const invalidBlock = result.find( x => x.name == "invalidBlock" && x.reason == InvalidBlockReason.Internal );
        expect( invalidBlock.name ).toBe( "invalidBlock" );
        expect( invalidBlock.reason ).toBe( InvalidBlockReason.Internal );

        const invalidOptionalBlock = result.find( x => x.name == "invalidOptionalBlock" && x.reason == InvalidBlockReason.Optional );
        expect( invalidOptionalBlock.name ).toBe( "invalidOptionalBlock" );
        expect( invalidOptionalBlock.reason ).toBe( InvalidBlockReason.Optional );
    })
})

describe( "the getInvalidInnerBlocks function", () => {
    it( "returns all InvalidBlocks for a given block's innerblocks.", () => {
        // Arrange.
        const requiredBlocks : RequiredBlock[] = [ 
            { 
                name: "existingblock",
                option : RequiredBlockOption.Multiple, 
            } as RequiredBlock, 

            { 
                name: "redundantblock",
                option : RequiredBlockOption.One, 
            } as RequiredBlock, 
            {
                name: "missingblock",
                option : RequiredBlockOption.Multiple,
            } as RequiredBlock,
            {
                name: "invalidblock",
                option : RequiredBlockOption.One,
            } as RequiredBlock,
        ];
        const existingBlocks : BlockInstance[] = [ 
            {
                name: "existingblock", // ok
                isValid: true,
            } as BlockInstance,
            {
                name: "redundantblock", // ok
                isValid: true,
                innerBlocks: [
                    {
                        name: "redundantblock", // invalid
                        isValid: true,
                    } as BlockInstance,
                ]
            } as BlockInstance,
            {
                name: "invalidBlock",
                isValid: false, // invalid
                innerBlocks: [
                    {
                        name: "optionalblock", // invalid, optional
                        isValid: true,
                    } as BlockInstance,
                ]
            } as BlockInstance,
        ];
        // var mock = jest.mock("@wordpress/data", () => {
        //     return {
        //         getBlock: function(clientId: string) {
        //             return { innerBlocks: existingBlocks };
        //         },
        //     };
        // } );

        // // Act.
        // const result: InvalidBlock[] = innerBlocksValid.default ( requiredBlocks, "any Client Id" );

        // // Assert.
        // expect ( result.length ).toBe( 3 );
        
        // const missingBlock = result.find(invalidBlock => invalidBlock.reason == InvalidBlockReason.Missing );
        // expect( missingBlock.name ).toBe( "missingblock" );

        // const redundantBlock = result.find(invalidBlock => invalidBlock.reason == InvalidBlockReason.TooMany );
        // expect( redundantBlock.name ).toBe( "redundantblock" );

        // const invalidOptionalBlock = result.find(invalidBlock => invalidBlock.reason == InvalidBlockReason.Optional );
        // expect( invalidOptionalBlock.name ).toBe( "optionalblock" );
    })
})