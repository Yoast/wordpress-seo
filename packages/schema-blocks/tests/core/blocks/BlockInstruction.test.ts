import { BlockInstance } from "@wordpress/blocks";
import BlockInstruction from "../../../src/core/blocks/BlockInstruction";
import { InstructionOptions } from "../../../src/core/Instruction";
import { BlockPresence, BlockValidation, BlockValidationResult } from "../../../src/core/validation";


/**
 * Test class, to be able to test the non-abstract BlockInstruction methods.
 */
class TestBlockInstruction extends BlockInstruction {
}

describe( "The BlockInstruction class", () => {
	it( "always returns an unknown validation result.", () => {
		// Arrange.
		const instruction = new TestBlockInstruction( 1, {} as unknown as InstructionOptions );
		const blockInstance: BlockInstance = {
			clientId: "clientId",
			name: "test/block",
			innerBlocks: [],
			isValid: true,
			attributes: {},
		};

		// Act.
		const result = instruction.validate( blockInstance );

		// Assert.
		expect( result ).toEqual( new BlockValidationResult( "clientId", "TestBlockInstruction", BlockValidation.Unknown, BlockPresence.Unknown ) );
	} );
} );
