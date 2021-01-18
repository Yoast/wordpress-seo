import getStemmer from "../../../../../src/languageProcessing/languages/pt/helpers/getStemmer";
import Researcher from "../../../../../src/languageProcessing/languages/pt/Researcher";
import Paper from "../../../../../src/values/Paper";
import getMorphologyData from "../../../../specHelpers/getMorphologyData";

const morphologyDataPT = getMorphologyData( "pt" );

const paper = new Paper(  "This is the most special cat.", { keyword: "special cat", locale: "en_US" }  );

describe( "a test for getting the stemmer for Portuguese", function() {
	it( "returns the correctly stemmed Portuguese word when the Portuguese morphology data is available", function() {
		const mockResearcher = new Researcher( paper );
		mockResearcher.addResearchData( "morphology", morphologyDataPT );
		expect( getStemmer( mockResearcher )( "gatas" ) ).toEqual( "gat" );
	} );

	it( "doesn't stem the word when the Portuguese morphology data is not available", function() {
		const mockResearcher = new Researcher( paper );
		expect( getStemmer( mockResearcher )( "gatos" ) ).toEqual( "gatos" );
	} );
} );
