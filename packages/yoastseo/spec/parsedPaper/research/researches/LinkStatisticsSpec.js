import { TreeResearcher } from "../../../../src/parsedPaper/research";
import LinkStatistics from "../../../../src/parsedPaper/research/researches/LinkStatistics";
import buildTreeFromYaml from "../../../specHelpers/buildTreeFromYaml";


describe( "LinkStatistics research", () => {
	let tree;

	beforeEach( () => {
		const yaml = `
Structured:
  tag: root
  children:
    - Heading:
        text: This is a heading with level 1.
    - Structured:
        tag: section
        children:
          - Paragraph:
              text: This is a text with a link.
              formatting:
                - a:
                    attributes:
                      href: "https://yoast.com/a-link"
                    sourceCodeLocation:
                      startTag:
                      endTag:
                    textStartIndex: 20
                    textEndIndex: 26
          - Paragraph:
              text: This is a text with one link and another one.
              formatting:
                - a:
                    attributes:
                      rel: "noopener nofollow"
                    sourceCodeLocation:
                      startTag:
                      endTag:
                    textStartIndex: 20
                    textEndIndex: 28
                - a:
                    sourceCodeLocation:
                      startTag:
                      endTag:
                    textStartIndex: 33
                    textEndIndex: 44
		`;
		tree = buildTreeFromYaml( yaml );
	} );

	it( "can identify whether a link is `follow` or `nofollow`.", done => {
		const researcher = new TreeResearcher();
		const linkStatistics = new LinkStatistics();

		researcher.addResearch( "linkStatistics", linkStatistics );
		researcher.doResearch( "linkStatistics", tree ).then(
			results => {
				const noFollowResults = results.filter( result => result.noFollow === true );
				expect( noFollowResults ).toHaveLength( 1 );
				done();
			}
		);
	} );
} );
