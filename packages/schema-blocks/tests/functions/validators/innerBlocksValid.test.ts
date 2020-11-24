import { BlockInstance } from "@wordpress/blocks";
import * as innerBlocksValid from "../../../src/functions/validators/innerBlocksValid";
import { InvalidBlock } from "../../../src/instructions/blocks/dto";
import { InvalidBlockReason } from "../../../src/instructions/blocks/enums";

const createInvalidBlockTestArrangement = [
    { type: "missingblock", reason: InvalidBlockReason.Missing } ,
    { type: "redundantblock", reason: InvalidBlockReason.TooMany },
    { type: "invalidblock", reason: InvalidBlockReason.Internal },
];

describe.each( createInvalidBlockTestArrangement )( "The createInvalidBlock function", data => {    
    it ( `creates an InvalidBlock instance with type '${data.type}' and reason '${data.reason}'.`, () => {
        var result = innerBlocksValid.createInvalidBlock( data.type, data.reason);
        expect( result.type ).toBe ( data.type );
        expect( result.reason ).toBe ( data.reason );
    });
});

describe("The findMissingBlocks function", () => {
    it ( "creates an InvalidBlock instance with type 'missingblock' and reason 'missing'.", () => {
        // Arrange.
        const requiredBlockNames : string[] = [ "existingblock", "missingblock" ] ;
        const existingRequiredBlocks : BlockInstance[] = [ 
            {
                name: "existingblock"
            } as BlockInstance,
        ]; 

        // Act.
        const result: InvalidBlock[] = innerBlocksValid.findMissingBlocks( requiredBlockNames, existingRequiredBlocks );

        // Assert.
        expect( result.length ).toBe( 1 );
        expect( result[0].type ).toBe( "missingblock" );
        expect( result[0].reason ).toBe( InvalidBlockReason.Missing );
    });
});
