import findKeywordInUrl from "../../../../src/languageProcessing/helpers/match/findKeywordInUrl";
import matchWordCustomHelper from "../../../../src/languageProcessing/languages/ja/helpers/matchTextWithWord";

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

	it( "returns keywords found for a language that has a custom helper for matching words", function() {
		const url = "<a href='http://yoast.com'>yoast</a>";
		expect( findKeywordInUrl( url, { keyphraseForms: [ [ "yoast" ] ] }, "ja", matchWordCustomHelper ) ).toBe( true );
	} );

	/*
	// This test does not work with the current implementation of morphological researcher.
	it( "returns keywords found", function() {
		expect( findKeywordInUrl( "<a href='http://yoast.com'>$yoast</a>", { keyphraseForms: [ [ "$yoast" ] ] } ) ).toBe( true );
	} );
	*/
} );
