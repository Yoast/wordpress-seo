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
	it( "removes a URL starting with www.", function() {
		expect( removeURLs( "www.blog.example.com/examples" ) ).toBe( "" );
	} );
	it( "removes a URL starting with ftp", function() {
		expect( removeURLs( "ftp://example.com" ) ).toBe( "" );
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
	it( "removes a URL followed by Japanese characters", function() {
		expect( removeURLs( "https://example.comこれに対し日本国有鉄道" ) ).toBe( "これに対し日本国有鉄道" );
	} );
	it( "does not remove a URL that doesn't start with 'http(s)://', 'ftp://' or 'www'.", function() {
		expect( removeURLs( "example.com" ) ).toBe( "example.com" );
	} );
	it( "does not remove https:// on its own", function() {
		expect( removeURLs( "https://" ) ).toBe( "https://" );
	} );
	it( "does not remove a URL without a top-level domain", function() {
		expect( removeURLs( "https://example" ) ).toBe( "https://example" );
	} );
} );
