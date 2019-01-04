import StructuredIrrelevant from "../../../../src/tree/structure/nodes/StructuredIrrelevant";

describe( "StructuredIrrelevant", () => {
	describe( "constructor", () => {
		it( "creates a new StructuredIrrelevant node", () => {
			const structuredIrrelevant = new StructuredIrrelevant( "script" );
			expect( structuredIrrelevant.type ).toEqual( "StructuredIrrelevant" );
			expect( structuredIrrelevant.tag ).toEqual( "script" );
			expect( structuredIrrelevant instanceof StructuredIrrelevant ).toEqual( true );
		} );
	} );
} );
