import { BlockInstance } from "@wordpress/blocks";
import BlockInstruction from "../../../src/core/blocks/BlockInstruction";

/**
 * Test class, to be able to test the non-abstract BlockInstruction methods.
 */
class TestBlockInstruction extends BlockInstruction {
}

describe( "The BlockInstruction class", () => {
	describe( "valid method", () => {
		it( "considers a required attribute to be valid if it exists and is not empty", () => {
			const blockInstruction = new TestBlockInstruction( 11, { name: "title", required: true } );

			const blockInstance: BlockInstance = {
				clientId: "clientid",
				name: "name",
				innerBlocks: [],
				isValid: true,
				attributes: {
					title: "Hello, world!",
				},
			};

			expect( blockInstruction.valid( blockInstance ) ).toEqual( true );
		} );

		it( "considers a required attribute to be invalid if it does not exist", () => {
			const blockInstruction = new TestBlockInstruction( 11, { name: "title", required: true } );

			const blockInstance: BlockInstance = {
				clientId: "clientid",
				name: "name",
				innerBlocks: [],
				isValid: true,
				attributes: {},
			};

			expect( blockInstruction.valid( blockInstance ) ).toEqual( false );
		} );

		it( "considers a required attribute to be invalid if it is empty", () => {
			const blockInstruction = new TestBlockInstruction( 11, { name: "title", required: true } );

			const blockInstance: BlockInstance = {
				clientId: "clientid",
				name: "name",
				innerBlocks: [],
				isValid: true,
				attributes: {
					title: "",
				},
			};

			expect( blockInstruction.valid( blockInstance ) ).toEqual( false );
		} );

		it( "considers an attribute without a required option to always be valid.", () => {
			const blockInstruction = new TestBlockInstruction( 11, { name: "title" } );

			const blockInstance: BlockInstance = {
				clientId: "clientid",
				name: "name",
				innerBlocks: [],
				isValid: true,
				attributes: {
					title: "",
				},
			};

			expect( blockInstruction.valid( blockInstance ) ).toEqual( true );
		} );

		it( "considers a not required attribute to always be valid.", () => {
			const blockInstruction = new TestBlockInstruction( 11, { name: "title", required: false } );

			const blockInstance: BlockInstance = {
				clientId: "clientid",
				name: "name",
				innerBlocks: [],
				isValid: true,
				attributes: {},
			};

			expect( blockInstruction.valid( blockInstance ) ).toEqual( true );
		} );
	} );
} );
