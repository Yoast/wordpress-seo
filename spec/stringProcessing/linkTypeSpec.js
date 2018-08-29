var linkTypeFunction = require( "../../src/stringProcessing/getLinkType.js" );

describe( "getLinkType", function() {
	it( "should classify relative links as internal", function() {
		expect( linkTypeFunction( "<a href='another-path'>Internal</a>", "http://example.org" ) ).toBe( "internal" );
	} );

	it( "should classify relative links with double-dot notation as internal", function() {
		expect( linkTypeFunction( "<a href='../another-path'>Internal</a>", "http://example.org" ) ).toBe( "internal" );
	} );

	it( "should classify relative links with single-dot notation as internal", function() {
		expect( linkTypeFunction( "<a href='./another-path'>Internal</a>", "http://example.org" ) ).toBe( "internal" );
	} );

	it( "should classify relative links with multiple directories as internal", function() {
		expect( linkTypeFunction( "<a href='another-path/directory'>Internal</a>", "http://example.org" ) ).toBe( "internal" );
	} );

	it( "should classify relative links with double-dot notation and multiple directories as internal", function() {
		expect( linkTypeFunction( "<a href='../another-path/directory'>Internal</a>", "http://example.org" ) ).toBe( "internal" );
	} );

	it( "should classify relative links with query params as internal", function() {
		expect( linkTypeFunction( "<a href='another-path?test=123&another=abc'>Internal</a>", "http://example.org" ) ).toBe( "internal" );
	} );

	it( "should classify relative links with empty query params as internal", function() {
		expect( linkTypeFunction( "<a href='another-path?test=&another='>Internal</a>", "http://example.org" ) ).toBe( "internal" );
	} );

	it( "should classify relative links with fragments as internal", function() {
		expect( linkTypeFunction( "<a href='another-path#subheader'>Internal</a>", "http://example.org" ) ).toBe( "internal" );
	} );

	it( "should classify absolute links without host as internal", function() {
		expect( linkTypeFunction( "<a href='/some-path'>Internal</a>", "http://example.org" ) ).toBe( "internal" );
	} );

	it( "should classify absolute links without host with query params as internal", function() {
		expect( linkTypeFunction( "<a href='/some-path?test=123'>Internal</a>", "http://example.org" ) ).toBe( "internal" );
	} );

	it( "should classify absolute links without host with a fragment as internal", function() {
		expect( linkTypeFunction( "<a href='/some-path#subheader'>Internal</a>", "http://example.org" ) ).toBe( "internal" );
	} );

	it( "should classify absolute links without host with query params and fragment as internal", function() {
		expect( linkTypeFunction( "<a href='/some-path?test=123#subheader'>Internal</a>", "http://example.org" ) ).toBe( "internal" );
	} );

	it( "should classify absolute links as internal", function() {
		expect( linkTypeFunction( "<a href='http://yoast.com'>Internal</a>", "http://yoast.com" ) ).toBe( "internal" );
	} );

	it( "should classify absolute links with a different host as external", function() {
		expect( linkTypeFunction( "<a href='http://yoast.com'>Internal</a>", "http://example.com" ) ).toBe( "external" );
	} );

	it( "should classify absolute links with ftp protocol as other", function() {
		expect( linkTypeFunction( "<a href='ftp://yoast.com'>Internal</a>", "http://yoast.com" ) ).toBe( "other" );
	} );

	it( "should classify relative fragment URLs as other", function() {
		expect( linkTypeFunction( "<a href='#subheader'>Internal</a>", "http://yoast.com" ) ).toBe( "other" );
	} );
} );
