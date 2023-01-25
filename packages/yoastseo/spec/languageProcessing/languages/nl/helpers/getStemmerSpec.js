import getStemmer from "../../../../../src/languageProcessing/languages/nl/helpers/getStemmer";
import Researcher from "../../../../../src/languageProcessing/languages/nl/Researcher";
import Paper from "../../../../../src/values/Paper";
import getMorphologyData from "../../../../specHelpers/getMorphologyData";

const morphologyDataNL = getMorphologyData( "nl" );

const paper = new Paper(  "", { keyword: "", locale: "nl_NL" }  );

describe( "a test for getting the stemmer for Dutch", function() {
	it( "returns the correctly stemmed Dutch word when the Dutch morphology data is available", function() {
		const mockResearcher = new Researcher( paper );
		mockResearcher.addResearchData( "morphology", morphologyDataNL );
		expect( getStemmer( mockResearcher )( "katten" ) ).toEqual( "kat" );
	} );

	it( "doesn't stem the word when the Dutch morphology data is not available", function() {
		const mockResearcher = new Researcher( paper );
		expect( getStemmer( mockResearcher )( "katten" ) ).toEqual( "katten" );
	} );
} );
