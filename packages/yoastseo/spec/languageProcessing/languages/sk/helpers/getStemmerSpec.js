import getStemmer from "../../../../../src/languageProcessing/languages/sk/helpers/getStemmer";
import Researcher from "../../../../../src/languageProcessing/languages/sk/Researcher";
import Paper from "../../../../../src/values/Paper";
import getMorphologyData from "../../../../specHelpers/getMorphologyData";

const morphologyDataSK = getMorphologyData( "sk" );

const paper = new Paper(  "", { keyword: "", locale: "sk_SK" }  );

describe( "a test for getting the stemmer for Slovak", function() {
	it( "returns the correctly stemmed Slovak word when the Slovak morphology data is available", function() {
		const mockResearcher = new Researcher( paper );
		mockResearcher.addResearchData( "morphology", morphologyDataSK );
		expect( getStemmer( mockResearcher )( "teplého" ) ).toEqual( "tep" );
	} );

	it( "doesn't stem the word when the Slovak morphology data is not available", function() {
		const mockResearcher = new Researcher( paper );
		expect( getStemmer( mockResearcher )( "teplého" ) ).toEqual( "teplého" );
	} );
} );
