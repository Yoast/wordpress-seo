var url = require( "../../js/stringProcessing/url" );

describe( "A URL helper", function() {
	describe( "removeHash", function() {
		it( "should remove hashes", function() {
			var input = "http://example.org/#hash";
			var expected = "http://example.org/";

			var actual = url.removeHash( input );

			expect( actual ).toEqual( expected );
		});

		it( "should not touch URLs without hashes", function() {
			var input = "http://example.org/";
			var expected = "http://example.org/";

			var actual = url.removeHash( input );

			expect( actual ).toEqual( expected );
		});
	});

	describe( "removeQueryArgs", function() {
		it( "should remove query arguments", function() {
			var input = "http://example.org/?arg&anotherarg=value";
			var expected = "http://example.org/";

			var actual = url.removeQueryArgs( input );

			expect( actual ).toEqual( expected );
		});

		it( "should not touch URLs without query arguments", function() {
			var input = "http://example.org/";
			var expected = "http://example.org/";

			var actual = url.removeQueryArgs( input );

			expect( actual ).toEqual( expected );
		});
	});

	describe( "removeTrailingSlash", function() {
		it( "should remove a trailing slash", function() {
			var input = "http://example.org/path/";
			var expected = "http://example.org/path";

			var actual = url.removeTrailingSlash( input );

			expect( actual ).toEqual( expected );
		});

		it( "should not touch a URL without a trailing slash", function() {
			var input = "http://example.org/path";
			var expected = "http://example.org/path";

			var actual = url.removeTrailingSlash( input );

			expect( actual ).toEqual( expected );
		});
	});

	describe( "addTrailingSlash", function() {
		it( "should add a trailing slash", function() {
			var input = "http://example.org/path";
			var expected = "http://example.org/path/";

			var actual = url.addTrailingSlash( input );

			expect( actual ).toEqual( expected );
		});

		it( "should not touch a URL with a trailing slash", function() {
			var input = "http://example.org/path/";
			var expected = "http://example.org/path/";

			var actual = url.addTrailingSlash( input );

			expect( actual ).toEqual( expected );
		});
	});

	describe( "getFromAnchorTag", function() {
		it( "should get the link from an anchor", function() {
			var input = "<a href='http://example.org'>Link text</a>";
			var expected = "http://example.org";

			var actual = url.getFromAnchorTag( input );

			expect( actual ).toEqual( expected );
		});

		it( "should get the link from an anchor with double quotes", function() {
			var input = "<a href=\"http://example.org\">Link text</a>";
			var expected = "http://example.org";

			var actual = url.getFromAnchorTag( input );

			expect( actual ).toEqual( expected );
		});

		it( "should return an empty string if there is no anchor tag", function() {
			var input = "";
			var expected = "";

			var actual = url.getFromAnchorTag( input );

			expect( actual ).toEqual( expected );
		});
	});

	describe( "areEqual", function() {
		it( "should normalize URLs before comparing them", function() {
			var urlA = "http://example.org/hello?queryarg=value";
			var urlB = "http://example.org/hello#hash";
			var expected = true;

			var actual = url.areEqual( urlA, urlB );

			expect( actual ).toBe( expected );
		});

		it( "should reject different URLs", function() {
			var urlA = "http://example.org/first";
			var urlB = "http://example.org/second";
			var expected = false;

			var actual = url.areEqual( urlA, urlB );

			expect( actual ).toBe( expected );
		});

		it( "should work with different trailing slashes", function() {
			var urlA = "http://example.org/path";
			var urlB = "http://example.org/path/";
			var expected = true;

			var actual = url.areEqual( urlA, urlB );

			expect( actual ).toBe( expected );
		});
	});
});
