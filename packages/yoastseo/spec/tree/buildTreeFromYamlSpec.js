import {
	Ignored,
	List,
	Paragraph,
	Heading,
	StructuredNode,
	ListItem,
	FormattingElement,
} from "../../src/parsedPaper/structure/tree";
import buildTreeFromYaml from "../specHelpers/buildTreeFromYaml";

const treeString1 = `
Structured:
  sourceStartIndex: 0
  sourceEndIndex: 20
  tag: root
  children:
    - Heading:
        sourceStartIndex: 23
        sourceEndIndex: 50
        level: 2
        text: This is a header.
    - List:
        sourceStartIndex: 23
        sourceEndIndex: 50
        ordered: true
        children:
          - ListItem:
              sourceStartIndex: 23
              sourceEndIndex: 50
              children:
                - Paragraph:
                    sourceStartIndex: 23
                    sourceEndIndex: 50
                    text: Hello World!
    - Ignored:
        sourceStartIndex: 23
        sourceEndIndex: 50
        content: console.log("This should be ignored.");
        tag: script
`;

const treeString2 = `
Structured:
  sourceStartIndex: 0
  sourceEndIndex: 20
  tag: root
  children:
    - Paragraph:
        sourceStartIndex: 23
        sourceEndIndex: 50
        tag: p
        text: This sentence needs to be read to have value as a sentence.
        formatting:
          - strong:              
              textStartIndex: 8
              textEndIndex: 46
              sourceStartIndex: 23
              sourceEndIndex: 50
              attributes:
                id: some-id
          - em:
              textStartIndex: 49
              textEndIndex: 102
              sourceStartIndex: 23
              sourceEndIndex: 50
          - strong:
              class: weak
              textStartIndex: 63
              textEndIndex: 97
              sourceStartIndex: 23
              sourceEndIndex: 50
`;

describe( "buildTreeFromYaml", () => {
	it( "can build a tree from a YAML string", () => {
		const tree = buildTreeFromYaml( treeString1 );

		const ignored = new Ignored( "script" );
		ignored.sourceStartIndex = 23;
		ignored.sourceEndIndex = 50;
		ignored.tag = "script";
		ignored.content = "console.log(\"This should be ignored.\");";

		const helloWorld = new Paragraph();
		helloWorld.sourceStartIndex = 23;
		helloWorld.sourceEndIndex = 50;
		helloWorld.text = "Hello World!";

		const listItem = new ListItem();
		listItem.sourceStartIndex = 23;
		listItem.sourceEndIndex = 50;
		listItem.children = [ helloWorld ];

		const list = new List( true );
		list.sourceStartIndex = 23;
		list.sourceEndIndex = 50;
		list.children = [ listItem ];

		const heading = new Heading( 2 );
		heading.sourceStartIndex = 23;
		heading.sourceEndIndex = 50;
		heading.text = "This is a header.";

		const expected = new StructuredNode( "root" );
		expected.sourceStartIndex = 0;
		expected.sourceEndIndex = 20;
		expected.children = [ heading, list, ignored ];

		expect( tree.toString() ).toEqual( expected.toString() );
	} );

	it( "builds a tree with a paragraph with formatting", () => {
		const tree = buildTreeFromYaml( treeString2 );

		const strong1 = new FormattingElement( "strong", { id: "some-id" } );
		strong1.textStartIndex = 8;
		strong1.textEndIndex = 46;
		strong1.sourceStartIndex = 23;
		strong1.sourceEndIndex = 50;

		const em = new FormattingElement( "em" );
		em.textStartIndex = 49;
		em.textEndIndex = 102;
		em.sourceEndIndex = 50;
		em.sourceStartIndex = 23;

		const strong2 = new FormattingElement( "strong" );
		strong2.textStartIndex = 63;
		strong2.textEndIndex = 97;
		strong2.sourceStartIndex = 23;
		strong2.sourceEndIndex = 50;

		const paragraph = new Paragraph( "p" );
		paragraph.sourceStartIndex = 23;
		paragraph.sourceEndIndex = 50;
		paragraph.text = "This sentence needs to be read to have value as a sentence.";
		paragraph.textContainer.formatting = [ strong1, em, strong2 ];

		const expected = new StructuredNode( "root" );
		expected.sourceStartIndex = 0;
		expected.sourceEndIndex = 20;
		expected.children = [ paragraph ];

		expect( tree.toString() ).toEqual( expected.toString() );
	} );
} );
