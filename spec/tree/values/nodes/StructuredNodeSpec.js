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

	describe( "map and filter function", () => {
		let structuredNode;

		beforeEach( () => {
			const startIndex = 0;
			const endIndex = 5;
			const children = [
				new StructuredNode( 8, 12, [
					new StructuredNode( 16, 18, [], "div" ),
				], "section" ),
				new StructuredNode( 16, 18, [], "nav" ),
			];
			const tag = "div";

			structuredNode = new StructuredNode( startIndex, endIndex, children, tag );
		} );

		it( "can apply a mapping function to a tree with multiple nodes.", () => {
			const nodeAfterMapping = structuredNode.map( node => {
				node.endIndex = 666;
				return node;
			} );

			expect( nodeAfterMapping.endIndex ).toEqual( 666 );
			expect( nodeAfterMapping.children[ 0 ].endIndex ).toEqual( 666 );
			expect( nodeAfterMapping.children[ 1 ].endIndex ).toEqual( 666 );
			expect( nodeAfterMapping.children[ 0 ].children[ 0 ].endIndex ).toEqual( 666 );
		} );

		it( "can apply a filter function to a tree with multiple nodes.", () => {
			const nodeAfterFiltering = structuredNode.filter( node => {
				return node.startIndex === 16;
			} );

			expect( nodeAfterFiltering.length ).toEqual( 2 );
			expect( nodeAfterFiltering[ 0 ].tag ).toEqual( "div" );
			expect( nodeAfterFiltering[ 1 ].tag ).toEqual( "nav" );
		} );

		it( "can apply a filter function to a tree with no children.", () => {
			structuredNode.children = null;
			const nodeAfterFiltering = structuredNode.filter( node => {
				return node.startIndex === 16;
			} );

			expect( nodeAfterFiltering.length ).toEqual( 0 );
		} );

		it( "can apply a map function to a tree with no children.", () => {
			structuredNode.children = null;
			const nodeAfterMapping = structuredNode.map( node => {
				node.startIndex = 4;
				return node;
			} );

			expect( nodeAfterMapping.startIndex ).toEqual( 4 );
		} );
	} );
} );
