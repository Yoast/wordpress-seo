import url from "../../../../src/languageProcessing/helpers/url/url";

describe( "A URL helper", function() {
	describe( "removeHash", function() {
		it( "should remove hashes", function() {
			const input = "http://example.org/#hash";
			const expected = "http://example.org/";

			const actual = url.removeHash( input );

			expect( actual ).toEqual( expected );
		} );

		it( "should not touch URLs without hashes", function() {
			const input = "http://example.org/";
			const expected = "http://example.org/";

			const actual = url.removeHash( input );

			expect( actual ).toEqual( expected );
		} );
	} );

	describe( "removeQueryArgs", function() {
		it( "should remove query arguments", function() {
			const input = "http://example.org/?arg&anotherarg=value";
			const expected = "http://example.org/";

			const actual = url.removeQueryArgs( input );

			expect( actual ).toEqual( expected );
		} );

		it( "should not touch URLs without query arguments", function() {
			const input = "http://example.org/";
			const expected = "http://example.org/";

			const actual = url.removeQueryArgs( input );

			expect( actual ).toEqual( expected );
		} );
	} );

	describe( "removeTrailingSlash", function() {
		it( "should remove a trailing slash", function() {
			const input = "http://example.org/path/";
			const expected = "http://example.org/path";

			const actual = url.removeTrailingSlash( input );

			expect( actual ).toEqual( expected );
		} );

		it( "should not touch a URL without a trailing slash", function() {
			const input = "http://example.org/path";
			const expected = "http://example.org/path";

			const actual = url.removeTrailingSlash( input );

			expect( actual ).toEqual( expected );
		} );
	} );

	describe( "addTrailingSlash", function() {
		it( "should add a trailing slash", function() {
			const input = "http://example.org/path";
			const expected = "http://example.org/path/";

			const actual = url.addTrailingSlash( input );

			expect( actual ).toEqual( expected );
		} );

		it( "should not touch a URL with a trailing slash", function() {
			const input = "http://example.org/path/";
			const expected = "http://example.org/path/";

			const actual = url.addTrailingSlash( input );

			expect( actual ).toEqual( expected );
		} );
	} );

	describe( "getFromAnchorTag", function() {
		it( "should get the link from an anchor", function() {
			const input = "<a href='http://example.org'>Link text</a>";
			const expected = "http://example.org";

			const actual = url.getFromAnchorTag( input );

			expect( actual ).toEqual( expected );
		} );

		it( "should get the link from an anchor with double quotes", function() {
			const input = "<a href=\"http://example.org\">Link text</a>";
			const expected = "http://example.org";

			const actual = url.getFromAnchorTag( input );

			expect( actual ).toEqual( expected );
		} );

		it( "should return an empty string if there is no anchor tag", function() {
			const input = "";
			const expected = "";

			const actual = url.getFromAnchorTag( input );

			expect( actual ).toEqual( expected );
		} );
	} );

	describe( "areEqual", function() {
		it( "should normalize URLs before comparing them", function() {
			const urlA = "http://example.org/hello?queryarg=value";
			const urlB = "http://example.org/hello#hash";
			const expected = true;

			const actual = url.areEqual( urlA, urlB );

			expect( actual ).toBe( expected );
		} );

		it( "should reject different URLs", function() {
			const urlA = "http://example.org/first";
			const urlB = "http://example.org/second";
			const expected = false;

			const actual = url.areEqual( urlA, urlB );

			expect( actual ).toBe( expected );
		} );

		it( "should work with different trailing slashes", function() {
			const urlA = "http://example.org/path";
			const urlB = "http://example.org/path/";
			const expected = true;

			const actual = url.areEqual( urlA, urlB );

			expect( actual ).toBe( expected );
		} );
	} );

	describe( "isInternalLink", function() {
		it( "should identify an absolute internal link with host", function() {
			const anchorUrl = "http://www.google.nl";
			const siteUrl = "http://www.google.nl";
			const expected = true;

			const actual = url.isInternalLink( anchorUrl, siteUrl );

			expect( actual ).toBe( expected );
		} );

		it( "should identify an absolute internal link without host", function() {
			const anchorUrl = "/test/abc";
			const siteUrl = "http://www.google.nl";
			const expected = true;

			const actual = url.isInternalLink( anchorUrl, siteUrl );

			expect( actual ).toBe( expected );
		} );

		it( "should identify a relative url as an internal link", function() {
			const anchorUrl = "test/abc";
			const siteUrl = "http://www.google.nl";
			const expected = true;

			const actual = url.isInternalLink( anchorUrl, siteUrl );

			expect( actual ).toBe( expected );
		} );

		it( "should identify a relative url with double-dot notation as an internal link", function() {
			const anchorUrl = "../test/abc";
			const siteUrl = "http://www.google.nl";
			const expected = true;

			const actual = url.isInternalLink( anchorUrl, siteUrl );

			expect( actual ).toBe( expected );
		} );

		it( "should identify a link as external when it contains a different origin", function() {
			const anchorUrl = "http://www.google.nl";
			const siteUrl = "http://www.abc.nl";
			const expected = false;

			const actual = url.isInternalLink( anchorUrl, siteUrl );

			expect( actual ).toBe( expected );
		} );

		it( "returns false if the URL starts with a # indicating a fragment", function() {
			const anchorUrl = "#tortoiseshell-cat";
			const siteUrl = "http://www.thehappycat.com";

			const actual = url.isInternalLink( anchorUrl, siteUrl );

			expect( actual ).toBe( false );
		} );

		it( "returns true if the site URL is set to only the domain, and it's the same as the text link's host", function() {
			const anchorUrl = "https://yoast.com/your-shopify-store-on-google/";
			const siteDomain = "yoast.com";

			const actual = url.isInternalLink( anchorUrl, siteDomain );

			expect( actual ).toBe( true );
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

		it( "recognizes https as a https scheme protocol", function() {
			const protocol = "https:";
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

	describe( "getHostname", function() {
		it( "returns domain name of the URL", function() {
			const input = "https://www.catster.com/cats-101/facts-about-tortoiseshell-cats";
			const expected = "www.catster.com";

			const actual = url.getHostname( input );

			expect( actual ).toEqual( expected );
		} );
	} );
} );
