import buildTree from "../../../../../src/parsedPaper/build/tree/html/buildTree";
import { Paragraph, StructuredNode, FormattingElement,
	List, ListItem, Ignored, Heading, TextContainer } from "../../../../../src/parsedPaper/structure/tree";

import htmlFile from "../../../../fullTextTests/testTexts/en/englishPaper1.html";
import htmlFile2 from "../../../../fullTextTests/testTexts/de/germanPaper2.html";

import fullTexts from "../../../../fullTextTests/testTexts";

import buildTreeFromYaml from "../../../../specHelpers/buildTreeFromYaml";

describe( "build tree", () => {
	it( "can build a tree from HTML source code", () => {
		const html = "<section>This? is a section.</section>";

		const expectedYaml = `
Structured:
  tag: root
  children:
    - Structured:
        tag: section
        sourceCodeLocation:
          startTag:
            startOffset: 0
            endOffset: 9
          endTag:
            startOffset: 28
            endOffset: 38
          startOffset: 0
          endOffset: 38
        children:
          - Paragraph:
              isImplicit: true
              sourceCodeLocation:
                startOffset: 9
                endOffset: 28
              text: This? is a section.
		`;

		const expected = buildTreeFromYaml( expectedYaml );

		const tree = buildTree( html );

		expect( tree.toString() ).toEqual( expected.toString() );
	} );

	it( "can parse HTML into a Paragraph", () => {
		const input = "<p>This <strong id='some-id'>sentence</strong> needs to be " +
			"<em><strong class='weak'>read</strong></em> to have value as a sentence.</p>";

		const tree = buildTree( input );

		const expectedYaml = `
Structured:
  tag: root
  children:
    - Paragraph:
        sourceCodeLocation:
          startTag:
            startOffset: 0
            endOffset: 3
          endTag:
            startOffset: 131
            endOffset: 135
          startOffset: 0
          endOffset: 135
        isImplicit: false
        text: This sentence needs to be read to have value as a sentence.
        formatting:
          - strong:
              sourceCodeLocation:
                startTag:
                  startOffset: 8
                  endOffset: 29
                endTag:
                  startOffset: 37
                  endOffset: 46
                startOffset: 8
                endOffset: 46
              textStartIndex: 5
              textEndIndex: 13
              attributes:
                id: some-id
          - em:
              sourceCodeLocation:
                startTag:
                  startOffset: 59
                  endOffset: 63
                endTag:
                  startOffset: 97
                  endOffset: 102
                startOffset: 59
                endOffset: 102
              textStartIndex: 26
              textEndIndex: 30
          - strong:
              sourceCodeLocation:
                startTag:
                  startOffset: 63
                  endOffset: 84
                endTag:
                  startOffset: 88
                  endOffset: 97
                startOffset: 63
                endOffset: 97
              textStartIndex: 26
              textEndIndex: 30
              attributes:
                class: weak
		`;

		const expected = buildTreeFromYaml( expectedYaml );

		expect( tree.toString() ).toEqual( expected.toString() );
	} );

	it( "can parse HTML into a Heading", () => {
		const input = "<h1>This heading needs to be read to have value as a heading.</h1>";

		const expectedYaml = `
Structured:
  tag: root
  children:
    - Heading:
        level: 1
        sourceCodeLocation:
          startTag:
            startOffset: 0
            endOffset: 4
          endTag:
            startOffset: 61
            endOffset: 66
          startOffset: 0
          endOffset: 66
        text: This heading needs to be read to have value as a heading.
		`;

		const expected = buildTreeFromYaml( expectedYaml );
		const tree = buildTree( input );

		expect( tree.toString() ).toEqual( expected.toString() );
	} );

	it( "can parse HTML that contains incomplete closing tags", () => {
		const input = "<h1>This text <!-- comment -->is in the process of getting some h1 tags</ before this text.";

		const expectedYaml = `
Structured:
  tag: root
  children:
    - Heading:
        level: 1
        sourceCodeLocation:
          startTag:
            startOffset: 0
            endOffset: 4
          startOffset: 0
          endOffset: 91
        text: This text is in the process of getting some h1 tags
        formatting:
          - "#comment":
              sourceCodeLocation:
                startOffset: 14
                endOffset: 30
              textStartIndex: 10
              textEndIndex: 10
          - "#comment":
              sourceCodeLocation:
                startOffset: 71
                endOffset: 92
              textStartIndex: 67
              textEndIndex: 67
		`;

		const expected = buildTreeFromYaml( expectedYaml );
		const tree = buildTree( input );

		expect( tree.toString() ).toEqual( expected.toString() );
	} );

	it( "can parse an HTML comment into StructuredIrrelevant node", () => {
		const input = "<section><!-- An unimportant comment. --></section>";

		const expectedYaml = `
Structured:
  tag: root
  children:
    - Structured:
        tag: section
        sourceCodeLocation:
          startTag:
            startOffset: 0
            endOffset: 9
          endTag:
            startOffset: 41
            endOffset: 51
          startOffset: 0
          endOffset: 51
		`;

		const expected = buildTreeFromYaml( expectedYaml );
		const tree = buildTree( input );

		expect( tree.toString() ).toEqual( expected.toString() );
	} );

	it( "can parse HTML into a List with ListItems.", () => {
		const input = "<ul><li>Coffee</li><li>Tea</li></ul>";

		const expectedYaml = `
Structured:
  tag: root
  children:
    - List:
        ordered: false
        sourceCodeLocation:
          startTag:
            startOffset: 0
            endOffset: 4
          endTag:
            startOffset: 31
            endOffset: 36
          startOffset: 0
          endOffset: 36
        children:
          - ListItem:
              sourceCodeLocation:
                startTag:
                  startOffset: 4
                  endOffset: 8
                endTag:
                  startOffset: 14
                  endOffset: 19
                startOffset: 4
                endOffset: 19
              text: Coffee
          - ListItem:
              sourceCodeLocation:
                startTag:
                  startOffset: 19
                  endOffset: 23
                endTag:
                  startOffset: 26
                  endOffset: 31
                startOffset: 19
                endOffset: 31
              text: Tea
		`;

		const expected = buildTreeFromYaml( expectedYaml );
		const tree = buildTree( input );

		expect( tree.toString() ).toEqual( expected.toString() );
	} );

	it( "can parse HTML into a List with ListItems, which are simple paragraphs or structured nodes", () => {
		const input = "<ul><li>Coffee</li><li><section>Tea</section></li></ul>";

		const tree = buildTree( input );

		const paragraph1 = new Paragraph( "" );
		paragraph1.sourceStartIndex = 8;
		paragraph1.sourceEndIndex = 14;
		paragraph1.text = "Coffee";

		const listItem1 = new ListItem();
		listItem1.sourceStartIndex = 4;
		listItem1.sourceEndIndex = 19;
		listItem1.children = [ paragraph1 ];

		const paragraph2 = new Paragraph( "" );
		paragraph2.sourceStartIndex = 32;
		paragraph2.sourceEndIndex = 35;
		paragraph2.text = "Tea";

		const structuredNode = new StructuredNode( "section" );
		structuredNode.sourceStartIndex = 23;
		structuredNode.sourceEndIndex = 45;
		structuredNode.children = [ paragraph2 ];

		const listItem2 = new ListItem();
		listItem2.sourceStartIndex = 19;
		listItem2.sourceEndIndex = 50;
		listItem2.children = [ structuredNode ];

		const list = new List( false );
		list.sourceStartIndex = 0;
		list.sourceEndIndex = 55;
		list.children = [ listItem1, listItem2 ];

		const expected = new StructuredNode( "root" );
		expected.sourceStartIndex = 0;
		expected.sourceEndIndex = 55;
		expected.children = [ list ];

		expect( tree.toString() ).toEqual( expected.toString() );
	} );

	it( "can parse an HTML text into a StructuredNode with embedded children", () => {
		const input = "<section><div>This sentence. Another sentence.</div></section>";

		const tree = buildTree( input );

		const paragraph = new Paragraph( "" );
		paragraph.sourceStartIndex = 14;
		paragraph.sourceEndIndex = 46;
		paragraph.text = "This sentence. Another sentence.";

		const structuredNode = new StructuredNode( "div" );
		structuredNode.sourceStartIndex = 9;
		structuredNode.sourceEndIndex = 52;
		structuredNode.children = [ paragraph ];

		const section = new StructuredNode( "section" );
		section.sourceStartIndex = 0;
		section.sourceEndIndex = 62;
		section.children = [ structuredNode ];

		const expected = new StructuredNode( "root" );
		expected.sourceStartIndex = 0;
		expected.sourceEndIndex = 62;
		expected.children = [ section ];

		expect( tree.toString() ).toEqual( expected.toString() );
	} );

	it( "can parse an HTML text into a StructuredNode with a few siblings", () => {
		const input = "<section><h1>First heading</h1><p>This sentence. Another sentence.</p></section>";

		const tree = buildTree( input );

		const heading = new Heading( 1 );
		heading.sourceStartIndex = 9;
		heading.sourceEndIndex = 31;
		heading.text = "First heading";

		const paragraph = new Paragraph( "p" );
		paragraph.sourceStartIndex = 31;
		paragraph.sourceEndIndex = 70;
		paragraph.text = "This sentence. Another sentence.";

		const section = new StructuredNode( "section" );
		section.sourceStartIndex = 0;
		section.sourceEndIndex = 80;
		section.children = [ heading, paragraph ];

		const expected = new StructuredNode( "root" );
		expected.sourceStartIndex = 0;
		expected.sourceEndIndex = 80;
		expected.children = [ section ];

		expect( tree.toString() ).toEqual( expected.toString() );
	} );

	it( "can parse an irrelevant HTML element and its contents into a StructuredIrrelevant node.", () => {
		const input = "<section>" +
			"<h1>First heading</h1>" +
			// Pre elements and contents should not be parsed.
			"<pre>This sentence. <div><p>Another <strong>sentence</strong>.</p></div></pre>" +
			"</section>";

		const tree = buildTree( input );

		const heading = new Heading( 1 );
		heading.sourceStartIndex = 9;
		heading.sourceEndIndex = 31;
		heading.text = "First heading";

		const irrelevant = new Ignored( "pre" );
		irrelevant.sourceStartIndex = 31;
		irrelevant.sourceEndIndex = 109;
		irrelevant.content = "This sentence. <div><p>Another <strong>sentence</strong>.</p></div>";

		const section = new StructuredNode( "section" );
		section.sourceStartIndex = 0;
		section.sourceEndIndex = 119;
		section.children = [ heading, irrelevant ];

		const expected = new StructuredNode( "root" );
		expected.sourceStartIndex = 0;
		expected.sourceEndIndex = 119;
		expected.children = [ section ];

		expect( tree.toString() ).toEqual( expected.toString() );
	} );

	it( "can parse an HTML text with text in front", () => {
		const input = "This is some text.<p>This is a paragraph.</p>";

		const paragraph1 = new Paragraph( "" );
		paragraph1.sourceStartIndex = 0;
		paragraph1.sourceEndIndex = 18;
		paragraph1.text = "This is some text.";

		const paragraph2 = new Paragraph( "p" );
		paragraph2.sourceStartIndex = 18;
		paragraph2.sourceEndIndex = 45;
		paragraph2.text = "This is a paragraph.";

		const expected = new StructuredNode( "root" );
		expected.sourceStartIndex = 0;
		expected.sourceEndIndex = 45;
		expected.children = [ paragraph1, paragraph2 ];

		const tree = buildTree( input );

		expect( tree.toString() ).toEqual( expected.toString() );
	} );

	it( "adds a new paragraph to the tree when the new paragraph is implicit, and the one before is explicit.", () => {
		const input = "<p>This is a paragraph.</p>This is another paragraph.";

		const paragraph1 = new Paragraph( "p" );
		paragraph1.sourceStartIndex = 0;
		paragraph1.sourceEndIndex = 27;
		paragraph1.text = "This is a paragraph.";

		const paragraph2 = new Paragraph();
		paragraph2.sourceStartIndex = 27;
		paragraph2.sourceEndIndex = 53;
		paragraph2.text = "This is another paragraph.";

		const expected = new StructuredNode( "root" );
		expected.sourceStartIndex = 0;
		expected.sourceEndIndex = 53;
		expected.children = [ paragraph1, paragraph2 ];

		const tree = buildTree( input );

		expect( tree.toString() ).toEqual( expected.toString() );
	} );

	it( "discards irrelevant node's contents within paragraphs and headings, but adds them as formatting", () => {
		const input = "<pre>Some text.</pre>" +
			"<p>This is <em>some script<script>console.log('something');</script></em> that should <strong>not</strong> be parsed.</p>";

		const pre = new Ignored( "pre" );
		pre.sourceStartIndex = 0;
		pre.sourceEndIndex = 21;
		pre.content = "Some text.";

		const em = new FormattingElement( "em" );
		em.sourceStartIndex = 32;
		em.sourceEndIndex = 94;
		em.textStartIndex = 8;
		em.textEndIndex = 19;

		const script = new Ignored( "script" );
		script.sourceStartIndex = 47;
		script.sourceEndIndex = 89;
		script.textStartIndex = 19;
		script.textEndIndex = 19;
		script.content = "console.log('something');";

		const strong = new FormattingElement( "strong" );
		strong.sourceStartIndex = 107;
		strong.sourceEndIndex = 127;
		strong.textStartIndex = 32;
		strong.textEndIndex = 35;

		const textContainer = new TextContainer();
		textContainer.text = "This is some script that should not be parsed.";
		textContainer.formatting = [ em, script, strong ];

		const paragraph = new Paragraph( "p" );
		paragraph.sourceStartIndex = 21;
		paragraph.sourceEndIndex = 142;
		paragraph.textContainer = textContainer;

		const expected = new StructuredNode( "root" );
		expected.sourceStartIndex = 0;
		expected.sourceEndIndex = 142;
		expected.children = [ pre, paragraph ];

		const tree = buildTree( input );
		expect( tree.toString() ).toEqual( expected.toString() );
	} );

	it( "parses formatting with the same content correctly", () => {
		const input = "<p><strong>hello world! <em>hello world!</em></strong> <a href='nope'>hello world!</a></p>";

		const strong = new FormattingElement( "strong" );
		strong.sourceStartIndex = 3;
		strong.sourceEndIndex = 54;
		strong.textStartIndex = 0;
		strong.textEndIndex = 25;

		const emphasis = new FormattingElement( "em" );
		emphasis.sourceStartIndex = 24;
		emphasis.sourceEndIndex = 45;
		emphasis.textStartIndex = 13;
		emphasis.textEndIndex = 25;

		const anchor = new FormattingElement( "a", { href: "nope" } );
		anchor.sourceStartIndex = 55;
		anchor.sourceEndIndex = 86;
		anchor.textStartIndex = 26;
		anchor.textEndIndex = 38;

		const textContainer = new TextContainer();
		textContainer.text = "hello world! hello world! hello world!";
		textContainer.formatting = [ strong, emphasis, anchor	];

		const paragraph = new Paragraph( "p" );
		paragraph.sourceStartIndex = 0;
		paragraph.sourceEndIndex = 90;
		paragraph.textContainer = textContainer;

		const expected = new StructuredNode( "root" );
		expected.sourceStartIndex = 0;
		expected.sourceEndIndex = 90;
		expected.children = [ paragraph ];

		const tree = buildTree( input );
		expect( tree.toString() ).toEqual( expected.toString() );
	} );

	it( "parses HTML with self-closing elements correctly", () => {
		const input = "<p>Let there<br> be an <a href='/image.png'><img src='/image.png' alt='image'/></a></p>";

		const br = new FormattingElement( "br" );
		br.sourceStartIndex = 12;
		br.sourceEndIndex = 16;
		br.textStartIndex = 9;
		br.textEndIndex = 9;

		const anchor = new FormattingElement( "a", { href: "/image.png" } );
		anchor.sourceStartIndex = 23;
		anchor.sourceEndIndex = 83;
		anchor.textStartIndex = 16;
		anchor.textEndIndex = 16;

		const image = new FormattingElement( "img", { src: "/image.png", alt: "image" } );
		image.sourceStartIndex = 44;
		image.sourceEndIndex = 79;
		image.textStartIndex = 16;
		image.textEndIndex = 16;

		const textContainer = new TextContainer();
		textContainer.text = "Let there be an ";
		textContainer.formatting = [ br, anchor, image ];

		const paragraph = new Paragraph( "p" );
		paragraph.sourceStartIndex = 0;
		paragraph.sourceEndIndex = 87;
		paragraph.textContainer = textContainer;

		const expected = new StructuredNode( "root" );
		expected.sourceStartIndex = 0;
		expected.sourceEndIndex = 87;
		expected.children = [ paragraph ];

		const tree = buildTree( input );
		expect( tree.toString() ).toEqual( expected.toString() );
	} );

	it( "makes an implicit paragraph within a structured element and can add formatting elements to it", () => {
		const input = "<div>This is a <strong>sentence</strong></div>";

		const strong = new FormattingElement( "strong" );
		strong.sourceStartIndex = 15;
		strong.sourceEndIndex = 40;
		strong.textStartIndex = 10;
		strong.textEndIndex = 18;

		const paragraph = new Paragraph();
		paragraph.sourceStartIndex = 5;
		paragraph.sourceEndIndex = 15;
		paragraph.text = "This is a sentence";
		paragraph.textContainer.formatting = [ strong ];

		const div = new StructuredNode( "div" );
		div.sourceStartIndex = 0;
		div.sourceEndIndex = 46;
		div.children = [ paragraph ];

		const expected = new StructuredNode( "root" );
		expected.sourceStartIndex = 0;
		expected.sourceEndIndex = 46;
		expected.children = [ div ];

		const tree = buildTree( input );

		expect( tree.toString() ).toEqual( expected.toString() );
	} );

	it( "parses a paragraph within a heading", () => {
		const input = "<h2>This is a <p>paragraph within a</p> heading.</h2>";

		const paragraph = new Paragraph( "p" );
		paragraph.sourceStartIndex = 14;
		paragraph.sourceEndIndex = 39;
		paragraph.textStartIndex = 10;
		paragraph.textEndIndex = 28;

		const heading = new Heading( 2 );
		heading.sourceStartIndex = 0;
		heading.sourceEndIndex = 53;
		heading.text = "This is a paragraph within a heading.";
		heading.textContainer.formatting = [ paragraph ];

		const expected = new StructuredNode( "root" );
		expected.sourceStartIndex = 0;
		expected.sourceEndIndex = 53;
		expected.children = [ heading ];

		const tree = buildTree( input );
		expect( tree.toString() ).toEqual( expected.toString() );
	} );

	it( "can parse a big HTML text", () => {
		buildTree( htmlFile );
	} );

	it( "can parse another big HTML text", () => {
		buildTree( htmlFile2 );
	} );

	it( "can parse big HTML texts", () => {
		fullTexts.forEach( text => {
			buildTree( text.paper.getText() );
		} );
	} );
} );
