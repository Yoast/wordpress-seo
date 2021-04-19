import {
	List,
	Paragraph,
	Heading,
	StructuredNode,
	ListItem,
	FormattingElement,
} from "../../../../src/parsedPaper/structure/tree/index";
import buildTreeFromYaml from "../../../specHelpers/buildTreeFromYaml";

const treeString1 = `
Structured:
  tag: root
  children:
    - Heading:
        sourceCodeLocation:
          startTag:
            startOffset: 0
            endOffset: 4
          endTag:
            startOffset: 21
            endOffset: 25
          startOffset: 0
          endOffset: 25
        level: 2
        text: This is a header.
    - List:
        sourceCodeLocation:
          startTag:
            startOffset: 25
            endOffset: 29
          endTag:
            startOffset: 57
            endOffset: 61
          startOffset: 25
          endOffset: 61
        ordered: true
        children:
          - ListItem:
              sourceCodeLocation:
                startTag:
                  startOffset: 29
                  endOffset: 33
                endTag:
                  startOffset: 53
                  endOffset: 57
                startOffset: 29
                endOffset: 57
              text: This is a list item.
`;

const treeString2 = `
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

describe( "buildTreeFromYaml", () => {
	it( "can build a tree from a YAML string", () => {
		const tree = buildTreeFromYaml( treeString1 );

		const listItemLocation = {
			startTag: { startOffset: 29, endOffset: 33 },
			endTag: { startOffset: 53, endOffset: 57 },
			startOffset: 29,
			endOffset: 57,
		};
		const listItem = new ListItem( listItemLocation );
		listItem.appendText( "This is a list item." );

		const listLocation = {
			startTag: { startOffset: 25, endOffset: 29 },
			endTag: { startOffset: 57, endOffset: 61 },
			startOffset: 25,
			endOffset: 61,
		};
		const list = new List( true, listLocation );
		list.children = [ listItem ];

		const headingLocation = {
			startTag: { startOffset: 0, endOffset: 4 },
			endTag: { startOffset: 21, endOffset: 25 },
			startOffset: 0,
			endOffset: 25,
		};
		const heading = new Heading( 2, headingLocation );
		heading.text = "This is a header.";

		const expected = new StructuredNode( "root", null );
		expected.children = [ heading, list ];

		expect( tree.toString() ).toEqual( expected.toString() );
	} );

	it( "builds a tree with a paragraph with formatting", () => {
		const tree = buildTreeFromYaml( treeString2 );

		const strong1Location = {
			startTag: { startOffset: 8, endOffset: 29 },
			endTag: { startOffset: 37, endOffset: 46 },
			startOffset: 8,
			endOffset: 46,
		};
		const strong1 = new FormattingElement( "strong", strong1Location, { id: "some-id" } );
		strong1.textStartIndex = 5;
		strong1.textEndIndex = 13;

		const emLocation = {
			startTag: { startOffset: 59, endOffset: 63 },
			endTag: { startOffset: 97, endOffset: 102 },
			startOffset: 59,
			endOffset: 102,
		};
		const em = new FormattingElement( "em", emLocation );
		em.textStartIndex = 26;
		em.textEndIndex = 30;

		const strong2Location = {
			startTag: { startOffset: 63, endOffset: 84 },
			endTag: { startOffset: 88, endOffset: 97 },
			startOffset: 63,
			endOffset: 97,
		};
		const strong2 = new FormattingElement( "strong", strong2Location, { "class": "weak" } );
		strong2.textStartIndex = 26;
		strong2.textEndIndex = 30;

		const parLocation = {
			startTag: { startOffset: 0, endOffset: 3 },
			endTag: { startOffset: 131, endOffset: 135 },
			startOffset: 0,
			endOffset: 135,
		};
		const paragraph = new Paragraph( parLocation );
		paragraph.text = "This sentence needs to be read to have value as a sentence.";
		paragraph.textContainer.formatting = [ strong1, em, strong2 ];

		const expected = new StructuredNode( "root", null );
		expected.children = [ paragraph ];

		expect( tree.toString() ).toEqual( expected.toString() );
	} );
} );
