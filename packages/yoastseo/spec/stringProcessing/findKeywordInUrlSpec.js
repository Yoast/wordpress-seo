import findKeywordInUrl from "../../src/stringProcessing/findKeywordInUrl";

describe( "findKeywordInUrl", function() {
	it( "returns false when passed no anchor tag", function() {
		expect( findKeywordInUrl( "bogus", {}, "xx_XX" ) ).toBe( false );
	} );
} );

describe( "checks keyword occurences in links", function() {
	it( "returns keywords found", function() {
		expect( findKeywordInUrl( "<a href='http://yoast.com'>test</a>", { keyphraseForms: [ [ "yoast" ] ] } ) ).toBe( false );
	} );

	it( "returns keywords found", function() {
		expect( findKeywordInUrl( "<a href='http://yoast.com'>yoast</a>", { keyphraseForms: [ [ "yoast" ] ] } ) ).toBe( true );
	} );

	/*
	// This test does not work with the current implementation of morphological researcher.
	it( "returns keywords found", function() {
		expect( findKeywordInUrl( "<a href='http://yoast.com'>$yoast</a>", { keyphraseForms: [ [ "$yoast" ] ] } ) ).toBe( true );
	} );
	*/
} );
