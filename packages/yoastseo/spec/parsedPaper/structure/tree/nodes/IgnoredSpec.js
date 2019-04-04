import Ignored from "../../../../../src/parsedPaper/structure/tree/nodes/Ignored";

describe( "Ignored", () => {
	describe( "constructor", () => {
		it( "creates a new Ignored node", () => {
			const ignored = new Ignored( "script" );
			expect( ignored.type ).toEqual( "Ignored" );
			expect( ignored.tag ).toEqual( "script" );
			expect( ignored instanceof Ignored ).toEqual( true );
		} );
	} );
} );
