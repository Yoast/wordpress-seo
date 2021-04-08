import { BlockInstance } from "@wordpress/blocks";
import BlockInstruction from "../../../src/core/blocks/BlockInstruction";
import { BlockValidation } from "../../../src/core/validation";

/**
 * Test class, to be able to test the non-abstract BlockInstruction methods.
 */
class TestBlockInstruction extends BlockInstruction {
}

/**
 * Test class, to be able to test the non-abstract BlockInstruction methods.
 */
class CoreWhateverInstruction extends TestBlockInstruction {
}

describe( "The BlockInstruction class", () => {
	describe( "validate method", () => {
		it( "considers a core block with no required attributes Valid, if Gutenberg seems to think so.", () => {
			const blockInstruction = new CoreWhateverInstruction( 11, null );

			const blockInstance: BlockInstance = {
				clientId: "clientid",
				name: "core/whatever",
				innerBlocks: [],
				isValid: true,
				attributes: {},
			};

			const result = blockInstruction.validate( blockInstance );
			expect( result.name ).toEqual( "CoreWhateverInstruction" );
			expect( result.result ).toEqual( BlockValidation.Valid );
			expect( result.issues.length ).toEqual( 0 );
		} );

		it( "considers a core block with no required attributes Invalid, if Gutenberg seems to think so.", () => {
			const blockInstruction = new CoreWhateverInstruction( 11, null );

			const blockInstance: BlockInstance = {
				clientId: "clientid",
				name: "core/whatever",
				innerBlocks: [],
				isValid: false,
				attributes: {},
			};

			const result = blockInstruction.validate( blockInstance );
			expect( result.name ).toEqual( "CoreWhateverInstruction" );
			expect( result.result ).toEqual( BlockValidation.Invalid );
			expect( result.issues.length ).toEqual( 1 );

			const issue = result.issues[ 0 ];
			expect( issue.name ).toEqual( "CoreWhateverInstruction" );
			expect( issue.result ).toEqual( BlockValidation.Invalid );
			expect( issue.issues.length ).toEqual( 0 );
		} );

		it( "considers a required attribute to be valid if it exists and is not empty", () => {
			const blockInstruction = new TestBlockInstruction( 11, { name: "title", required: true } );

			const blockInstance: BlockInstance = {
				clientId: "clientid",
				name: "blockName",
				innerBlocks: [],
				isValid: true,
				attributes: {
					title: "Hello, world!",
				},
			};

			const result = blockInstruction.validate( blockInstance );
			expect( result.name ).toEqual( "TestBlockInstruction" );
			expect( result.result ).toEqual( BlockValidation.Valid );
			expect( result.issues.length ).toEqual( 0 );
		} );

		it( "considers a core block with a required attribute to be valid if the attribute exists and is not empty", () => {
			const blockInstruction = new TestBlockInstruction( 11, { name: "title", required: true } );

			const blockInstance: BlockInstance = {
				clientId: "clientid",
				name: "core/whatever",
				innerBlocks: [],
				isValid: true,
				attributes: {
					title: "Hello, world!",
				},
			};

			const result = blockInstruction.validate( blockInstance );
			expect( result.name ).toEqual( "TestBlockInstruction" );
			expect( result.result ).toEqual( BlockValidation.Valid );
			expect( result.issues.length ).toEqual( 0 );
		} );

		it( "considers a required attribute to be invalid if it does not exist", () => {
			const blockInstruction = new TestBlockInstruction( 11, { name: "title", required: true } );

			const blockInstance: BlockInstance = {
				clientId: "clientid",
				name: "blockName",
				innerBlocks: [],
				isValid: true,
				attributes: {},
			};

			const result = blockInstruction.validate( blockInstance );
			expect( result.name ).toEqual( "TestBlockInstruction" );
			expect( result.result ).toEqual( BlockValidation.MissingAttribute );
			expect( result.issues.length ).toEqual( 1 );

			const issue = result.issues[ 0 ];
			expect( issue.name ).toEqual( "TestBlockInstruction" );
			expect( issue.result ).toEqual( BlockValidation.MissingAttribute );
		} );

		it( "considers a required attribute to be invalid if it is empty", () => {
			const blockInstruction = new TestBlockInstruction( 11, { name: "title", required: true } );

			const blockInstance: BlockInstance = {
				clientId: "clientid",
				name: "blockName",
				innerBlocks: [],
				isValid: true,
				attributes: {
					title: "",
				},
			};

			const result = blockInstruction.validate( blockInstance );
			expect( result.name ).toEqual( "TestBlockInstruction" );
			expect( result.result ).toEqual( BlockValidation.MissingAttribute );
			expect( result.issues.length ).toEqual( 1 );

			const issue = result.issues[ 0 ];
			expect( issue.name ).toEqual( "TestBlockInstruction" );
			expect( issue.result ).toEqual( BlockValidation.MissingAttribute );
		} );
	} );
} );
