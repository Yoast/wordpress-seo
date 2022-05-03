import getStemmer from "../../../../../src/languageProcessing/languages/tr/helpers/getStemmer";
import Researcher from "../../../../../src/languageProcessing/languages/tr/Researcher";
import Paper from "../../../../../src/values/Paper";
import getMorphologyData from "../../../../specHelpers/getMorphologyData";

const morphologyDataTR = getMorphologyData( "tr" );

const paper = new Paper(  "This is the most special cat.", { keyword: "special cat", locale: "tr_TR" }  );

describe( "a test for getting the stemmer for Turkish", function() {
	it( "returns the correctly stemmed Turkish word when the Turkish morphology data is available", function() {
		const mockResearcher = new Researcher( paper );
		mockResearcher.addResearchData( "morphology", morphologyDataTR );
		expect( getStemmer( mockResearcher )( "tüketimimiz" ) ).toEqual( "tüketim" );
	} );

	it( "doesn't stem the word when the Turkish morphology data is not available", function() {
		const mockResearcher = new Researcher( paper );
		expect( getStemmer( mockResearcher )( "tüketimimiz" ) ).toEqual( "tüketimimiz" );
	} );
} );

