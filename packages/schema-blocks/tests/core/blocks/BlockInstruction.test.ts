import BlockInstruction from "../../../src/core/blocks/BlockInstruction";

/**
 * Test class, to be able to test the non-abstract BlockInstruction methods.
 */
class TestBlockInstruction extends BlockInstruction {
}

describe( "BlockInstruction", () => {
	describe( "valid", () => {
		it( "considers a required attribute to be valid if it exists and is not empty", () => {
			const blockInstruction = new TestBlockInstruction( 11, { name: "title", required: true } );

			const properties = {
				attributes: {
					title: "Hello, world!",
				},
			};

			expect( blockInstruction.valid( properties ) ).toEqual( true );
		} );

		it( "considers a required attribute to be invalid if it does not exist", () => {
			const blockInstruction = new TestBlockInstruction( 11, { name: "title", required: true } );

			const properties = {
				attributes: {},
			};

			expect( blockInstruction.valid( properties ) ).toEqual( false );
		} );

		it( "considers a required attribute to be invalid if it is empty", () => {
			const blockInstruction = new TestBlockInstruction( 11, { name: "title", required: true } );

			const properties = {
				attributes: {
					title: "",
				},
			};

			expect( blockInstruction.valid( properties ) ).toEqual( false );
		} );

		it( "considers an attribute without a required option to always be valid.", () => {
			const blockInstruction = new TestBlockInstruction( 11, { name: "title" } );

			const properties = {
				attributes: {
					title: "",
				},
			};

			expect( blockInstruction.valid( properties ) ).toEqual( true );
		} );

		it( "considers a not required attribute to always be valid.", () => {
			const blockInstruction = new TestBlockInstruction( 11, { name: "title", required: false } );

			const properties = {
				attributes: {},
			};

			expect( blockInstruction.valid( properties ) ).toEqual( true );
		} );
	} );
} );
