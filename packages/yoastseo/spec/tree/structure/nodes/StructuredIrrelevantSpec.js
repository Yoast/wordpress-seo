import Ignored from "../../../../src/parsedPaper/structure/tree/nodes/Ignored";

describe( "StructuredIrrelevant", () => {
	describe( "constructor", () => {
		it( "creates a new StructuredIrrelevant node", () => {
			const structuredIrrelevant = new Ignored( "script" );
			expect( structuredIrrelevant.type ).toEqual( "Ignored" );
			expect( structuredIrrelevant.tag ).toEqual( "script" );
			expect( structuredIrrelevant instanceof Ignored ).toEqual( true );
		} );
	} );
} );
