import getStemmer from "../../../../../src/languageProcessing/languages/hu/helpers/getStemmer";
import Researcher from "../../../../../src/languageProcessing/languages/hu/Researcher";
import Paper from "../../../../../src/values/Paper";
import getMorphologyData from "../../../../specHelpers/getMorphologyData";

const morphologyDataHU = getMorphologyData( "hu" );

const paper = new Paper(  "", { keyword: "", locale: "hu_HU" }  );

describe( "a test for getting the stemmer for Hungarian", function() {
	it( "returns the correctly stemmed Hungarian word when the Hungarian morphology data is available", function() {
		const mockResearcher = new Researcher( paper );
		mockResearcher.addResearchData( "morphology", morphologyDataHU );
		expect( getStemmer( mockResearcher )( "macska" ) ).toEqual( "macs" );
	} );

	it( "doesn't stem the word when the Hungarian morphology data is not available", function() {
		const mockResearcher = new Researcher( paper );
		expect( getStemmer( mockResearcher )( "macska" ) ).toEqual( "macska" );
	} );
} );
