import getStemmer from "../../../../../src/languageProcessing/languages/fr/helpers/getStemmer";
import Researcher from "../../../../../src/languageProcessing/languages/fr/Researcher";
import Paper from "../../../../../src/values/Paper";
import getMorphologyData from "../../../../specHelpers/getMorphologyData";

const morphologyDataFR = getMorphologyData( "fr" );

const paper = new Paper(  "", { keyword: "", locale: "fr_FR" }  );

describe( "a test for getting the stemmer for French", function() {
	it( "returns the correctly stemmed French word when the French morphology data is available", function() {
		const mockResearcher = new Researcher( paper );
		mockResearcher.addResearchData( "morphology", morphologyDataFR );
		expect( getStemmer( mockResearcher )( "chats" ) ).toEqual( "chat" );
	} );

	it( "doesn't stem the word when the French morphology data is not available", function() {
		const mockResearcher = new Researcher( paper );
		expect( getStemmer( mockResearcher )( "chats" ) ).toEqual( "chats" );
	} );
} );
