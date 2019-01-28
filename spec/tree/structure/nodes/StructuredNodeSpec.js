import StructuredNode from "../../../../src/tree/structure/nodes/StructuredNode";

describe( "StructuredNode", () => {
	describe( "constructor", () => {
		it( "creates a new StructuredNode", () => {
			const structuredTextNode = new StructuredNode( "div" );
			expect( structuredTextNode.type ).toEqual( "StructuredNode" );
			expect( structuredTextNode.sourceStartIndex ).toEqual( 0 );
			expect( structuredTextNode.sourceEndIndex ).toEqual( 0 );
			expect( structuredTextNode.children ).toEqual( [] );
			expect( structuredTextNode.tag ).toEqual( "div" );
		} );
	} );
} );
