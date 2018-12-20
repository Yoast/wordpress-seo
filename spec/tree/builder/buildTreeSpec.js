import buildTree from "../../../src/tree/builder/buildTree";
import treeToStringifiedJSON from "../../../src/tree/utils/treeToStringifiedJSON";
import FormattingElement from "../../../src/tree/values/FormattingElement";
import Heading from "../../../src/tree/values/nodes/Heading";
import List from "../../../src/tree/values/nodes/List";
import ListItem from "../../../src/tree/values/nodes/ListItem";
import Paragraph from "../../../src/tree/values/nodes/Paragraph";

import StructuredIrrelevant from "../../../src/tree/values/nodes/StructuredIrrelevant";
import StructuredNode from "../../../src/tree/values/nodes/StructuredNode";
import TextContainer from "../../../src/tree/values/nodes/TextContainer";

import htmlFile from "../../fullTextTests/testTexts/en/englishPaper1.html";
import htmlFile2 from "../../fullTextTests/testTexts/de/germanPaper2.html";

describe( "build tree", () => {
	it( "can build a tree from html", () => {
		const html = "<section>This? is a section.</section>";

		const paragraph = new Paragraph();
		paragraph.startIndex = 9;
		paragraph.endIndex = 28;
		paragraph.text = "This? is a section.";

		const section = new StructuredNode( "section" );
		section.startIndex = 0;
		section.endIndex = 38;
		section.children = [ paragraph ];

		const expected = new StructuredNode( "root" );
		expected.startIndex = 0;
		expected.endIndex = 38;
		expected.children = [ section ];

		const tree = buildTree( html );

		expect( treeToStringifiedJSON( tree ) ).toEqual( treeToStringifiedJSON( expected ) );
	} );

	it( "can parse an HTML into a Paragraph", () => {
		const input = "<p>This <strong id='some-id'>sentence</strong> needs to be " +
			"<em><strong class='weak'>read</strong></em> to have value as a sentence.</p>";

		const tree = buildTree( input );

		const strong1 = new FormattingElement( "strong", { id: "some-id" } );
		strong1.startIndex = 8;
		strong1.endIndex = 46;

		const strong2 = new FormattingElement( "strong", { "class": "weak" } );
		strong2.startIndex = 63;
		strong2.endIndex = 97;

		const em = new FormattingElement( "em", {} );
		em.startIndex = 59;
		em.endIndex = 102;

		const textContainer = new TextContainer();
		textContainer.text = "This sentence needs to be read to have value as a sentence.";
		textContainer.formatting = [ strong1, em, strong2 ];

		const paragraph = new Paragraph( "p" );
		paragraph.startIndex = 0;
		paragraph.endIndex = 135;
		paragraph.textContainer = textContainer;

		const expected = new StructuredNode( "root" );
		expected.startIndex = 0;
		expected.endIndex = 135;
		expected.children = [ paragraph ];

		expect(  treeToStringifiedJSON( tree ) ).toEqual( treeToStringifiedJSON( expected ) );
	} );

	it( "can parse an HTML into a Heading", () => {
		const input = "<h1>This heading needs to be read to have value as a heading.</h1>";

		const tree = buildTree( input );

		const heading = new Heading( 1 );
		heading.startIndex = 0;
		heading.endIndex = 66;
		heading.text = "This heading needs to be read to have value as a heading.";

		const expected = new StructuredNode( "root" );
		expected.startIndex = 0;
		expected.endIndex = 66;
		expected.children = [ heading ];

		expect(  treeToStringifiedJSON( tree ) ).toEqual( treeToStringifiedJSON( expected ) );
	} );

	it( "can parse an HTML comment into Structured Irrelevant node", () => {
		const input = "<section><!-- An unimportant comment. --></section>";

		const tree = buildTree( input );

		const comment = new StructuredIrrelevant( "comment" );
		comment.startIndex = 9;
		comment.endIndex = 41;
		comment.content = "<!-- An unimportant comment. -->";

		const section = new StructuredNode( "section" );
		section.startIndex = 0;
		section.endIndex = 51;
		section.children = [ comment ];

		const expected = new StructuredNode( "root" );
		expected.startIndex = 0;
		expected.endIndex = 51;
		expected.children = [ section ];

		expect( treeToStringifiedJSON( tree ) ).toEqual( treeToStringifiedJSON( expected ) );
	} );

	it( "can parse HTML into a List with ListItems, which are simple paragraphs", () => {
		const input = "<ul><li>Coffee</li><li>Tea</li></ul>";

		const tree = buildTree( input );

		const paragraph1 = new Paragraph( "" );
		paragraph1.startIndex = 8;
		paragraph1.endIndex = 14;
		paragraph1.text = "Coffee";

		const listItem1 = new ListItem();
		listItem1.startIndex = 4;
		listItem1.endIndex = 19;
		listItem1.children = [ paragraph1 ];

		const paragraph2 = new Paragraph( "" );
		paragraph2.startIndex = 23;
		paragraph2.endIndex = 26;
		paragraph2.text = "Tea";

		const listItem2 = new ListItem();
		listItem2.startIndex = 19;
		listItem2.endIndex = 31;
		listItem2.children = [ paragraph2 ];

		const list = new List( false );
		list.startIndex = 0;
		list.endIndex = 36;
		list.children = [ listItem1, listItem2 ];

		const expected = new StructuredNode( "root" );
		expected.startIndex = 0;
		expected.endIndex = 36;
		expected.children = [ list ];

		expect(  treeToStringifiedJSON( tree ) ).toEqual( treeToStringifiedJSON( expected ) );
	} );

	it( "can parse HTML into a List with ListItems, which are simple paragraphs or structured nodes", () => {
		const input = "<ul><li>Coffee</li><li><section>Tea</section></li></ul>";

		const tree = buildTree( input );

		const paragraph1 = new Paragraph( "" );
		paragraph1.startIndex = 8;
		paragraph1.endIndex = 14;
		paragraph1.text = "Coffee";

		const listItem1 = new ListItem();
		listItem1.startIndex = 4;
		listItem1.endIndex = 19;
		listItem1.children = [ paragraph1 ];

		const paragraph2 = new Paragraph( "" );
		paragraph2.startIndex = 32;
		paragraph2.endIndex = 35;
		paragraph2.text = "Tea";

		const structuredNode = new StructuredNode( "section" );
		structuredNode.startIndex = 23;
		structuredNode.endIndex = 45;
		structuredNode.children = [ paragraph2 ];

		const listItem2 = new ListItem();
		listItem2.startIndex = 19;
		listItem2.endIndex = 50;
		listItem2.children = [ structuredNode ];

		const list = new List( false );
		list.startIndex = 0;
		list.endIndex = 55;
		list.children = [ listItem1, listItem2 ];

		const expected = new StructuredNode( "root" );
		expected.startIndex = 0;
		expected.endIndex = 55;
		expected.children = [ list ];

		expect(  treeToStringifiedJSON( tree ) ).toEqual( treeToStringifiedJSON( expected ) );
	} );


	it( "can parse an HTML text into a StructuredNode with embedded children", () => {
		const input = "<section><div>This sentence. Another sentence.</div></section>";

		const tree = buildTree( input );

		const paragraph = new Paragraph( "" );
		paragraph.startIndex = 14;
		paragraph.endIndex = 46;
		paragraph.text = "This sentence. Another sentence.";

		const structuredNode = new StructuredNode( "div" );
		structuredNode.startIndex = 9;
		structuredNode.endIndex = 52;
		structuredNode.children = [ paragraph ];

		const section = new StructuredNode( "section" );
		section.startIndex = 0;
		section.endIndex = 62;
		section.children = [ structuredNode ];

		const expected = new StructuredNode( "root" );
		expected.startIndex = 0;
		expected.endIndex = 62;
		expected.children = [ section ];

		expect(  treeToStringifiedJSON( tree ) ).toEqual( treeToStringifiedJSON( expected ) );
	} );

	it( "can parse an HTML text into a StructuredNode with a few siblings", () => {
		const input = "<section><h1>First heading</h1><p>This sentence. Another sentence.</p></section>";

		const tree = buildTree( input );

		const heading = new Heading( 1 );
		heading.startIndex = 9;
		heading.endIndex = 31;
		heading.text = "First heading";

		const paragraph = new Paragraph( "p" );
		paragraph.startIndex = 31;
		paragraph.endIndex = 70;
		paragraph.text = "This sentence. Another sentence.";

		const section = new StructuredNode( "section" );
		section.startIndex = 0;
		section.endIndex = 80;
		section.children = [ heading, paragraph ];

		const expected = new StructuredNode( "root" );
		expected.startIndex = 0;
		expected.endIndex = 80;
		expected.children = [ section ];

		expect(  treeToStringifiedJSON( tree ) ).toEqual( treeToStringifiedJSON( expected ) );
	} );

	it( "can parse an irrelevant HTML-element and its contents into a StructuredIrrelevant node.", () => {
		const input = "<section>" +
			"<h1>First heading</h1>" +
			// Pre elements and contents should not be parsed.
			"<pre>This sentence. <div><p>Another <strong>sentence</strong>.</p></div></pre>" +
			"</section>";

		const tree = buildTree( input );

		const heading = new Heading( 1 );
		heading.startIndex = 9;
		heading.endIndex = 31;
		heading.text = "First heading";

		const irrelevant = new StructuredIrrelevant( "pre" );
		irrelevant.startIndex = 31;
		irrelevant.endIndex = 109;
		irrelevant.content = "<pre>This sentence. <div><p>Another <strong>sentence</strong>.</p></div></pre>";

		const section = new StructuredNode( "section" );
		section.startIndex = 0;
		section.endIndex = 119;
		section.children = [ heading, irrelevant ];

		const expected = new StructuredNode( "root" );
		expected.startIndex = 0;
		expected.endIndex = 119;
		expected.children = [ section ];

		expect(  treeToStringifiedJSON( tree ) ).toEqual( treeToStringifiedJSON( expected ) );
	} );

	it( "can parse an HTML-text with text upfront", () => {
		const input = "This is some text.<p>This is a paragraph.</p>";

		const paragraph1 = new Paragraph( "" );
		paragraph1.startIndex = 0;
		paragraph1.endIndex = 18;
		paragraph1.text = "This is some text.";

		const paragraph2 = new Paragraph( "p" );
		paragraph2.startIndex = 18;
		paragraph2.endIndex = 45;
		paragraph2.text = "This is a paragraph.";

		const expected = new StructuredNode( "root" );
		expected.startIndex = 0;
		expected.endIndex = 45;
		expected.children = [ paragraph1, paragraph2 ];

		const tree = buildTree( input );

		expect( treeToStringifiedJSON( tree ) ).toEqual( treeToStringifiedJSON( expected ) );
	} );

	it( "can parse a big html text", () => {
		buildTree( htmlFile );
	} );

	it( "can parse another big html text", () => {
		buildTree( htmlFile2 );
	} );
} );
