import replaceSingleQuotesInTags from "../../../../src/languageProcessing/helpers/html/replaceQuotes";

describe( "replace-quotes", function() {
	describe( "replaceSingleQuotesInTags", function() {
		it( "should return the same string when no single quotes are present", function() {
			expect( replaceSingleQuotesInTags( "This is a test" ) )
				.toEqual( "This is a test" );
		} );

		it( "should return the same string when only double quotes in HTML attribute values are present", function() {
			expect( replaceSingleQuotesInTags( "<yoastmark class=\"yoast-text-mark\">This is a test</yoastmark>" ) )
				.toEqual( "<yoastmark class=\"yoast-text-mark\">This is a test</yoastmark>" );
		} );

		it( "should not replace single quotes outside HTML tags", function() {
			expect( replaceSingleQuotesInTags( "This is a test, let's go!" ) )
				.toEqual( "This is a test, let's go!" );
		} );

		it( "should replace the outer single quotes in HTML attribute values with double quotes", function() {
			expect( replaceSingleQuotesInTags( "<span style='color: red'>This</span> is a test" ) )
				.toEqual( "<span style=\"color: red\">This</span> is a test" );
		} );

		it( "should not replace any inner single quotes in HTML attribute values", function() {
			expect( replaceSingleQuotesInTags( "<span data-attr=\"let's go, time's up\">This</span> is a test" ) )
				.toEqual( "<span data-attr=\"let's go, time's up\">This</span> is a test" );
		} );

		it( "should replace the outer single quotes in multiple HTML attribute values with double quotes", function() {
			expect( replaceSingleQuotesInTags( "<yoastmark class='yoast-text-mark' style='color: blue'>This is a test</yoastmark>" ) )
				.toEqual( "<yoastmark class=\"yoast-text-mark\" style=\"color: blue\">This is a test</yoastmark>" );
		} );
	} );
} );
