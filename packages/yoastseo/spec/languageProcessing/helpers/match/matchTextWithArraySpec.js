import arrayMatch from "../../../../src/languageProcessing/helpers/match/matchTextWithArray.js";

describe( "a test matching strings in an array", function() {
	it( "returns the matches in the array", function() {
		expect( arrayMatch( "this is a test with words.", [ "test", "string", "words" ] ) ).toEqual(
			{ count: 2, matches: [ "test", "words" ] }
		);

		expect( arrayMatch( "This is a test with words. Now comes another test with more words", [ "test", "string", "words" ] ) ).toEqual(
			{ count: 4, matches: [ "test", "test", "words", "words" ] }
		);

		expect( arrayMatch( "This is a test with words. Now comes another Test with more Words", [ "test", "string", "words" ] ) ).toEqual(
			{ count: 4, matches: [ "test", "Test", "words", "Words" ] }
		);

		expect( arrayMatch( "This is a test with some testwords. Now comes another Test with more Words", [ "test", "string", "words" ] ) ).toEqual(
			{ count: 3, matches: [ "test", "Test", "Words" ] }
		);

		expect( arrayMatch( "This is a test with some test's words. Now comes another Test with more Words",
			[ "test", "string", "words" ] ) ).toEqual(
			{ count: 4, matches: [ "test", "Test", "words", "Words" ] }
		);

		expect( arrayMatch( "This is a test with some test's words. Now comes another Test with more Words",
			[ "test", "test's", "string", "words" ] ) ).toEqual(
			{ count: 5, matches: [ "test", "Test", "test's", "words", "Words" ] }
		);

		// Test if the matches are found correctly if one of the words in the array is a substring of another word in the array.
		expect( arrayMatch( "This is a test with some test’s words. Now comes another Test with more Words"
			, [ "test", "te", "string", "words" ] ) ).toEqual(
			{ count: 4, matches: [ "test", "Test", "words", "Words" ] }
		);

		expect( arrayMatch( "this is a test with words.", [ "something" ] ) ).toEqual(
			{ count: 0, matches: [] }
		);
	} );

	it( "returns the correct number of matches for Indonesian", function() {
		expect( arrayMatch( "This text contains buku-buku, buku-buku, and buku.", [ "buku" ], "id_ID" ) ).toEqual(
			{ count: 1, matches: [ "buku" ] }
		);

		expect( arrayMatch( "This text contains buku-buku, buku-buku, and buku.", [ "buku-buku" ], "id_ID" ) ).toEqual(
			{ count: 2, matches: [ "buku-buku", "buku-buku" ] }
		);

		expect( arrayMatch( "This text contains buku-buku, buku-buku, and buku.", [ "buku", "buku-buku" ], "id_ID" ) ).toEqual(
			{ count: 3, matches: [ "buku", "buku-buku", "buku-buku" ] }
		);
	} );
} );
