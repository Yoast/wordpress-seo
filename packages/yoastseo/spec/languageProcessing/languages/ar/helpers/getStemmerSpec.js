import getStemmer from "../../../../../src/languageProcessing/languages/ar/helpers/getStemmer";
import Researcher from "../../../../../src/languageProcessing/languages/ar/Researcher";
import Paper from "../../../../../src/values/Paper";
import getMorphologyData from "../../../../specHelpers/getMorphologyData";

const morphologyDataAR = getMorphologyData( "ar" );

const paper = new Paper(  "This is the most special cat.", { keyword: "special cat", locale: "ar_AR" }  );

describe( "a test for getting the stemmer for Arabic", function() {
	it( "returns the correctly stemmed Arabic word when the Arabic morphology data is available", function() {
		const mockResearcher = new Researcher( paper );
		mockResearcher.addResearchData( "morphology", morphologyDataAR );
		expect( getStemmer( mockResearcher )( "المجرمين" ) ).toEqual( "جرم" );
	} );

	it( "doesn't stem the word when the Arabic morphology data is not available", function() {
		const mockResearcher = new Researcher( paper );
		expect( getStemmer( mockResearcher )( "المجرمين" ) ).toEqual( "المجرمين" );
	} );
} );

