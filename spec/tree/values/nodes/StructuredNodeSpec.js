import StructuredNode from "../../../../src/tree/values/nodes/StructuredNode";

describe( "StructuredNode", () => {
	it( "can make a StructuredNode node", () => {
		const startIndex = 0;
		const endIndex = 5;
		const children = [ "a", 1, true ];
		const tag = "div";

		const structuredTextNode = new StructuredNode( startIndex, endIndex, tag, children );
		expect( structuredTextNode.type ).toEqual( "structuredNode" );
		expect( structuredTextNode.startIndex ).toEqual( startIndex );
		expect( structuredTextNode.endIndex ).toEqual( endIndex );
		expect( structuredTextNode.children ).toEqual( children );
		expect( structuredTextNode.tag ).toEqual( tag );
	} );

	it( "can make a StructuredNode node, without children", () => {
		const startIndex = 0;
		const endIndex = 5;
		const tag = "div";

		const structuredTextNode = new StructuredNode( startIndex, endIndex, tag );
		expect( structuredTextNode.type ).toEqual( "structuredNode" );
		expect( structuredTextNode.startIndex ).toEqual( startIndex );
		expect( structuredTextNode.endIndex ).toEqual( endIndex );
		expect( structuredTextNode.children ).toEqual( [] );
		expect( structuredTextNode.tag ).toEqual( tag );
	} );
} );
