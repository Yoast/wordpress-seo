import TreeAdapter from "../../../src/tree/builder/TreeAdapter";
import StructuredIrrelevant from "../../../src/tree/values/nodes/StructuredIrrelevant";
import Heading from "../../../src/tree/values/nodes/Heading";
import Paragraph from "../../../src/tree/values/nodes/Paragraph";
import List from "../../../src/tree/values/nodes/List";
import ListItem from "../../../src/tree/values/nodes/ListItem";
import StructuredNode from "../../../src/tree/values/nodes/StructuredNode";
import TextContainer from "../../../src/tree/values/nodes/TextContainer";

describe( "TreeAdapter", () => {
	describe( "TreeAdapter constructor", () => {
		it( "can make a TreeAdapter", () => {
			const adapter = new TreeAdapter();

			expect( adapter.currentParentNode ).toBe( null );
		} );
	} );

	describe( "TreeAdapter createElement", () => {
		it( "can create an irrelevant structured node", () => {
			const adapter = new TreeAdapter();

			const expectedStructuredIrrelevant = adapter.createElement( "script" );

			expect( expectedStructuredIrrelevant instanceof StructuredIrrelevant ).toBe( true );
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
} );
