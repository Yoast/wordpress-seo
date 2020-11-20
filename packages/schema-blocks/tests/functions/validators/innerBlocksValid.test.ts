import * as innerBlocksValid from "../../../src/functions/validators/innerBlocksValid";
import { InvalidBlock } from "../../../src/instructions/blocks/dto";
import { InvalidBlockReason } from "../../../src/instructions/blocks/enums";

const createInvalidBlockArrangement = [
    { type: "missingblock", reason: InvalidBlockReason.Missing } ,
    { type: "redundantblock", reason: InvalidBlockReason.TooMany },
    { type: "invalidblock", reason: InvalidBlockReason.Internal },
];

describe.each( createInvalidBlockArrangement )( "The createInvalidBlock function", data => {    
    it ( `creates an InvalidBlock instance with type '${data.type}' and reason '${data.reason}'.`, () => {
        var result = innerBlocksValid.createInvalidBlock( data.type, data.reason);
        expect ( result.type ).toBe ( data.type );
        expect ( result.reason ).toBe ( data.reason );
    });
});
