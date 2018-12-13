import StructuredNode from "../../../../src/tree/values/nodes/StructuredNode";

describe( "StructuredNode", () => {
	it( "constructor", () => {
		const structuredTextNode = new StructuredNode( "div" );
		expect( structuredTextNode.type ).toEqual( "StructuredNode" );
		expect( structuredTextNode.startIndex ).toEqual( 0 );
		expect( structuredTextNode.endIndex ).toEqual( 0 );
		expect( structuredTextNode.children ).toEqual( [] );
		expect( structuredTextNode.tag ).toEqual( "div" );
	} );
} );
