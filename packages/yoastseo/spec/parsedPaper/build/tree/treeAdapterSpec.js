import TreeAdapter from "../../../../src/parsedPaper/build/tree/TreeAdapter";
import FormattingElement from "../../../../src/parsedPaper/structure/tree/FormattingElement";
import Ignored from "../../../../src/parsedPaper/structure/tree/nodes/Ignored";
import Heading from "../../../../src/parsedPaper/structure/tree/nodes/Heading";
import Paragraph from "../../../../src/parsedPaper/structure/tree/nodes/Paragraph";
import List from "../../../../src/parsedPaper/structure/tree/nodes/List";
import ListItem from "../../../../src/parsedPaper/structure/tree/nodes/ListItem";
import StructuredNode from "../../../../src/parsedPaper/structure/tree/nodes/StructuredNode";
import TextContainer from "../../../../src/parsedPaper/structure/tree/TextContainer";

describe( "TreeAdapter", () => {
	describe( "TreeAdapter constructor", () => {
		it( "can make a TreeAdapter", () => {
			const adapter = new TreeAdapter();
			expect( adapter ).toEqual( new TreeAdapter() );
		} );
	} );

	describe( "TreeAdapter createElement", () => {
		it( "can create an irrelevant structured node", () => {
			const adapter = new TreeAdapter();

			const expectedStructuredIrrelevant = adapter.createElement( "script" );

			expect( expectedStructuredIrrelevant instanceof Ignored ).toBe( true );
		} );

		it( "can create a heading node", () => {
			const adapter = new TreeAdapter();

			const expectedHeading = adapter.createElement( "h2" );

			expect( expectedHeading instanceof Heading ).toBe( true );
			expect( expectedHeading.level ).toBe( 2 );
		} );

		it( "can create a paragraph node", () => {
			const adapter = new TreeAdapter();

			const expectedParagraph = adapter.createElement( "p" );

			expect( expectedParagraph instanceof Paragraph ).toBe( true );
		} );

		it( "can create an ordered list node", () => {
			const adapter = new TreeAdapter();

			const expectedList = adapter.createElement( "ol" );

			expect( expectedList instanceof List ).toBe( true );
			expect( expectedList.ordered ).toBe( true );
		} );

		it( "can create an unordered list node", () => {
			const adapter = new TreeAdapter();

			const expectedList = adapter.createElement( "ul" );

			expect( expectedList instanceof List ).toBe( true );
			expect( expectedList.ordered ).toBe( false );
		} );

		it( "can create a listItem node", () => {
			const adapter = new TreeAdapter();

			const expectedListItem = adapter.createElement( "li" );

			expect( expectedListItem instanceof ListItem ).toBe( true );
		} );

		it( "can create a default structured node with a tag", () => {
			const adapter = new TreeAdapter();

			const expectedStructuredNode = adapter.createElement( "div" );

			expect( expectedStructuredNode instanceof StructuredNode ).toBe( true );
		} );

		it( "can create a default structured node without a tag", () => {
			const adapter = new TreeAdapter();

			const expectedStructuredNode = adapter.createElement( "" );

			expect( expectedStructuredNode instanceof StructuredNode ).toBe( true );
		} );

		it( "can create a formatting element without attributes", () => {
			const adapter = new TreeAdapter();

			const expected = adapter.createElement( "strong", "html", [] );

			expect( expected ).toBeInstanceOf( FormattingElement );
			expect( expected.attributes ).toEqual( null );
		} );

		it( "can create a formatting element with attributes", () => {
			const adapter = new TreeAdapter();

			const attributes = [ { name: "href", value: "https://www.yoast.com/" } ];
			const expected = adapter.createElement( "a", "html", attributes );

			expect( expected ).toBeInstanceOf( FormattingElement );
			expect( expected.attributes ).toEqual( { href: "https://www.yoast.com/" } );
		} );
	} );

	describe( "TreeAdapter insertText", () => {
		it( "can add text to a Heading or a Paragraph with an existing TextContainer", () => {
			const textContainer = new TextContainer();
			textContainer.text = "Some text.";

			const heading = new Heading( 2 );
			heading.textContainer = textContainer;

			const adapter = new TreeAdapter();
			adapter.insertText( heading, " Some more text." );

			expect( heading.textContainer.text ).toEqual( "Some text. Some more text." );
		} );

		it( "can add text to a Heading or a Paragraph without a TextContainer", () => {
			const paragraph = new Paragraph();

			const adapter = new TreeAdapter();
			adapter.insertText( paragraph, " Some more text." );

			expect( paragraph.textContainer.text ).toEqual( " Some more text." );
		} );

		it( "can add text to an existing Paragraph within a Node", () => {
			const textContainer = new TextContainer();
			textContainer.text = "Some text.";

			const paragraph = new Paragraph();
			paragraph.textContainer = textContainer;

			const structuredNode = new StructuredNode( "section" );
			structuredNode.children = [ paragraph ];

			const adapter = new TreeAdapter();
			adapter.insertText( structuredNode, " Some more text." );

			expect( structuredNode.children.length ).toBe( 1 );
			expect( structuredNode.children[ 0 ].textContainer.text ).toEqual( "Some text. Some more text." );
		} );

		it( "can add text to the last existing Paragraph within a Node without changing the previous Paragraphs", () => {
			const mockTextContainer = new TextContainer();
			mockTextContainer.text = "No text.";
			const textContainer = new TextContainer();
			textContainer.text = "Some text.";

			const mockParagraph = new Paragraph();
			mockParagraph.textContainer = mockTextContainer;
			const paragraph = new Paragraph();
			paragraph.textContainer = textContainer;

			const structuredNode = new StructuredNode( "section" );
			structuredNode.children = [ mockParagraph, paragraph ];

			expect( structuredNode.children[ 0 ].textContainer.text ).toEqual( "No text." );
			expect( structuredNode.children[ 1 ].textContainer.text ).toEqual( "Some text." );

			const adapter = new TreeAdapter();
			adapter.insertText( structuredNode, " Some more text." );

			expect( structuredNode.children[ 0 ].textContainer.text ).toEqual( "No text." );
			expect( structuredNode.children[ 1 ].textContainer.text ).toEqual( "Some text. Some more text." );
		} );

		it( "can add text to a newly made Paragraph within an empty Node", () => {
			const structuredNode = new StructuredNode( "div" );

			expect( structuredNode.children.length ).toBe( 0 );

			const adapter = new TreeAdapter();
			adapter.insertText( structuredNode, "Add some text." );

			expect( structuredNode.children.length ).toBe( 1 );
			expect( structuredNode.children[ 0 ] instanceof Paragraph ).toBe( true );
			expect( structuredNode.children[ 0 ].textContainer.text ).toEqual( "Add some text." );
		} );

		it( "can add text to a newly made Paragraph within a non-empty Node", () => {
			const textContainer = new TextContainer();
			textContainer.text = "Some text.";

			const paragraph = new Paragraph();
			paragraph.textContainer = textContainer;

			const structuredNode = new StructuredNode( "div" );
			structuredNode.children = [ paragraph, paragraph ];

			expect( structuredNode.children.length ).toBe( 2 );

			const heading = new Heading( 3 );
			heading.textContainer = textContainer;

			structuredNode.children.push( heading );

			expect( structuredNode.children.length ).toBe( 3 );

			const adapter = new TreeAdapter();
			adapter.insertText( structuredNode, "Add some text." );

			expect( structuredNode.children.length ).toBe( 4 );

			expect( structuredNode.children[ 0 ] instanceof Paragraph ).toBe( true );
			expect( structuredNode.children[ 0 ].textContainer.text ).toEqual( "Some text." );

			expect( structuredNode.children[ 1 ] instanceof Paragraph ).toBe( true );
			expect( structuredNode.children[ 1 ].textContainer.text ).toEqual( "Some text." );

			expect( structuredNode.children[ 2 ] instanceof Heading ).toBe( true );
			expect( structuredNode.children[ 2 ].textContainer.text ).toEqual( "Some text." );

			expect( structuredNode.children[ 3 ] instanceof Paragraph ).toBe( true );
			expect( structuredNode.children[ 3 ].textContainer.text ).toEqual( "Add some text." );
		} );
	} );

	describe( "TreeAdapter appendChild", () => {
		it( "appends a node to a node", () => {
			const paragraph = new Paragraph( "p" );

			const section = new StructuredNode( "section" );

			const adapter = new TreeAdapter();
			adapter.appendChild( section, paragraph );

			expect( section.children ).toHaveLength( 1 );
		} );

		it( "wraps a FormattingElement in a Paragraph before adding it to a StructuredNode", () => {
			const structuredNode = new StructuredNode( "section" );
			const formattingElement = new FormattingElement( "strong" );

			const adapter = new TreeAdapter();
			adapter.appendChild( structuredNode, formattingElement );

			expect( structuredNode.children[ 0 ] ).toBeInstanceOf( Paragraph );
		} );

		it( "hoists the formatting element up the tree until it encounters a Paragraph or Heading.", () => {
			const paragraph = new Paragraph( "paragraph" );

			const formattingElement = new FormattingElement( "strong" );
			const nestedFormatting = new FormattingElement( "em" );

			nestedFormatting.parent = formattingElement;
			formattingElement.parent = paragraph;

			paragraph.textContainer.formatting.push( formattingElement );

			const adapter = new TreeAdapter();
			adapter.appendChild( formattingElement, nestedFormatting );

			expect( paragraph.textContainer.formatting ).toHaveLength( 2 );
			expect( paragraph.textContainer.formatting[ 0 ].type ).toEqual( "strong" );
			expect( paragraph.textContainer.formatting[ 1 ].type ).toEqual( "em" );
		} );
	} );

	describe( "TreeAdapter detachNode", () => {
		it( "detaches a node from its parent when it has one", () => {
			const adapter = new TreeAdapter();
			const root = new StructuredNode( "root" );
			const div = new StructuredNode( "div" );
			div.parent = root;

			adapter.detachNode( div );
			expect( div.parent ).toEqual( null );
			expect( root.children ).not.toContain( div );
		} );

		it( "does not detach a node from its parent when it does not have one", () => {
			const adapter = new TreeAdapter();
			const node = new StructuredNode( "root" );

			adapter.detachNode( node );
		} );
	} );

	describe( "TreeAdapter setDocumentMode", () => {
		it( "sets the document mode of an element", () => {
			const adapter = new TreeAdapter();
			const node = new StructuredNode( "div" );
			adapter.setDocumentMode( node, "quirks" );

			expect( node.documentMode ).toEqual( "quirks" );
		} );
	} );
} );
