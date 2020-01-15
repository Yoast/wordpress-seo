import LinkStatistics from "../../../../src/parsedPaper/research/researches/LinkStatistics";
import buildTreeFromYaml from "../../../specHelpers/buildTreeFromYaml";


describe( "LinkStatistics research", () => {
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

	const metadata = buildTreeFromYaml( metadataYaml );

	const linkStatistics = new LinkStatistics();

	describe( "follow vs nofollow", () => {
		it( "identifies links that have no 'rel' attribute as being allowed to follow.", done => {
			const yaml = `
Paragraph:
  formatting:
    - a:
        attributes:
          href: ""
        sourceCodeLocation:
          startTag:
          endTag:
        textStartIndex: 20
        textEndIndex: 28
		`;

			linkStatistics.calculateFor( buildTreeFromYaml( yaml ), metadata ).then(
				result => {
					expect( result[ 0 ].noFollow ).toEqual( false );
					done();
				}
			);
		} );

		it( "can identify whether a link is `follow` or `nofollow`.", done => {
			const yaml = `
Paragraph:
  formatting:
    - a:
        attributes:
          href: "ftp://yoast.com/some-ftp-endpoint"
          rel: "noopener nofollow"
        sourceCodeLocation:
          startTag:
          endTag:
        textStartIndex: 20
        textEndIndex: 28
		`;

			linkStatistics.calculateFor( buildTreeFromYaml( yaml ), metadata ).then(
				result => {
					expect( result[ 0 ].noFollow ).toEqual( true );
					done();
				}
			);
		} );
	} );

	describe( "internal vs external vs other", () => {
		it( "correctly identifies whether links are internal.", done => {
			const yaml = `
Paragraph:
  formatting:
    - a:
        attributes:
          href: "https://yoast.com/how-to-write-an-awesome-title"
          rel: "noopener nofollow"
        sourceCodeLocation:
          startTag:
          endTag:
        textStartIndex: 20
        textEndIndex: 28
		`;

			linkStatistics.calculateFor( buildTreeFromYaml( yaml ), metadata ).then(
				result => {
					expect( result[ 0 ].target ).toEqual( "internal" );
					done();
				}
			);
		} );

		it( "correctly identifies whether links are external.", done => {
			const yaml = `
Paragraph:
  formatting:
    - a:
        attributes:
          href: "https://example.org/some-post-on-another-website"
          rel: "noopener nofollow"
        sourceCodeLocation:
          startTag:
          endTag:
        textStartIndex: 20
        textEndIndex: 28
		`;

			linkStatistics.calculateFor( buildTreeFromYaml( yaml ), metadata ).then(
				result => {
					expect( result[ 0 ].target ).toEqual( "external" );
					done();
				}
			);
		} );

		it( "correctly identifies links using the ftp protocol as being of target 'other'.", done => {
			const yaml = `
Paragraph:
  formatting:
    - a:
        attributes:
          href: "ftp://yoast.com/some-ftp-endpoint"
          rel: "noopener nofollow"
        sourceCodeLocation:
          startTag:
          endTag:
        textStartIndex: 20
        textEndIndex: 28
		`;

			linkStatistics.calculateFor( buildTreeFromYaml( yaml ), metadata ).then(
				result => {
					expect( result[ 0 ].target ).toEqual( "other" );
					done();
				}
			);
		} );

		it( "correctly identifies empty links as being of target 'other'.", done => {
			const yaml = `
Paragraph:
  formatting:
    - a:
        attributes:
          href: ""
          rel: "noopener nofollow"
        sourceCodeLocation:
          startTag:
          endTag:
        textStartIndex: 20
        textEndIndex: 28
		`;

			linkStatistics.calculateFor( buildTreeFromYaml( yaml ), metadata ).then(
				result => {
					expect( result[ 0 ].target ).toEqual( "other" );
					done();
				}
			);
		} );

		it( "correctly identifies invalid links as being of target 'other'.", done => {
			const yaml = `
Paragraph:
  formatting:
    - a:
        attributes:
          href: "an invalid link"
          rel: "noopener nofollow"
        sourceCodeLocation:
          startTag:
          endTag:
        textStartIndex: 20
        textEndIndex: 28
		`;

			linkStatistics.calculateFor( buildTreeFromYaml( yaml ), metadata ).then(
				result => {
					expect( result[ 0 ].target ).toEqual( "other" );
					done();
				}
			);
		} );

		it( "identifies links that have no 'href' attribute as being of target 'other'.", done => {
			const yaml = `
Paragraph:
  formatting:
    - a:
        attributes:
        sourceCodeLocation:
          startTag:
          endTag:
        textStartIndex: 20
        textEndIndex: 28
		`;

			linkStatistics.calculateFor( buildTreeFromYaml( yaml ), metadata ).then(
				result => {
					expect( result[ 0 ].target ).toEqual( "other" );
					done();
				}
			);
		} );
	} );
} );
