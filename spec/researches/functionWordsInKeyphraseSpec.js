import functionWordsInKeyphrase from "../../src/researches/functionWordsInKeyphrase.js";

import Paper from "../../src/values/Paper.js";

describe( "Test for checking if the keyphrase contains function words only", function() {
	it( "returns true if the keyphrase contains one function word only", function() {
		const mockPaper = new Paper( "", { keyword: "a", locale: "en_EN" } );
		expect( functionWordsInKeyphrase( mockPaper ) ).toBe( true );
	} );

	it( "returns true if the keyphrase contains function words only", function() {
		const mockPaper = new Paper( "", { keyword: "un deux", locale: "fr_FR" } );
		expect( functionWordsInKeyphrase( mockPaper ) ).toBe( true );
	} );

	it( "returns true if the keyphrase contains function words only (empty locale)", function() {
		const mockPaper = new Paper( "", { keyword: "something was there" } );
		expect( functionWordsInKeyphrase( mockPaper ) ).toBe( true );
	} );

	it( "returns false for unknown locale", function() {
		const mockPaper = new Paper( "", { keyword: "something", locale: "xx_XX" } );
		expect( functionWordsInKeyphrase( mockPaper ) ).toBe( false );
	} );

	it( "returns false if the keyphrase is embedded in quotes", function() {
		const mockPaper = new Paper( "", { keyword: "\"something was there\"" } );
		expect( functionWordsInKeyphrase( mockPaper ) ).toBe( false );
	} );

	it( "returns false if there are content words in the keyphrase", function() {
		const mockPaper = new Paper( "", { keyword: "something was there and it was pretty" } );
		expect( functionWordsInKeyphrase( mockPaper ) ).toBe( false );
	} );

	it( "returns false if there are content words in the keyphrase", function() {
		const mockPaper = new Paper( "", { keyword: "something was there and it was pretty", locale: "en_EN" } );
		expect( functionWordsInKeyphrase( mockPaper ) ).toBe( false );
	} );

	it( "returns false if there are content words in the keyphrase", function() {
		const mockPaper = new Paper( "", { keyword: "daar zat iets en het was mooi", locale: "nl_NL" } );
		expect( functionWordsInKeyphrase( mockPaper ) ).toBe( false );
	} );

	it( "returns false if there are content words in the keyphrase", function() {
		let mockPaper = new Paper( "", { keyword: "Keyphrase keyphrase keyphrase" } );
		expect( functionWordsInKeyphrase( mockPaper ) ).toBe( false );
	} );
} );
