import buildTreeFromYaml from "../specHelpers/buildTreeFromYaml";

const treeString = `
- Paragraph:
    text: This sentence needs to be read to have value as a sentence.
    formatting:
      - strong:
          id: some-id
          start: 8
          end: 46
      - em:
          start: 49
          end: 102
      - strong:
          class: weak
          start: 63
          end: 97
- Header:
    text: This is a header.
`;

describe( "buildTreeFromYaml", () => {
	it( "can build a tree from a YAML string", () => {
		const tree = buildTreeFromYaml( treeString );
		console.log( tree );
	} );
} );
