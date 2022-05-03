import getStemmer from "../../../../../src/languageProcessing/languages/it/helpers/getStemmer";
import Researcher from "../../../../../src/languageProcessing/languages/it/Researcher";
import Paper from "../../../../../src/values/Paper";
import getMorphologyData from "../../../../specHelpers/getMorphologyData";

const morphologyDataIT = getMorphologyData( "it" );

const paper = new Paper( "Questo è il gatto più speciale.", { keyword: "gatto speciale", locale: "it_IT" }  );

describe( "a test for getting the stemmer for Italian", function() {
	it( "returns the correctly stemmed Italian word when the Italian morphology data is available", function() {
		const mockResearcher = new Researcher( paper );
		mockResearcher.addResearchData( "morphology", morphologyDataIT );
		expect( getStemmer( mockResearcher )( "gatte" ) ).toEqual( "gatt" );
	} );

	it( "doesn't stem the word when the Italian morphology data is not available", function() {
		const mockResearcher = new Researcher( paper );
		expect( getStemmer( mockResearcher )( "gatti" ) ).toEqual( "gatti" );
	} );
} );
