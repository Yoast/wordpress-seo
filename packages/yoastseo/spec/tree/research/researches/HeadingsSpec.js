import Headings from "../../../../src/tree/research/researches/Headings";
import TreeResearcher from "../../../../src/tree/research/TreeResearcher";
import buildTreeFromYaml from "../../../specHelpers/buildTreeFromYaml";

describe( "Headings", () => {
	let tree;
	beforeEach( () => {
		tree = buildTreeFromYaml`
Structured:
  tag: root
  sourceStartIndex: 23
  sourceEndIndex: 50
  children:
    - Heading:
        level: 1
        sourceStartIndex: 25
        sourceEndIndex: 30
        text: This is a header level 1.
    - Paragraph:
        tag: p
        sourceStartIndex: 23
        sourceEndIndex: 50
        text: This is a paragraph.
`;
	} );

	it( "gives back a list of headings when applying the research to a text with the researcher.", done => {
		const researcher = new TreeResearcher();
		const headings = new Headings();
		researcher.addResearch( "headings", headings );
		researcher.doResearch( "headings", tree ).then(
			result => {
				console.log( result );
				done();
			}
		);
	} );
} );
