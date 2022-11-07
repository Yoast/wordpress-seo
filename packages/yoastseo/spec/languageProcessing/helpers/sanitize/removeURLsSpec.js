import removeURLs from "../../../../src/languageProcessing/helpers/sanitize/removeURLs.js";

describe( "a test for removing URLs from a string", function() {
	it( "removes a base URL", function() {
		expect( removeURLs( "https://example.com" ) ).toBe( "" );
	} );
	it( "removes a URL followed by a subdirectory", function() {
		expect( removeURLs( "https://example.com/example1" ) ).toBe( "" );
	} );
	it( "removes a URL followed by multiple subdirectories", function() {
		expect( removeURLs( "https://example.com/example1/part1" ) ).toBe( "" );
	} );
	it( "removes a URL with a subdomain", function() {
		expect( removeURLs( "https://blog.example.com/examples" ) ).toBe( "" );
	} );
	it( "removes a URL starting with http://", function() {
		expect( removeURLs( "http://blog.example.com/examples" ) ).toBe( "" );
	} );
	it( "removes a URL containing www.", function() {
		expect( removeURLs( "http://www.blog.example.com/examples" ) ).toBe( "" );
	} );
	it( "removes a URL containing special characters.", function() {
		expect( removeURLs( "https://www.example.com/foo/?bar=baz&inga=42&quux" ) ).toBe( "" );
	} );
	it( "removes a URL containing more special characters.", function() {
		expect( removeURLs( "http://foo.com/blah_(wikipedia)_blah#cite-1" ) ).toBe( "" );
	} );
	it( "removes a URL with a different top-level domain", function() {
		expect( removeURLs( "http://example.co.uk" ) ).toBe( "" );
	} );
	it( "does not remove a string if it doesn't start with http(s)://", function() {
		expect( removeURLs( "example.com" ) ).toBe( "blog.example.com/examples" );
	} );
} );
