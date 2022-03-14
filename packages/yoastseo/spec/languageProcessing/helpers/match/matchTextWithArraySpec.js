import arrayMatch from "../../../../src/languageProcessing/helpers/match/matchTextWithArray.js";
import matchWordCustomHelper from "../../../../src/languageProcessing/languages/ja/helpers/matchTextWithWord";

describe( "a test matching strings in an array", function() {
	it( "returns the matches in the array", function() {
		expect( arrayMatch( "this is a test with words.", [ "test", "string", "words" ] ) ).toEqual(
			{ count: 2, matches: [ "test", "words" ], position: 10 }
		);

		expect( arrayMatch( "This is a test with words. Now comes another test with more words", [ "test", "string", "words" ] ) ).toEqual(
			{ count: 4, matches: [ "test", "test", "words", "words" ], position: 10 }
		);

		expect( arrayMatch( "This is a test with words. Now comes another Test with more Words", [ "test", "string", "words" ] ) ).toEqual(
			{ count: 4, matches: [ "test", "Test", "words", "Words" ], position: 10 }
		);

		expect( arrayMatch( "This is a test with some testwords. Now comes another Test with more Words", [ "test", "string", "words" ] ) ).toEqual(
			{ count: 3, matches: [ "test", "Test", "Words" ], position: 10 }
		);

		expect( arrayMatch( "This is a test with some test's words. Now comes another Test with more Words",
			[ "test", "string", "words" ] ) ).toEqual(
			{ count: 4, matches: [ "test", "Test", "words", "Words" ], position: 10 }
		);

		expect( arrayMatch( "This is a test with some test's words. Now comes another Test with more Words",
			[ "test", "test's", "string", "words" ] ) ).toEqual(
			{ count: 5, matches: [ "test", "Test", "test's", "words", "Words" ], position: 10 }
		);

		// Test if the matches are found correctly if one of the words in the array is a substring of another word in the array.
		expect( arrayMatch( "This is a test with some test’s words. Now comes another Test with more Words"
			, [ "test", "te", "string", "words" ] ) ).toEqual(
			{ count: 4, matches: [ "test", "Test", "words", "Words" ], position: 10 }
		);

		expect( arrayMatch( "this is a test with words.", [ "something" ] ) ).toEqual(
			{ count: 0, matches: [], position: -1 }
		);
	} );

	it( "returns the correct number of matches for Indonesian", function() {
		expect( arrayMatch( "This text contains buku-buku, buku-buku, and buku.", [ "buku" ], "id_ID" ) ).toEqual(
			{ count: 1, matches: [ "buku" ], position: 19 }
		);

		expect( arrayMatch( "This text contains buku-buku, buku-buku, and buku.", [ "buku-buku" ], "id_ID" ) ).toEqual(
			{ count: 2, matches: [ "buku-buku", "buku-buku" ], position: 19 }
		);

		expect( arrayMatch( "This text contains buku-buku, buku-buku, and buku.", [ "buku", "buku-buku" ], "id_ID" ) ).toEqual(
			{ count: 3, matches: [ "buku", "buku-buku", "buku-buku" ], position: 19 }
		);
	} );

	it( "returns the correct number of matches for Japanese which uses language specific helper to match word in text", function() {
		expect( arrayMatch( "我が家はみんな元気じゃないです。", [ "日帰り" ], "ja", matchWordCustomHelper ) ).toEqual(
			{ count: 0, matches: [], position: -1 }
		);

		expect( arrayMatch( "日帰りイベントを数回そして5泊6日の国内旅行を予定している。", [ "日帰り" ], "ja", matchWordCustomHelper ) ).toEqual(
			{ count: 1, matches: [ "日帰り" ], position: 0 }
		);

		expect( arrayMatch( "日帰りイベントを数回そして5泊6日の国内旅行を予定している日帰り。", [ "日帰り" ], "ja", matchWordCustomHelper ) ).toEqual(
			{ count: 2, matches: [ "日帰り", "日帰り" ], position: 0 }
		);

		expect( arrayMatch( "これによって少しでも夏休み明けの感染者数を抑えたいという事だけど、どうなるかな。", [ "者数", "感染" ], "ja", matchWordCustomHelper ) ).toEqual(
			{ count: 2, matches: [ "者数", "感染" ], position: 16 }
		);
	} );
} );
