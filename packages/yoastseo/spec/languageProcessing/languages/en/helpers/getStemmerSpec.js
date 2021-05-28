import getStemmer from "../../../../../src/languageProcessing/languages/en/helpers/getStemmer";
import Researcher from "../../../../../src/languageProcessing/languages/en/Researcher";
import Paper from "../../../../../src/values/Paper";
import getMorphologyData from "../../../../specHelpers/getMorphologyData";

const morphologyDataEN = getMorphologyData( "en" );

const paper = new Paper(  "This is the most special cat.", { keyword: "special cat", locale: "en_US" }  );

describe( "a test for getting the stemmer for English", function() {
	it( "returns the correctly stemmed English word when the English morphology data is available", function() {
		const mockResearcher = new Researcher( paper );
		mockResearcher.addResearchData( "morphology", morphologyDataEN );
		expect( getStemmer( mockResearcher )( "cats" ) ).toEqual( "cat" );
	} );

	it( "doesn't stem the word when the English morphology data is not available", function() {
		const mockResearcher = new Researcher( paper );
		expect( getStemmer( mockResearcher )( "cats" ) ).toEqual( "cats" );
	} );
} );
