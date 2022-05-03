import Headings from "../../../../src/parsedPaper/research/researches/Headings";
import TreeResearcher from "../../../../src/parsedPaper/research/TreeResearcher";
import Heading from "../../../../src/parsedPaper/structure/tree/nodes/Heading";
import buildTreeFromYaml from "../../../specHelpers/buildTreeFromYaml";

describe( "Headings", () => {
	let tree;
	beforeEach( () => {
		tree = buildTreeFromYaml`
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
            startOffset: 30
            endOffset: 34
          startOffset: 0
          endOffset: 34
        text: This is a heading level 1.
    - Paragraph:
        tag: p
        sourceCodeLocation:
          startTag:
            startOffset: 34
            endOffset: 37
          endTag:
            startOffset: 57
            endOffset: 60
          startOffset: 34
          endOffset: 57
        text: This is a paragraph.
    - Structured:
        tag: section
        sourceCodeLocation:
          startTag:
            startOffset: 57
            endOffset: 64
          endTag:
            startOffset: 30
            endOffset: 34
          startOffset: 0
          endOffset: 34
        children:
          - Heading:
              level: 2
              sourceCodeLocation:
                startTag:
                  startOffset: 64
                  endOffset: 68
                endTag:
                  startOffset: 95
                  endOffset: 99
                startOffset: 64
                endOffset: 99
              text: This is a heading level 2.
          - Paragraph:
              tag: p
              sourceCodeLocation:
                startTag:
                  startOffset: 99
                  endOffset: 102
                endTag:
                  startOffset: 128
                  endOffset: 131
                startOffset: 99
                endOffset: 131
              text: This is another paragraph.
`;
	} );

	it( "gives back a list of headings when applying the research to a text with the researcher.", done => {
		const researcher = new TreeResearcher();
		const headings = new Headings();

		const sourceCodeLocationHeading1 = {
			startTag: { startOffset: 0, endOffset: 4 },
			endTag: { startOffset: 30, endOffset: 34 },
			startOffset: 0,
			endOffset: 34,
		};

		const heading1 = new Heading( 1, sourceCodeLocationHeading1 );
		heading1.text = "This is a heading level 1.";
		heading1.setResearchResult( "headings", [ heading1 ] );

		const sourceCodeLocationHeading2 = {
			startTag: { startOffset: 64, endOffset: 68 },
			endTag: { startOffset: 95, endOffset: 99 },
			startOffset: 64,
			endOffset: 99,
		};

		const heading2 = new Heading( 2, sourceCodeLocationHeading2 );
		heading2.text = "This is a heading level 2.";
		heading2.setResearchResult( "headings", [ heading2 ] );

		const expected = [ heading1, heading2 ];

		researcher.addResearch( "headings", headings );
		researcher.doResearch( "headings", tree ).then(
			results => {
				expect( results ).toEqual( expected );
				done();
			}
		);
	} );

	it( "gives back an empty list of when applying the research to a text with no headings.", done => {
		const researcher = new TreeResearcher();
		const headings = new Headings();

		const treeNoHeadings = buildTreeFromYaml`
Structured:
  tag: root
  sourceStartIndex: 23
  sourceEndIndex: 50
  children:
    - Paragraph:
        tag: p
        sourceStartIndex: 23
        sourceEndIndex: 50
        text: This is a paragraph.
    - Structured:
        tag: section
        sourceStartIndex: 23
        sourceEndIndex: 50
        children:
          - Paragraph:
              tag: p
              sourceStartIndex: 23
              sourceEndIndex: 50
              text: This is another paragraph.
`;

		const expected = [];

		researcher.addResearch( "headings", headings );
		researcher.doResearch( "headings", treeNoHeadings ).then(
			results => {
				expect( results ).toEqual( expected );
				done();
			}
		);
	} );
} );
