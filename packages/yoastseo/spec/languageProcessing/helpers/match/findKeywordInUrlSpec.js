import findKeywordInUrl from "../../../../src/languageProcessing/helpers/match/findKeywordInUrl";
import matchWordCustomHelper from "../../../../src/languageProcessing/languages/ja/helpers/matchTextWithWord";

describe( "findKeywordInUrl", function() {
	it( "returns false when passed no anchor tag", function() {
		expect( findKeywordInUrl( "bogus", {}, "xx_XX" ) ).toBe( false );
	} );
} );

describe( "checks keyword occurences in links", function() {
	let mockExactMatchRequestObject = {
		exactMatchRequested: false,
		keyphrase: "yoast",
	};
	it( "returns keywords found", function() {
		expect( findKeywordInUrl( "<a href='http://yoast.com'>test</a>",
			{ keyphraseForms: [ [ "yoast" ] ] },
			"en_US",
			false,
			mockExactMatchRequestObject
		) ).toBe( false );
	} );

	it( "returns keywords found", function() {
		expect( findKeywordInUrl( "<a href='http://yoast.com'>yoast</a>",
			{ keyphraseForms: [ [ "yoast" ] ] },
			"en_US",
			false,
			mockExactMatchRequestObject
		) ).toBe( true );
	} );

	it( "returns keywords found for a language that has a custom helper for matching words", function() {
		const url = "<a href='http://yoast.com'>yoast</a>";
		expect( findKeywordInUrl( url,
			{ keyphraseForms: [ [ "yoast" ] ] },
			"ja",
			matchWordCustomHelper,
			mockExactMatchRequestObject
		) ).toBe( true );
	} );

	mockExactMatchRequestObject = {
		exactMatchRequested: true,
		keyphrase: "yoast",
	};

	it( "returns keywords found for when the exact match is requested", function() {
		const url = "<a href='http://yoast.com'>yoast</a>";
		expect( findKeywordInUrl( url,
			{ keyphraseForms: [ [ "yoast" ] ] },
			"en_US",
			matchWordCustomHelper,
			mockExactMatchRequestObject
		) ).toBe( true );
	} );
	/*
	// This test does not work with the current implementation of morphological researcher.
	it( "returns keywords found", function() {
		expect( findKeywordInUrl( "<a href='http://yoast.com'>$yoast</a>", { keyphraseForms: [ [ "$yoast" ] ] } ) ).toBe( true );
	} );
	*/
} );
