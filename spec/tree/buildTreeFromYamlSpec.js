import buildTreeFromYaml from "../specHelpers/buildTreeFromYaml";

const treeString = `
root:
  sourceStartIndex: 0
  sourceEndIndex: 20
  children:
    - Paragraph:
        text: This sentence needs to be read to have value as a sentence.
        formatting:
          - strong:
              id: some-id
              textStartIndex: 8
              textEndIndex: 46
          - em:
              textStartIndex: 49
              textEndIndex: 102
          - strong:
              class: weak
              textStartIndex: 63
              textEndIndex: 97
    - Heading:
        level: 2
        text: This is a header.
`;

describe( "buildTreeFromYaml", () => {
	it( "can build a tree from a YAML string", () => {
		buildTreeFromYaml( treeString );
	} );
} );
