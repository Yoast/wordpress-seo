import Heading from "../../../../src/tree/structure/nodes/Heading";
import Node from "../../../../src/tree/structure/nodes/Node";
import Paragraph from "../../../../src/tree/structure/nodes/Paragraph";
import StructuredNode from "../../../../src/tree/structure/nodes/StructuredNode";

describe( "Node", () => {
	beforeEach( () => {
		console.warn = jest.fn();
	} );

	describe( "constructor", () => {
		it( "creates a new Node", () => {
			const node = new Node( "someNode" );

			expect( node.type ).toEqual( "someNode" );
			expect( node.startIndex ).toEqual( 0 );
			expect( node.endIndex ).toEqual( 0 );
		} );
	} );

	describe( "map function", () => {
		it( "maps over a tree with one node.", () => {
			const tree = new Node( "node" );
			tree.map( node => {
				node.endIndex = 20;
				return node;
			} );
			expect( tree.endIndex ).toEqual( 20 );
		} );

		it( "maps over a tree with multiple nodes.", () => {
			const paragraph = new Paragraph( "p" );
			paragraph.startIndex = 13;
			paragraph.endIndex = 20;
			paragraph.text = "Hello world!!!";

			const heading = new Heading( 1 );
			heading.startIndex = 3;
			heading.endIndex = 12;
			heading.text = "A Message to the Globe";

			const div = new StructuredNode( "div" );
			div.startIndex = 13;
			div.endIndex = 20;
			div.children = [ paragraph ];

			const tree = new StructuredNode( "root" );
			tree.startIndex = 0;
			tree.endIndex = 20;
			tree.children = [ heading, div ];

			tree.map( node => {
				if ( node instanceof Paragraph || node instanceof Heading ) {
					node.text = "[REDACTED]";
				}
				return node;
			} );

			expect( tree.children[ 0 ].text ).toEqual( "[REDACTED]" );
			expect( tree.children[ 1 ].children[ 0 ].text ).toEqual( "[REDACTED]" );
		} );
	} );
} );

