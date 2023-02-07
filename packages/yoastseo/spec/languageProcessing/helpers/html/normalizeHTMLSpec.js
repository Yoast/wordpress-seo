import normalizeHTML from "../../../../src/languageProcessing/helpers/html/normalizeHTML";

describe( "normalizeHTML", function() {
	it( "should return the same string when no single quotes are present", function() {
		expect( normalizeHTML( "This is a test" ) )
			.toEqual( "This is a test" );
	} );

	it( "should return the same string when only double quotes in HTML attribute values are present", function() {
		expect( normalizeHTML( "<yoastmark class=\"yoast-text-mark\">This is a test</yoastmark>" ) )
			.toEqual( "<yoastmark class=\"yoast-text-mark\">This is a test</yoastmark>" );
	} );

	it( "should return the same string when a string contains non breaking spaces.", function() {
		expect( normalizeHTML( "<yoastmark class=\"yoast-text-mark\">This\u{00a0}is a\u{00a0}test</yoastmark>" ) )
			.toEqual( "<yoastmark class=\"yoast-text-mark\">This\u{00a0}is a\u{00a0}test</yoastmark>" );
	} );

	it( "should not replace single quotes (or apostrophes) outside HTML tags", function() {
		expect( normalizeHTML( "This is a test, let's go!" ) )
			.toEqual( "This is a test, let's go!" );
	} );

	it( "should replace the outer single quotes in HTML attribute values with double quotes", function() {
		expect( normalizeHTML( "<span style='color: red'>This</span> is a test" ) )
			.toEqual( "<span style=\"color: red\">This</span> is a test" );
	} );

	it( "should not replace any inner single quotes in HTML attribute values", function() {
		expect( normalizeHTML( "<span data-attr=\"let's go, time's up\">This</span> is a test" ) )
			.toEqual( "<span data-attr=\"let's go, time's up\">This</span> is a test" );
	} );

	it( "should replace the outer single quotes in multiple HTML attribute values with double quotes", function() {
		expect( normalizeHTML( "<yoastmark class='yoast-text-mark' style='color: blue'>This is a test</yoastmark>" ) )
			.toEqual( "<yoastmark class=\"yoast-text-mark\" style=\"color: blue\">This is a test</yoastmark>" );
	} );
} );
