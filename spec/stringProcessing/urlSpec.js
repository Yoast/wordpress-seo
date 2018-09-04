var url = require( "../../src/stringProcessing/url" );

describe( "A URL helper", function() {
	describe( "removeHash", function() {
		it( "should remove hashes", function() {
			var input = "http://example.org/#hash";
			var expected = "http://example.org/";

			var actual = url.removeHash( input );

			expect( actual ).toEqual( expected );
		} );

		it( "should not touch URLs without hashes", function() {
			var input = "http://example.org/";
			var expected = "http://example.org/";

			var actual = url.removeHash( input );

			expect( actual ).toEqual( expected );
		} );
	} );

	describe( "removeQueryArgs", function() {
		it( "should remove query arguments", function() {
			var input = "http://example.org/?arg&anotherarg=value";
			var expected = "http://example.org/";

			var actual = url.removeQueryArgs( input );

			expect( actual ).toEqual( expected );
		} );

		it( "should not touch URLs without query arguments", function() {
			var input = "http://example.org/";
			var expected = "http://example.org/";

			var actual = url.removeQueryArgs( input );

			expect( actual ).toEqual( expected );
		} );
	} );

	describe( "removeTrailingSlash", function() {
		it( "should remove a trailing slash", function() {
			var input = "http://example.org/path/";
			var expected = "http://example.org/path";

			var actual = url.removeTrailingSlash( input );

			expect( actual ).toEqual( expected );
		} );

		it( "should not touch a URL without a trailing slash", function() {
			var input = "http://example.org/path";
			var expected = "http://example.org/path";

			var actual = url.removeTrailingSlash( input );

			expect( actual ).toEqual( expected );
		} );
	} );

	describe( "addTrailingSlash", function() {
		it( "should add a trailing slash", function() {
			var input = "http://example.org/path";
			var expected = "http://example.org/path/";

			var actual = url.addTrailingSlash( input );

			expect( actual ).toEqual( expected );
		} );

		it( "should not touch a URL with a trailing slash", function() {
			var input = "http://example.org/path/";
			var expected = "http://example.org/path/";

			var actual = url.addTrailingSlash( input );

			expect( actual ).toEqual( expected );
		} );
	} );

	describe( "getFromAnchorTag", function() {
		it( "should get the link from an anchor", function() {
			var input = "<a href='http://example.org'>Link text</a>";
			var expected = "http://example.org";

			var actual = url.getFromAnchorTag( input );

			expect( actual ).toEqual( expected );
		} );

		it( "should get the link from an anchor with double quotes", function() {
			var input = "<a href=\"http://example.org\">Link text</a>";
			var expected = "http://example.org";

			var actual = url.getFromAnchorTag( input );

			expect( actual ).toEqual( expected );
		} );

		it( "should return an empty string if there is no anchor tag", function() {
			var input = "";
			var expected = "";

			var actual = url.getFromAnchorTag( input );

			expect( actual ).toEqual( expected );
		} );
	} );

	describe( "areEqual", function() {
		it( "should normalize URLs before comparing them", function() {
			var urlA = "http://example.org/hello?queryarg=value";
			var urlB = "http://example.org/hello#hash";
			var expected = true;

			var actual = url.areEqual( urlA, urlB );

			expect( actual ).toBe( expected );
		} );

		it( "should reject different URLs", function() {
			var urlA = "http://example.org/first";
			var urlB = "http://example.org/second";
			var expected = false;

			var actual = url.areEqual( urlA, urlB );

			expect( actual ).toBe( expected );
		} );

		it( "should work with different trailing slashes", function() {
			var urlA = "http://example.org/path";
			var urlB = "http://example.org/path/";
			var expected = true;

			var actual = url.areEqual( urlA, urlB );

			expect( actual ).toBe( expected );
		} );
	} );

	describe( "isInternalLink", function() {
		it( "should identify an absolute internal link with host", function() {
			const urlA = "http://www.google.nl";
			const host = "www.google.nl";
			const expected = true;

			const actual = url.isInternalLink( urlA, host );

			expect( actual ).toBe( expected );
		} );

		it( "should identify an absolute internal link without host", function() {
			const urlA = "/test/abc";
			const host = "www.google.nl";
			const expected = true;

			const actual = url.isInternalLink( urlA, host );

			expect( actual ).toBe( expected );
		} );

		it( "should identify a relative url as an internal link", function() {
			const urlA = "test/abc";
			const host = "www.google.nl";
			const expected = true;

			const actual = url.isInternalLink( urlA, host );

			expect( actual ).toBe( expected );
		} );

		it( "should identify a relative url with double-dot notation as an internal link", function() {
			const urlA = "../test/abc";
			const host = "www.google.nl";
			const expected = true;

			const actual = url.isInternalLink( urlA, host );

			expect( actual ).toBe( expected );
		} );

		it( "should identify a link as external when it contains a different origin", function() {
			const urlA = "http://www.google.nl";
			const host = "www.abc.nl";
			const expected = false;

			const actual = url.isInternalLink( urlA, host );

			expect( actual ).toBe( expected );
		} );
	} );

	describe( "getProtocol", function() {
		it( "should return null when passing a relative URL", function() {
			const urlA = "relative/url";

			const actual = url.getProtocol( urlA );

			expect( actual ).toBeNull();
		} );

		it( "should return the correct protocol", function() {
			const urlA = "http://www.google.nl";
			const expected = "http:";

			const actual = url.getProtocol( urlA );

			expect( actual ).toBe( expected );
		} );
	} );

	describe( "isRelativeFragmentURL", function() {
		it( "recognizes a relative fragment URL", function() {
			const urlA = "#relative-fragment-url";
			const expected = true;

			const actual = url.isRelativeFragmentURL( urlA );

			expect( actual ).toBe( expected );
		} );

		it( "returns false on a non-relative fragment url", function() {
			const urlA = "http://www.google.nl/#relative-fragment-url";
			const expected = false;

			const actual = url.isRelativeFragmentURL( urlA );

			expect( actual ).toBe( expected );
		} );

		it( "returns false on a regular url", function() {
			const urlA = "http://www.google.nl/";
			const expected = false;

			const actual = url.isRelativeFragmentURL( urlA );

			expect( actual ).toBe( expected );
		} );
	} );

	describe( "protocolIsHttpScheme", function() {
		it( "recognizes http as a http scheme protocol", function() {
			const protocol = "http:";
			const expected = true;

			const actual = url.protocolIsHttpScheme( protocol );

			expect( actual ).toBe( expected );
		} );

		it( "returns false when no protocol is passed", function() {
			const expected = false;

			const actual = url.protocolIsHttpScheme( null );

			expect( actual ).toBe( expected );
		} );
	} );
} );
