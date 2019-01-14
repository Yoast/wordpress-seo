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
			expect( node.sourceStartIndex ).toEqual( 0 );
			expect( node.sourceEndIndex ).toEqual( 0 );
		} );
	} );

	describe( "map function", () => {
		it( "maps over a tree with one node.", () => {
			const tree = new Node( "node" );
			tree.map( node => {
				node.sourceEndIndex = 20;
				return node;
			} );
			expect( tree.sourceEndIndex ).toEqual( 20 );
		} );

		it( "maps over a tree with multiple nodes.", () => {
			const paragraph = new Paragraph( "p" );
			paragraph.sourceStartIndex = 13;
			paragraph.sourceEndIndex = 20;
			paragraph.text = "Hello world!!!";

			const heading = new Heading( 1 );
			heading.sourceStartIndex = 3;
			heading.sourceEndIndex = 12;
			heading.text = "A Message to the Globe";

			const div = new StructuredNode( "div" );
			div.sourceStartIndex = 13;
			div.sourceEndIndex = 20;
			div.children = [ paragraph ];

			const tree = new StructuredNode( "root" );
			tree.sourceStartIndex = 0;
			tree.sourceEndIndex = 20;
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

