import LinkStatistics from "../../../../src/parsedPaper/research/researches/LinkStatistics";
import buildTreeFromYaml from "../../../specHelpers/buildTreeFromYaml";


describe( "LinkStatistics research", () => {
	let paragraph;
	let metadata;

	beforeEach( () => {
		const paragraphYaml = `
Paragraph:
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
        attributes:
          href: "https://yoast.com/how-to-yoast-your-post"
        sourceCodeLocation:
          startTag:
          endTag:
        textStartIndex: 33
        textEndIndex: 44
		`;
		paragraph = buildTreeFromYaml( paragraphYaml );

		const metadataYaml = `
Structured:
  children:
    - Structured:
        tag: permalink
        children:
          - Paragraph:
              text: "https://yoast.com/how-to-write-an-awesome-metadescription"
              isImplicit: true
		`;

		metadata = buildTreeFromYaml( metadataYaml );
	} );

	it( "can identify whether a link is `follow` or `nofollow`.", done => {
		const linkStatistics = new LinkStatistics();

		linkStatistics.calculateFor( paragraph, metadata ).then(
			result => {
				const noFollowLinks = result.filter( link => link.noFollow );
				expect( noFollowLinks ).toHaveLength( 1 );
				done();
			}
		);
	} );
} );
