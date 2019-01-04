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
		strong1.startText = 5;
		strong1.endText = 13;

		const strong2 = new FormattingElement( "strong", { "class": "weak" } );
		strong2.startIndex = 63;
		strong2.endIndex = 97;
		strong2.startText = 26;
		strong2.endText = 30;

		const em = new FormattingElement( "em", {} );
		em.startIndex = 59;
		em.endIndex = 102;
		em.startText = 26;
		em.endText = 30;

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
		irrelevant.content = "This sentence. <div><p>Another <strong>sentence</strong>.</p></div>";

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

	it( "adds a new paragraph to the tree when the new paragraph is implicit, and the one before is explicit.", () => {
		const input = "<p>This is a paragraph.</p>This is another paragraph.";

		const paragraph1 = new Paragraph( "p" );
		paragraph1.startIndex = 0;
		paragraph1.endIndex = 27;
		paragraph1.text = "This is a paragraph.";

		const paragraph2 = new Paragraph();
		paragraph2.startIndex = 27;
		paragraph2.endIndex = 53;
		paragraph2.text = "This is another paragraph.";

		const expected = new StructuredNode( "root" );
		expected.startIndex = 0;
		expected.endIndex = 53;
		expected.children = [ paragraph1, paragraph2 ];

		const tree = buildTree( input );

		expect( treeToStringifiedJSON( tree ) ).toEqual( treeToStringifiedJSON( expected ) );
	} );

	it.skip( "discards irrelevant node's contents within paragraphs and headings, but adds them as formatting", () => {
		const input = "<pre>Some text.</pre>" +
			"<p>This is <em>some script<script>console.log('something');</script></em> that should <strong>not</strong> be parsed.</p>";

		const pre = new StructuredIrrelevant( "pre" );
		pre.startIndex = 0;
		pre.endIndex = 21;
		pre.content = "Some text.";

		const em = new FormattingElement( "em", {} );
		em.startIndex = 32;
		em.endIndex = 94;
		em.startText = 8;
		em.endText = 19;

		const script = new FormattingElement( "script", {} );
		script.startIndex = 47;
		script.endIndex = 89;
		// Is -1.
		script.startText = 19;
		// Is -1.
		script.endText = 19;

		const strong = new FormattingElement( "strong", {} );
		strong.startIndex = 107;
		strong.endIndex = 127;
		strong.startText = 32;
		strong.endText = 35;

		const textContainer = new TextContainer();
		textContainer.text = "This is some script that should not be parsed.";
		textContainer.formatting = [ em, script, strong ];

		const paragraph = new Paragraph( "p" );
		paragraph.startIndex = 21;
		paragraph.endIndex = 142;
		paragraph.textContainer = textContainer;

		const expected = new StructuredNode( "root" );
		expected.startIndex = 0;
		expected.endIndex = 142;
		expected.children = [ pre, paragraph ];

		const tree = buildTree( input );
		expect( treeToStringifiedJSON( tree ) ).toEqual( treeToStringifiedJSON( expected ) );
	} );

	it( "parses formatting with the same content correctly", () => {
		const input = "<p><strong>hello world! <em>hello world!</em></strong> <a href='nope'>hello world!</a></p>";

		const strong = new FormattingElement( "strong", {} );
		strong.startIndex = 3;
		strong.endIndex = 54;
		strong.startText = 0;
		strong.endText = 25;

		const emphasis = new FormattingElement( "em", {} );
		emphasis.startIndex = 24;
		emphasis.endIndex = 45;
		emphasis.startText = 13;
		emphasis.endText = 25;

		const anchor = new FormattingElement( "a", { href: "nope" } );
		anchor.startIndex = 55;
		anchor.endIndex = 86;
		anchor.startText = 26;
		anchor.endText = 38;

		const textContainer = new TextContainer();
		textContainer.text = "hello world! hello world! hello world!";
		textContainer.formatting = [ strong, emphasis, anchor	];

		const paragraph = new Paragraph( "p" );
		paragraph.startIndex = 0;
		paragraph.endIndex = 90;
		paragraph.textContainer = textContainer;

		const expected = new StructuredNode( "root" );
		expected.startIndex = 0;
		expected.endIndex = 90;
		expected.children = [ paragraph ];

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
