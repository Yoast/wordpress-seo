import functionWordsInKeyphrase from "../../../src/languageProcessing/researches/functionWordsInKeyphrase.js";
import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher";
import DutchResearcher from "../../../src/languageProcessing/languages/nl/Researcher";
import FrenchResearcher from "../../../src/languageProcessing/languages/fr/Researcher";
import DefaultResearcher from "../../../src/languageProcessing/languages/_default/Researcher";

import Paper from "../../../src/values/Paper.js";

describe( "Test for checking if the keyphrase contains function words only", function() {
	it( "returns true if the keyphrase contains one function word only", function() {
		const mockPaper = new Paper( "", { keyword: "a", locale: "en_EN" } );
		expect( functionWordsInKeyphrase( mockPaper, new EnglishResearcher( mockPaper ) ) ).toBe( true );
	} );

	it( "returns true if the keyphrase contains function words only", function() {
		const mockPaper = new Paper( "", { keyword: "un deux", locale: "fr_FR" } );
		expect( functionWordsInKeyphrase( mockPaper, new FrenchResearcher( mockPaper ) ) ).toBe( true );
	} );

	it( "returns true if the keyphrase contains function words only (empty locale)", function() {
		const mockPaper = new Paper( "", { keyword: "something was there" } );
		expect( functionWordsInKeyphrase( mockPaper, new EnglishResearcher( mockPaper ) ) ).toBe( true );
	} );

	it( "returns false for unknown locale", function() {
		const mockPaper = new Paper( "", { keyword: "something", locale: "xx_XX" } );
		expect( functionWordsInKeyphrase( mockPaper, new DefaultResearcher( mockPaper ) ) ).toBe( false );
	} );

	it( "returns false if the keyphrase is embedded in quotes", function() {
		const mockPaper = new Paper( "", { keyword: "\"something was there\"" } );
		expect( functionWordsInKeyphrase( mockPaper, new DefaultResearcher( mockPaper ) ) ).toBe( false );
	} );

	it( "returns false if there are content words in the keyphrase", function() {
		const mockPaper = new Paper( "", { keyword: "something was there and it was pretty" } );
		expect( functionWordsInKeyphrase( mockPaper, new EnglishResearcher( mockPaper ) ) ).toBe( false );
	} );

	it( "returns false if there are content words in the keyphrase", function() {
		const mockPaper = new Paper( "", { keyword: "something was there and it was pretty", locale: "en_EN" } );
		expect( functionWordsInKeyphrase( mockPaper, new EnglishResearcher( mockPaper )  ) ).toBe( false );
	} );

	it( "returns false if there are content words in the keyphrase", function() {
		const mockPaper = new Paper( "", { keyword: "daar zat iets en het was mooi", locale: "nl_NL" } );
		expect( functionWordsInKeyphrase( mockPaper, new DutchResearcher( mockPaper ) ) ).toBe( false );
	} );

	it( "returns false if there are content words in the keyphrase", function() {
		const mockPaper = new Paper( "", { keyword: "Keyphrase keyphrase keyphrase" } );
		expect( functionWordsInKeyphrase( mockPaper, new EnglishResearcher( mockPaper ) ) ).toBe( false );
	} );
} );
