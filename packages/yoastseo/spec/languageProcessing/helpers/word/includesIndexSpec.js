import includesIndex from "../../../../src/languageProcessing/helpers/word/includesIndex";

describe( "a test for checking whether a given word is directly preceded by a word from a list of words or not", function() {
	it( "returns true if the match is preceded by a given word", function() {
		const precedingWords = [
			{ match: "have", index: 2 },
		];
		expect( includesIndex( precedingWords, 7 ) ).toEqual( true );
	} );

	it( "returns false if the match is not preceded by a given word", function() {
		const precedingWords = [
			{ match: "have", index: 5 },
		];
		expect( includesIndex( precedingWords, 2, false ) ).toEqual( false );
	} );

	it( "returns false if the preceding word is empty", function() {
		const precedingWords = [];
		expect( includesIndex( precedingWords, 3 ) ).toEqual( false );
	} );
} );

