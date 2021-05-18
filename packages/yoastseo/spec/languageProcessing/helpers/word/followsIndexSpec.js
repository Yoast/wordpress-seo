import followsIndex from "../../../../src/languageProcessing/helpers/word/followsIndex.js";

describe( "a test to check whether a given word is followed by any word from a given list", function() {
	it( "returns true if the match is followed by a given word", function() {
		const followingWords = [
			{ match: "the", index: 2 } ];
		const match = { index: 0, match: "is" };
		expect( followsIndex( followingWords, match ) ).toBe( true );
	} );

	it( "returns false if the match is not followed by a given word", function() {
		const followingWords = [
			{ match: "the", index: 1 } ];
		const match = { index: 3, match: "is" };
		expect( followsIndex( followingWords, match ) ).toBe( false );
	} );

	it( "returns false if the following words is empty", function() {
		const followingWords = [];
		const match = { index: 3, match: "is" };
		expect( followsIndex( followingWords, match ) ).toBe( false );
	} );
} );
