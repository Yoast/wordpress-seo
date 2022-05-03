import getStemmer from "../../../../../src/languageProcessing/languages/he/helpers/getStemmer";
import Researcher from "../../../../../src/languageProcessing/languages/he/Researcher";
import Paper from "../../../../../src/values/Paper";
import getMorphologyData from "../../../../specHelpers/getMorphologyData";

const morphologyDataHE = getMorphologyData( "he" );

const paper = new Paper(  "This is the most special cat.", { keyword: "special cat", locale: "he_IL" }  );

describe( "a test for getting the stemmer for Hebrew", function() {
	it( "returns the correctly stemmed Hebrew word when the Hebrew morphology data is available", function() {
		const mockResearcher = new Researcher( paper );
		mockResearcher.addResearchData( "morphology", morphologyDataHE );
		expect( getStemmer( mockResearcher )( "באהבה" ) ).toEqual( "אהב" );
	} );

	it( "doesn't stem the word when the Hebrew morphology data is not available", function() {
		const mockResearcher = new Researcher( paper );
		expect( getStemmer( mockResearcher )( "באהבה" ) ).toEqual( "באהבה" );
	} );
} );

