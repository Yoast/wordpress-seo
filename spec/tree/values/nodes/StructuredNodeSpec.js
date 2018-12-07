import StructuredNode from "../../../../src/tree/values/nodes/StructuredNode";

describe( "StructuredNode", () => {
	it( "can make a StructuredNode node", () => {
		const startIndex = 0;
		const endIndex = 5;
		const children = [ "a", 1, true ];
		const tag = "div";

		const structuredTextNode = new StructuredNode( startIndex, endIndex, children, tag );
		expect( structuredTextNode.type ).toEqual( "structuredNode" );
		expect( structuredTextNode.startIndex ).toEqual( startIndex );
		expect( structuredTextNode.endIndex ).toEqual( endIndex );
		expect( structuredTextNode.children ).toEqual( children );
		expect( structuredTextNode.tag ).toEqual( tag );
	} );
} );
