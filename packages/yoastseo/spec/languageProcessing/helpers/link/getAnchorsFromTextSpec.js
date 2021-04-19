import linkMatches from "../../../../src/languageProcessing/helpers/link/getAnchorsFromText.js";

describe( "matches links in URL", function() {
	it( "returns array with matches", function() {
		expect( linkMatches( "a text without links" ) ).toEqual( [] );
		expect( linkMatches( "a <a href='test.com'>text</a> with a link" )[ 0 ] ).toBe( "<a href='test.com'>text</a>" );
	} );

	it( "does not match an anchor tag without attributes", () => {
		expect( linkMatches( "an <a>anchor without a link</a> is ignored" ) ).toEqual( [] );
		expect( linkMatches( "an <a >anchor without a link</a> is ignored" ) ).toEqual( [] );
	} );

	it( "can handle whitespace and HTML inside the anchor tag", () => {
		expect( linkMatches(
			"a <a href='test.com'>text\n" +
			"with <strong>HTML</strong>, whitespace\n" +
			"and</a> with a link" )[ 0 ]
		).toBe(
			"<a href='test.com'>text\n" +
			"with <strong>HTML</strong>, whitespace\n" +
			"and</a>"
		);
	} );
} );
