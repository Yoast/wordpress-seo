import { BlockInstance } from "@wordpress/blocks";
import * as innerBlocksValid from "../../../src/functions/validators/innerBlocksValid";
import { InvalidBlock, RequiredBlock } from "../../../src/instructions/blocks/dto";
import { InvalidBlockReason, RequiredBlockOption } from "../../../src/instructions/blocks/enums";

const createInvalidBlockTestArrangement = [
    { name: "missingblock", reason: InvalidBlockReason.Missing } ,
    { name: "redundantblock", reason: InvalidBlockReason.TooMany },
    { name: "invalidblock", reason: InvalidBlockReason.Internal },
];

describe.each( createInvalidBlockTestArrangement )( "The createInvalidBlock function", input => {    
    it ( `creates an InvalidBlock instance with name '${input.name}' and reason '${input.reason}'.`, () => {
        var result = innerBlocksValid.createInvalidBlock( input.name, input.reason );
        expect( result.name ).toBe ( input.name );
        expect( result.reason ).toBe ( input.reason );
    });
});

describe("The findMissingBlocks function", () => {
    it ( "creates an InvalidBlock instance with name 'missingblock' and reason 'missing'.", () => {
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
});
