import getStemmer from "../../../../../src/languageProcessing/languages/de/helpers/getStemmer";
import Researcher from "../../../../../src/languageProcessing/languages/de/Researcher";
import Paper from "../../../../../src/values/Paper";
import getMorphologyData from "../../../../specHelpers/getMorphologyData";

const morphologyDataDE = getMorphologyData( "de" );

const paper = new Paper(  "", { keyword: "", locale: "de_DE" }  );

describe( "a test for getting the stemmer for German", function() {
	it( "returns the correctly stemmed German word when the German morphology data is available", function() {
		const mockResearcher = new Researcher( paper );
		mockResearcher.addResearchData( "morphology", morphologyDataDE );
		expect( getStemmer( mockResearcher )( "Katzen" ) ).toEqual( "Katz" );
	} );

	it( "doesn't stem the word when the German morphology data is not available", function() {
		const mockResearcher = new Researcher( paper );
		expect( getStemmer( mockResearcher )( "Katzen" ) ).toEqual( "Katzen" );
	} );
} );
