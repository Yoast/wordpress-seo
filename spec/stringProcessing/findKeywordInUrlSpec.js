import findKeywordInUrl from "../../src/stringProcessing/findKeywordInUrl";

describe( "findKeywordInUrl", function() {
	it( "returns false when passed no anchor tag", function() {
		expect( findKeywordInUrl( "bogus" ) ).toBe( false );
	} );
} );

describe( "checks keyword occurences in links", function() {
	it( "returns keywords found", function() {
		expect( findKeywordInUrl( "<a href='http://yoast.com'>test</a>", "yoast" ) ).toBe( false );
		expect( findKeywordInUrl( "<a href='http://yoast.com'>yoast</a>", "yoast" ) ).toBe( true );
		expect( findKeywordInUrl( "<a href='http://yoast.com'>$yoast</a>", "$yoast" ) ).toBe( true );
	} );
} );

