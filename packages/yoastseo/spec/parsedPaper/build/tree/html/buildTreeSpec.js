import buildTree from "../../../../../src/parsedPaper/build/tree/html/buildTree";
import { Paragraph, StructuredNode, List, ListItem } from "../../../../../src/parsedPaper/structure/tree";

import htmlFile from "../../../../fullTextTests/testTexts/en/englishPaper.html";
import htmlFile2 from "../../../../fullTextTests/testTexts/de/germanPaper.html";

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
              textStartIndex: 51
              textEndIndex: 51
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

	it.skip( "can parse HTML into a List with ListItems, which are simple paragraphs or structured nodes", () => {
		// List items may contain any sort of content, like `div`s. We need to decide whether we want to support this for the analysis.
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
            startOffset: 52
            endOffset: 62
          startOffset: 0
          endOffset: 62
        children:
          - Structured:
             tag: div
             sourceCodeLocation:
               startTag:
                 startOffset: 9
                 endOffset: 14
               endTag:
                 startOffset: 46
                 endOffset: 52
               startOffset: 9
               endOffset: 52
             children:
               - Paragraph:
                   sourceCodeLocation:
                     startOffset: 14
                     endOffset: 46
                   text: This sentence. Another sentence.
                   isImplicit: true
		`;

		const expected = buildTreeFromYaml( expectedYaml );
		const tree = buildTree( input );

		expect( tree.toString() ).toEqual( expected.toString() );
	} );

	it( "can parse an HTML text into a StructuredNode with a few siblings", () => {
		const input = "<section><h1>First heading</h1><p>This sentence. Another sentence.</p></section>";

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
            startOffset: 70
            endOffset: 80
          startOffset: 0
          endOffset: 80
        children:
          - Heading:
              level: 1
              sourceCodeLocation:
                startTag:
                  startOffset: 9
                  endOffset: 13
                endTag:
                  startOffset: 26
                  endOffset: 31
                startOffset: 9
                endOffset: 31
              text: First heading
          - Paragraph:
              sourceCodeLocation:
                startTag:
                  startOffset: 31
                  endOffset: 34
                endTag:
                  startOffset: 66
                  endOffset: 70
                startOffset: 31
                endOffset: 70
              text: This sentence. Another sentence.
		`;

		const expected = buildTreeFromYaml( expectedYaml );
		const tree = buildTree( input );

		expect( tree.toString() ).toEqual( expected.toString() );
	} );

	it( "discards irrelevant HTML element and its contents from the tree", () => {
		const input = "<section>" +
			"<h1>First heading</h1>" +
			// Pre elements and contents should not be parsed.
			"<pre>This sentence. <div><p>Another <strong>sentence</strong>.</p></div></pre>" +
			"</section>";

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
            startOffset: 109
            endOffset: 119
          startOffset: 0
          endOffset: 119
        children:
          - Heading:
              level: 1
              sourceCodeLocation:
                startTag:
                  startOffset: 9
                  endOffset: 13
                endTag:
                  startOffset: 26
                  endOffset: 31
                startOffset: 9
                endOffset: 31
              text: First heading
		`;

		const expected = buildTreeFromYaml( expectedYaml );
		const tree = buildTree( input );

		expect( tree.toString() ).toEqual( expected.toString() );
	} );

	it( "can parse an HTML text with text in front", () => {
		const input = "This is some text.<p>This is a paragraph.</p>";

		const expectedYaml = `
Structured:
  tag: root
  children:
    - Paragraph:
        sourceCodeLocation:
          startOffset: 0
          endOffset: 18
        text: This is some text.
        isImplicit: true
    - Paragraph:
        sourceCodeLocation:
          startTag:
            startOffset: 18
            endOffset: 21
          endTag:
            startOffset: 41
            endOffset: 45
          startOffset: 18
          endOffset: 45
        text: This is a paragraph.
        isImplicit: false
		`;

		const expected = buildTreeFromYaml( expectedYaml );
		const tree = buildTree( input );
		expect( tree.toString() ).toEqual( expected.toString() );
	} );

	it( "adds a new paragraph to the tree when the new paragraph is implicit, and the one before is explicit.", () => {
		const input = "<p>This is a paragraph.</p>This is another paragraph.";

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
            startOffset: 23
            endOffset: 27
          startOffset: 0
          endOffset: 27
        text: This is a paragraph.
        isImplicit: false
    - Paragraph:
        sourceCodeLocation:
          startOffset: 27
          endOffset: 53
        text: This is another paragraph.
        isImplicit: true
		`;

		const expected = buildTreeFromYaml( expectedYaml );
		const tree = buildTree( input );

		expect( tree.toString() ).toEqual( expected.toString() );
	} );

	it( "discards irrelevant node's contents within paragraphs and headings, but adds them as formatting", () => {
		const input = "<pre>Some text.</pre>" +
			"<p>This is <em>some<script>console.log('script');</script></em> that should <strong>not</strong> be parsed.</p>";

		const expectedYaml = `
Structured:
  tag: root
  children:
    - Paragraph:
        sourceCodeLocation:
          startTag:
            startOffset: 21
            endOffset: 24
          endTag:
            startOffset: 128
            endOffset: 132
          startOffset: 21
          endOffset: 132
        text: This is some that should not be parsed.
        formatting:
          - em:
              sourceCodeLocation:
                startTag:
                  startOffset: 32
                  endOffset: 36
                endTag:
                  startOffset: 79
                  endOffset: 84
                startOffset: 32
                endOffset: 84
              textStartIndex: 8
              textEndIndex: 12
          - script:
              sourceCodeLocation:
                startTag:
                  startOffset: 40
                  endOffset: 48
                endTag:
                  startOffset: 70
                  endOffset: 79
                startOffset: 40
                endOffset: 79
              textStartIndex: 12
              textEndIndex: 12
          - strong:
              sourceCodeLocation:
                startTag:
                  startOffset: 97
                  endOffset: 105
                endTag:
                  startOffset: 108
                  endOffset: 117
                startOffset: 97
                endOffset: 117
              textStartIndex: 25
              textEndIndex: 28
		`;

		const expected = buildTreeFromYaml( expectedYaml );
		const tree = buildTree( input );
		expect( tree.toString() ).toEqual( expected.toString() );
	} );

	it( "parses formatting with the same content correctly", () => {
		const input = "<p><strong>hello world! <em>hello world!</em></strong> <a href='nope'>hello world!</a></p>";

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
            startOffset: 86
            endOffset: 90
          startOffset: 0
          endOffset: 90
        text: hello world! hello world! hello world!
        formatting:
          - strong:
              sourceCodeLocation:
                startTag:
                  startOffset: 3
                  endOffset: 11
                endTag:
                  startOffset: 45
                  endOffset: 54
                startOffset: 3
                endOffset: 54
              textStartIndex: 0
              textEndIndex: 25
          - em:
              sourceCodeLocation:
                startTag:
                  startOffset: 24
                  endOffset: 28
                endTag:
                  startOffset: 40
                  endOffset: 45
                startOffset: 24
                endOffset: 45
              textStartIndex: 13
              textEndIndex: 25
          - a:
              attributes:
                href: nope
              sourceCodeLocation:
                startTag:
                  startOffset: 55
                  endOffset: 70
                endTag:
                  startOffset: 82
                  endOffset: 86
                startOffset: 55
                endOffset: 86
              textStartIndex: 26
              textEndIndex: 38
		`;

		const expected = buildTreeFromYaml( expectedYaml );
		const tree = buildTree( input );
		expect( tree.toString() ).toEqual( expected.toString() );
	} );

	it( "parses HTML with self-closing elements correctly", () => {
		const input = "<p>Let there<br> be an <a href='/image.png'><img src='/image.png' alt='image'/></a></p>";

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
            startOffset: 83
            endOffset: 87
          startOffset: 0
          endOffset: 87
        text: "Let there be an "
        formatting:
          - br:
              sourceCodeLocation:
                startTag:
                  startOffset: 12
                  endOffset: 16
                startOffset: 12
                endOffset: 16
              textStartIndex: 9
              textEndIndex: 9
          - a:
              attributes:
                href: "/image.png"
              sourceCodeLocation:
                startTag:
                  startOffset: 23
                  endOffset: 44
                endTag:
                  startOffset: 79
                  endOffset: 83
                startOffset: 23
                endOffset: 83
              textStartIndex: 16
              textEndIndex: 16
          - img:
              attributes:
                src: "/image.png"
                alt: image
              sourceCodeLocation:
                startTag:
                  startOffset: 44
                  endOffset: 79
                startOffset: 44
                endOffset: 79
              textStartIndex: 16
              textEndIndex: 16
		`;

		const expected = buildTreeFromYaml( expectedYaml );
		const tree = buildTree( input );
		expect( tree.toString() ).toEqual( expected.toString() );
	} );

	it( "makes an implicit paragraph within a structured element and can add formatting elements to it", () => {
		const input = "<div>This is a <strong>sentence</strong></div>";

		const expectedYaml = `
Structured:
  tag: root
  children:
    - Structured:
        tag: div
        sourceCodeLocation:
          startTag:
            startOffset: 0
            endOffset: 5
          endTag:
            startOffset: 40
            endOffset: 46
          startOffset: 0
          endOffset: 46
        children:
          - Paragraph:
              sourceCodeLocation:
                startOffset: 5
                endOffset: 15
              isImplicit: true
              text: This is a sentence
              formatting:
                - strong:
                    sourceCodeLocation:
                      startTag:
                        startOffset: 15
                        endOffset: 23
                      endTag:
                        startOffset: 31
                        endOffset: 40
                      startOffset: 15
                      endOffset: 40
                    textStartIndex: 10
                    textEndIndex: 18
		`;

		const expected = buildTreeFromYaml( expectedYaml );
		const tree = buildTree( input );

		expect( tree.toString() ).toEqual( expected.toString() );
	} );

	it( "ignores any whitespace instead of creating an implicit paragraph", () => {
		const input = "<article><!-- There is actually a \\n here. -->\n" +
			"<h1>The Stranger in the Night</h1><!-- There is actually a \\n here. -->\n" +
			"</article>";

		const expectedYaml = `
Structured:
  tag: root
  children:
    - Structured:
        tag: article
        sourceCodeLocation:
          startTag:
            startOffset: 0
            endOffset: 9
          endTag:
            startOffset: 119
            endOffset: 129
          startOffset: 0
          endOffset: 129
        children:
          - Heading:
              level: 1
              sourceCodeLocation:
                startTag:
                  startOffset: 47
                  endOffset: 51
                endTag:
                  startOffset: 76
                  endOffset: 81
                startOffset: 47
                endOffset: 81
              text: The Stranger in the Night
		`;

		const expected = buildTreeFromYaml( expectedYaml );
		const tree = buildTree( input );

		expect( tree.toString() ).toEqual( expected.toString() );
	} );

	it( "ignores any br tags instead of creating an implicit paragraph", () => {
		const input = "<article><br><h1>The Stranger in the Night</h1></article>";

		const expectedYaml = `
Structured:
  tag: root
  children:
    - Structured:
        tag: article
        sourceCodeLocation:
          startTag:
            startOffset: 0
            endOffset: 9
          endTag:
            startOffset: 47
            endOffset: 57
          startOffset: 0
          endOffset: 57
        children:
          - Heading:
              level: 1
              sourceCodeLocation:
                startTag:
                  startOffset: 13
                  endOffset: 17
                endTag:
                  startOffset: 42
                  endOffset: 47
                startOffset: 13
                endOffset: 47
              text: The Stranger in the Night
		`;

		const expected = buildTreeFromYaml( expectedYaml );
		const tree = buildTree( input );

		expect( tree.toString() ).toEqual( expected.toString() );
	} );

	it.skip( "parses a paragraph within a heading", () => {
		// We need to decide whether we want to support invalid HTML or let it crash and burn.
		const input = "<h2>This is a <p>paragraph within a</p> heading.</h2>";

		const expectedYaml = `

		`;

		const expected = buildTreeFromYaml( expectedYaml );
		const tree = buildTree( input );
		expect( tree.toString() ).toEqual( expected.toString() );
	} );

	it( "can parse a big HTML text", () => {
		buildTree( htmlFile );
	} );

	it( "can parse another big HTML text", () => {
		buildTree( htmlFile2 );
	} );

	it.skip( "can parse big HTML texts", () => {
		fullTexts.forEach( text => {
			buildTree( text.paper.getText() );
		} );
	} );
} );
