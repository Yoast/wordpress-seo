import Heading from "../../../../../src/parsedPaper/structure/tree/nodes/Heading";
import Node from "../../../../../src/parsedPaper/structure/tree/nodes/Node";
import Paragraph from "../../../../../src/parsedPaper/structure/tree/nodes/Paragraph";
import StructuredNode from "../../../../../src/parsedPaper/structure/tree/nodes/StructuredNode";

describe( "Node", () => {
	const sourceCodeLocation = {
		startTag: {
			startOffset: 0,
			endOffset: 4,
		},
		endTag: {
			startOffset: 12,
			endOffset: 17,
		},
		startOffset: 0,
		endOffset: 17,
	};

	beforeEach( () => {
		console.warn = jest.fn();
	} );

	describe( "constructor", () => {
		it( "creates a new Node", () => {
			const node = new Node( "someNode", sourceCodeLocation );

			expect( node.type ).toEqual( "someNode" );
			expect( node.sourceCodeLocation ).toEqual( sourceCodeLocation );
		} );
	} );

	describe( "map function", () => {
		it( "maps over a tree with one node.", () => {
			const tree = new Node( "node", sourceCodeLocation );
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

			const heading = new Heading( 1, sourceCodeLocation );
			heading.sourceStartIndex = 3;
			heading.sourceEndIndex = 12;
			heading.text = "A Message to the Globe";

			const div = new StructuredNode( "div", sourceCodeLocation );
			div.sourceStartIndex = 13;
			div.sourceEndIndex = 20;
			div.children = [ paragraph ];

			const tree = new StructuredNode( "root", sourceCodeLocation );
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

		it( "recursively calls itself", () => {
			const heading = new Heading( 1, sourceCodeLocation );
			heading.sourceStartIndex = 3;
			heading.sourceEndIndex = 12;
			heading.text = "A Message to the Globe";

			const tree = new StructuredNode( "root", sourceCodeLocation );
			tree.sourceStartIndex = 0;
			tree.sourceEndIndex = 20;
			tree.children = [ heading ];

			const mockFunction = jest.fn();

			tree.map( node => {
				mockFunction( node );
				return node;
			} );

			expect( mockFunction.mock.calls ).toEqual( [ [ tree ], [ heading ] ] );
		} );
	} );

	describe( "forEach function", () => {
		it( "recursively calls the forEach function on each node of the tree", () => {
			const heading = new Heading( 1, sourceCodeLocation );
			heading.sourceStartIndex = 3;
			heading.sourceEndIndex = 12;
			heading.text = "A Message to the Globe";

			const tree = new StructuredNode( "root", sourceCodeLocation );
			tree.sourceStartIndex = 0;
			tree.sourceEndIndex = 20;
			tree.children = [ heading ];

			const mockFunction = jest.fn();

			tree.forEach( node => {
				mockFunction( node );
			} );

			expect( mockFunction.mock.calls ).toEqual( [ [ tree ], [ heading ] ] );
		} );

		it( "does not recursively call the forEach function when a node has no children", () => {
			const tree = new StructuredNode( "root", sourceCodeLocation );
			tree.sourceStartIndex = 0;
			tree.sourceEndIndex = 20;
			tree.children = [ ];

			const mockFunction = jest.fn();

			tree.forEach( node => {
				mockFunction( node );
			} );

			expect( mockFunction.mock.calls ).toEqual( [ [ tree ] ] );
		} );
	} );
} );

