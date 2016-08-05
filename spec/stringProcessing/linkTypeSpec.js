var linkTypeFunction = require( "../../js/stringProcessing/getLinkType.js" );

describe( "checks type of link", function(){
	it( "should classify relative links as internal", function() {
		expect( linkTypeFunction( "<a href='http://example.org/'>Internal</a>", "http://example.org" ) ).toBe( "internal" );
		expect( linkTypeFunction( "<a href='http://example.org/some-path?query_args#hash'>Internal</a>", "http://example.org" ) ).toBe( "internal" );
	});

	it( "returns linktype", function(){
		expect( linkTypeFunction( "<a href='http://yoast.com'>A link</a>", "http://yoast.com" ) ).toBe( "internal" );
		expect( linkTypeFunction( "<a href='http://yoast.com'>A link</a>", "http://example.com" ) ).toBe( "external" );
		expect( linkTypeFunction( "<a href='ftp://yoast.com'>A link</a>", "http://yoast.com" ) ).toBe( "other" );
	});
});
