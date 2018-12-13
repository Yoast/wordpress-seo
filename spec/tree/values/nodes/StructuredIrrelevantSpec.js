import StructuredIrrelevant from "../../../../src/tree/values/nodes/StructuredIrrelevant";

describe( "StructuredIrrelevant", () => {
	it( "constructor", () => {
		const structuredIrrelevant = new StructuredIrrelevant( "script" );
		expect( structuredIrrelevant.type ).toEqual( "StructuredIrrelevant" );
		expect( structuredIrrelevant.tag ).toEqual( "script" );
		expect( structuredIrrelevant instanceof StructuredIrrelevant ).toEqual( true );
	} );
} );
